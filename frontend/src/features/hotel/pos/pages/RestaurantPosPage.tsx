import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed, Plus, Minus, Trash2, Search, Send, Printer,
  CreditCard, Banknote, Smartphone, Gift, BedDouble,
  Receipt, Clock, CheckCircle2, XCircle, ShoppingCart, Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  useOutlets, useServices, usePosOrders,
  useCreatePosOrder, useBillOrder, usePostToRoom, useKotPrint
} from '../api/useHotelPOS';
import type { HotelService, PosOrder, CartItem } from '../schemas/posSchema';
import { PAYMENT_MODES, STATUS_CONFIG, POS_CATEGORY_FILTERS } from '../constants/posConstants';
import { useHotelBookings } from '../../bookings/api/useBookings';

export function RestaurantPosPage() {
  const navigate = useNavigate();

  // Selections
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);
  const [orderType, setOrderType] = useState<'dine_in' | 'room_service' | 'takeaway'>('dine_in');
  const [tableNo, setTableNo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [serviceSearch, setServiceSearch] = useState('');

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Modals
  const [showBillModal, setShowBillModal] = useState(false);
  const [showPostRoomModal, setShowPostRoomModal] = useState(false);
  const [billOrderId, setBillOrderId] = useState<number | null>(null);
  const [postOrderId, setPostOrderId] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState('cash');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');

  // Tabs
  const [tab, setTab] = useState<'pos' | 'orders'>('pos');

  const { data: outlets = [] } = useOutlets();
  const { data: services = [] } = useServices({
    outlet_id: selectedOutlet ?? undefined,
    is_available: true,
  } as any);
  const { data: ordersRaw = [] } = usePosOrders({ outlet_id: selectedOutlet ?? undefined });
  const { data: bookingsRaw } = useHotelBookings();

  const checkedInBookings = useMemo(() => {
    const d = bookingsRaw as any;
    const arr = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []);
    return arr.filter((b: any) => b.status === 'checked_in');
  }, [bookingsRaw]);

  const orders: PosOrder[] = Array.isArray(ordersRaw) ? ordersRaw : [];

  const createOrder = useCreatePosOrder();
  const billOrder   = useBillOrder();
  const postToRoom  = usePostToRoom();
  const kotPrint    = useKotPrint();

  // Filtered services
  const filteredServices = useMemo(() =>
    services.filter(s =>
      (categoryFilter === 'All' || s.category === categoryFilter) &&
      (!serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
    ), [services, categoryFilter, serviceSearch]);

  // Group by category
  const serviceGroups = useMemo(() =>
    filteredServices.reduce((acc: Record<string, HotelService[]>, s) => {
      if (!acc[s.category]) acc[s.category] = [];
      acc[s.category].push(s);
      return acc;
    }, {}), [filteredServices]);

  // ─── Cart helpers ──────────────────────────────────────────────────────────

  const addToCart = (s: HotelService) => {
    setCart(prev => {
      const idx = prev.findIndex(c => c.service_id === s.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
        return updated;
      }
      return [...prev, { service_id: s.id, name: s.name, category: s.category, qty: 1, unit_price: s.price, tax_percent: s.tax_percent }];
    });
  };

  const updateQty = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], qty: updated[index].qty + delta };
      if (updated[index].qty <= 0) updated.splice(index, 1);
      return updated;
    });
  };

  const removeItem = (index: number) => setCart(prev => prev.filter((_, i) => i !== index));

  // ─── Totals ────────────────────────────────────────────────────────────────

  const cartSubtotal = cart.reduce((sum, c) => sum + c.unit_price * c.qty, 0);
  const cartTax      = cart.reduce((sum, c) => sum + (c.unit_price * c.qty * c.tax_percent / 100), 0);
  const cartTotal    = Math.max(0, cartSubtotal + cartTax - discountAmount);

  // ─── Build order payload ───────────────────────────────────────────────────

  const buildPayload = () => ({
    outlet_id:       selectedOutlet!,
    order_type:      orderType,
    table_no:        tableNo || undefined,
    discount_amount: discountAmount,
    items: cart.map(c => ({
      service_id:  c.service_id,
      name:        c.name,
      category:    c.category,
      qty:         c.qty,
      unit_price:  c.unit_price,
      tax_percent: c.tax_percent,
      notes:       c.notes,
    })),
  });

  const resetCart = () => { setCart([]); setDiscountAmount(0); setTableNo(''); };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!selectedOutlet) { toast.error('Select an outlet first'); return; }
    if (cart.length === 0) { toast.error('Add items to the order'); return; }
    if (orderType === 'dine_in' && !tableNo.trim()) { toast.error('Enter table number'); return; }
    await createOrder.mutateAsync(buildPayload());
    toast.success(`Order placed! ${orderType === 'dine_in' ? `Table ${tableNo}` : orderType.replace('_', ' ')}`);
    resetCart();
    setTab('orders');
  };

  const handleKot = async () => {
    if (!selectedOutlet) { toast.error('Select an outlet first'); return; }
    if (cart.length === 0) { toast.error('Add items first'); return; }
    const res = await createOrder.mutateAsync(buildPayload());
    const orderId = (res as any)?.data?.data?.id ?? (res as any)?.data?.id;
    if (orderId) await kotPrint.mutateAsync(orderId);
    resetCart();
    setTab('orders');
  };

  const handleBillSettle = async () => {
    if (!billOrderId) return;
    await billOrder.mutateAsync({ id: billOrderId, payment_mode: paymentMode });
    setShowBillModal(false);
    setBillOrderId(null);
  };

  const handlePostRoom = async () => {
    if (!postOrderId) return;
    if (!selectedBookingId) { toast.error('Select a room'); return; }
    await postToRoom.mutateAsync({ orderId: postOrderId, bookingId: Number(selectedBookingId) });
    setShowPostRoomModal(false);
    setPostOrderId(null);
    setSelectedBookingId('');
  };

  const openBillModal  = (id: number) => { setBillOrderId(id);  setPaymentMode('cash'); setShowBillModal(true);  };
  const openPostModal  = (id: number) => { setPostOrderId(id);  setSelectedBookingId(''); setShowPostRoomModal(true); };

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="h-[calc(100vh-4rem)] bg-slate-100 dark:bg-[#09090b] flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="bg-white dark:bg-[#111118] border-b border-slate-200/80 dark:border-white/10 px-4 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-orange-500" />
          <h1 className="font-black text-slate-900 dark:text-white">Hotel POS</h1>
        </div>

        <Select
          value={String(selectedOutlet ?? '')}
          onChange={e => { setSelectedOutlet(e.target.value ? Number(e.target.value) : null); setCart([]); }}
          className="w-52 rounded-xl"
        >
          <option value="">Select Outlet</option>
          {outlets.filter(o => o.is_active).map(o => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
        </Select>

        <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
          {(['pos', 'orders'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${tab === t ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t === 'pos' ? '🍽️ New Order' : '📋 Orders'}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => navigate('/hotel/pos/outlets')}>Outlets</Button>
          <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={() => navigate('/hotel/pos/services')}>Menu</Button>
        </div>
      </div>

      {/* ─── POS Tab ──────────────────────────────────────────────────────── */}
      {tab === 'pos' ? (
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT — Menu */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Order type + table */}
            <div className="bg-white dark:bg-[#111118] border-b border-slate-200/80 dark:border-white/10 px-4 py-2 flex items-center gap-3 flex-wrap">
              <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                {(['dine_in', 'room_service', 'takeaway'] as const).map(t => (
                  <button key={t} onClick={() => setOrderType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${orderType === t ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                    {t === 'dine_in' ? '🍽 Dine In' : t === 'room_service' ? '🛎 Room Service' : '🥡 Takeaway'}
                  </button>
                ))}
              </div>
              {(orderType === 'dine_in' || orderType === 'room_service') && (
                <Input
                  placeholder={orderType === 'dine_in' ? 'Table No. (e.g. T5)' : 'Room No. (e.g. 101)'}
                  value={tableNo}
                  onChange={e => setTableNo(e.target.value)}
                  className="w-40 rounded-xl h-8 text-sm"
                />
              )}
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input placeholder="Search menu..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} className="pl-8 h-8 w-44 rounded-xl text-sm" />
              </div>
            </div>

            {/* Category chips */}
            <div className="bg-white dark:bg-[#111118] border-b border-slate-100 dark:border-white/5 px-4 py-2 flex gap-2 overflow-x-auto">
              {POS_CATEGORY_FILTERS.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-all ${categoryFilter === cat ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-orange-50 hover:text-orange-700'}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Menu grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {!selectedOutlet ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <UtensilsCrossed className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-slate-400 font-semibold">Select an outlet to view menu</p>
                </div>
              ) : Object.keys(serviceGroups).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
                  <p className="text-slate-400 font-semibold">No services found</p>
                  <Button variant="outline" size="sm" className="mt-3 rounded-xl" onClick={() => navigate('/hotel/pos/services')}>
                    Add Services
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(serviceGroups).map(([cat, items]) => (
                    <div key={cat}>
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 capitalize">{cat}</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {items.map(s => (
                          <button key={s.id} onClick={() => addToCart(s)}
                            className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-xl p-3 text-left hover:border-orange-300 dark:hover:border-orange-500/40 hover:shadow-md transition-all group active:scale-95">
                            <div className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2 mb-1">{s.name}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-base font-black text-slate-900 dark:text-white">₹{s.price}</span>
                              <span className="text-[10px] text-slate-400">{s.tax_percent}% GST</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Cart */}
          <div className="w-80 xl:w-96 bg-white dark:bg-[#111118] border-l border-slate-200/80 dark:border-white/10 flex flex-col">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              <span className="font-black text-slate-900 dark:text-white text-sm">Current Order</span>
              {cart.length > 0 && (
                <Badge className="ml-auto bg-orange-600 text-white border-0 text-xs">{cart.reduce((s, c) => s + c.qty, 0)} items</Badge>
              )}
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <ShoppingCart className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-3" />
                  <p className="text-sm text-slate-400">Cart is empty</p>
                  <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">Tap menu items to add</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-white/[0.03] rounded-xl p-3 border border-slate-100 dark:border-white/5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-semibold text-sm text-slate-800 dark:text-white leading-tight">{item.name}</span>
                      <button onClick={() => removeItem(i)} className="shrink-0 text-slate-300 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQty(i, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-black text-sm w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(i, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        ₹{(item.unit_price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals + Actions */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 dark:border-white/5 p-4 space-y-3">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{cartSubtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between text-slate-500"><span>GST</span><span>₹{cartTax.toFixed(2)}</span></div>
                  {discountAmount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discountAmount}</span></div>}
                  <div className="flex justify-between font-black text-base text-slate-900 dark:text-white border-t border-slate-100 dark:border-white/5 pt-1.5">
                    <span>Total</span><span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <Input type="number" min="0" placeholder="Discount ₹" value={discountAmount || ''}
                  onChange={e => setDiscountAmount(Number(e.target.value) || 0)}
                  className="rounded-xl h-8 text-sm" />

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs" onClick={handleKot} disabled={kotPrint.isPending || createOrder.isPending}>
                      <Printer className="w-3.5 h-3.5 mr-1.5" />Send KOT
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs" onClick={async () => {
                      if (!selectedOutlet) { toast.error('Select an outlet first'); return; }
                      if (cart.length === 0) { toast.error('Add items first'); return; }
                      const res = await createOrder.mutateAsync(buildPayload());
                      const orderId = (res as any)?.data?.data?.id ?? (res as any)?.data?.id;
                      if (orderId) { resetCart(); openPostModal(orderId); setTab('orders'); }
                    }}>
                      <BedDouble className="w-3.5 h-3.5 mr-1.5" />Post to Room
                    </Button>
                  </div>
                  <Button className="w-full rounded-xl font-black bg-orange-600 hover:bg-orange-700 text-white" onClick={handlePlaceOrder} disabled={createOrder.isPending}>
                    <Send className="w-4 h-4 mr-2" />Place Order · ₹{cartTotal.toLocaleString()}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

      ) : (
        /* ─── Orders Tab ──────────────────────────────────────────────────── */
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-24 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-white/10">
                <Receipt className="w-14 h-14 mx-auto text-slate-200 dark:text-slate-800 mb-4" />
                <p className="font-bold text-slate-400">No orders yet today</p>
              </div>
            ) : (
              orders.map(order => {
                const sCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const SIcon = sCfg.icon;
                return (
                  <div key={order.id} className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 dark:text-white">{order.order_number}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${sCfg.color}`}>
                          <SIcon className="w-3 h-3" />{sCfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{order.outlet?.name} · {order.order_type?.replace('_', ' ')}</span>
                        {order.table_no && <Badge variant="outline" className="text-xs">Table {order.table_no}</Badge>}
                        <span className="font-black text-slate-900 dark:text-white text-sm">₹{order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="space-y-1 mb-3 pl-1">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{item.name} × {item.qty}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">₹{item.total_price?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {order.status !== 'billed' && order.status !== 'cancelled' && (
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs" onClick={() => openBillModal(order.id)}>
                          <Receipt className="w-3.5 h-3.5 mr-1.5" />Settle Bill
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl font-bold text-xs" onClick={() => openPostModal(order.id)}>
                          <BedDouble className="w-3.5 h-3.5 mr-1.5" />Post to Room
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── Bill Settlement Modal ─────────────────────────────────────────── */}
      <Modal isOpen={showBillModal} onClose={() => setShowBillModal(false)} title="Settle Bill" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Select payment mode to complete the order.</p>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_MODES.map(pm => {
              const Icon = pm.icon;
              return (
                <button key={pm.value} onClick={() => setPaymentMode(pm.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 font-bold text-sm transition-all ${paymentMode === pm.value ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-orange-300'}`}>
                  <Icon className="w-5 h-5" />{pm.label}
                </button>
              );
            })}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowBillModal(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold" onClick={handleBillSettle} disabled={billOrder.isPending}>
              Confirm Payment
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Post to Room Modal ────────────────────────────────────────────── */}
      <Modal isOpen={showPostRoomModal} onClose={() => setShowPostRoomModal(false)} title="Post to Room Folio" maxWidth="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">Select which checked-in room to post the charges to.</p>
          <div className="space-y-1.5">
            <Label className="font-bold text-sm">Checked-in Room *</Label>
            <Select value={selectedBookingId} onChange={e => setSelectedBookingId(e.target.value)}>
              <option value="">Select room...</option>
              {checkedInBookings.map((b: any) => (
                <option key={b.id} value={String(b.id)}>
                  Room {b.room?.room_number} — {b.guest?.name}
                </option>
              ))}
            </Select>
            {checkedInBookings.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">No checked-in guests right now.</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowPostRoomModal(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold" onClick={handlePostRoom} disabled={postToRoom.isPending || !selectedBookingId}>
              Post Charges
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
