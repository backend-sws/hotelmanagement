import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed, Plus, Minus, Trash2, Search, Send, Printer,
  CreditCard, Banknote, Smartphone, Gift, BedDouble,
  Receipt, Clock, CheckCircle2, XCircle, ShoppingCart, Package, ConciergeBell,
  User, Phone
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
  useCreatePosOrder, useBillOrder, usePostToRoom, useKotPrint,
  useTables, useReservations
} from '../api/useHotelPOS';
import type { HotelService, PosOrder, CartItem } from '../schemas/posSchema';
import { PAYMENT_MODES, STATUS_CONFIG, POS_CATEGORY_FILTERS } from '../constants/posConstants';
import { useHotelBookings } from '../../bookings/api/useBookings';
import { useTenantStore } from '@/store/tenantStore';

export function RestaurantPosPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeBusiness = useTenantStore(state => state.activeBusiness);
  const isRoomService = location.pathname.includes('room-service');

  // Selections
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);
  const [orderType, setOrderType] = useState<'dine_in' | 'room_service' | 'takeaway'>(isRoomService ? 'room_service' : 'dine_in');
  const [tableNo, setTableNo] = useState('');
  const [tableId, setTableId] = useState<number | null>(null);
  const [reservationId, setReservationId] = useState<number | null>(null);

  // Customer Details (Optional walk-in)
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // Sync orderType if user navigates between routes without unmounting
  useEffect(() => {
    setOrderType(isRoomService ? 'room_service' : 'dine_in');
  }, [isRoomService]);
  
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

  // Orders Tab filters
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash'|'card'|'upi'>('cash');

  // Print State
  const [printType, setPrintType] = useState<'kot' | 'bill' | null>(null);
  const [printData, setPrintData] = useState<any>(null);

  // Print Effect
  useEffect(() => {
    if (printType && printData) {
      const handleAfterPrint = () => {
        setPrintType(null);
        setPrintData(null);
      };
      window.addEventListener('afterprint', handleAfterPrint);
      setTimeout(() => window.print(), 300); // Give React time to render
      return () => window.removeEventListener('afterprint', handleAfterPrint);
    }
  }, [printType, printData]);

  // Tabs
  const [tab, setTab] = useState<'pos' | 'orders'>('pos');

  const { data: outlets = [] } = useOutlets();
  const { data: services = [] } = useServices({
    outlet_id: selectedOutlet ?? undefined,
    is_available: true,
  } as any);
  const { data: ordersRaw = [] } = usePosOrders({ outlet_id: selectedOutlet ?? undefined });
  const { data: bookingsRaw } = useHotelBookings();
  const { data: tables = [] } = useTables({ outlet_id: selectedOutlet ?? undefined, status: 'available' });
  const { data: reservations = [] } = useReservations({ outlet_id: selectedOutlet ?? undefined, status: 'pending' });

  const checkedInBookings = useMemo(() => {
    const d = bookingsRaw as any;
    const arr = Array.isArray(d) ? d : (Array.isArray(d?.data) ? d.data : []);
    return arr.filter((b: any) => b.status === 'checked_in');
  }, [bookingsRaw]);

  const orders: PosOrder[] = Array.isArray(ordersRaw) ? ordersRaw : [];

  const filteredOrders = useMemo(() => {
    let list = orders;
    if (orderStatusFilter !== 'all') {
      list = list.filter(o => o.status === orderStatusFilter);
    }
    if (orderSearchQuery) {
      const q = orderSearchQuery.toLowerCase();
      list = list.filter(o => 
        o.order_number?.toLowerCase().includes(q) ||
        o.guest_name?.toLowerCase().includes(q) ||
        o.guest_phone?.toLowerCase().includes(q) ||
        o.table_no?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, orderStatusFilter, orderSearchQuery]);

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
  
  const activeReservation = reservations.find(r => r.id === reservationId);
  const depositApplied = activeReservation ? Number(activeReservation.deposit_amount) : 0;
  
  const cartTotal    = Math.max(0, cartSubtotal + cartTax - discountAmount - depositApplied);

  // ─── Build order payload ───────────────────────────────────────────────────

  const buildPayload = () => ({
    outlet_id:       selectedOutlet!,
    order_type:      orderType,
    table_no:        tableNo || undefined,
    table_id:        tableId || undefined,
    reservation_id:  reservationId || undefined,
    guest_name:      guestName.trim() || undefined,
    guest_phone:     guestPhone.trim() || undefined,
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

  const resetCart = () => { 
      setCart([]);
      setTableNo('');
      setTableId(null);
      setReservationId(null);
      setGuestName('');
      setGuestPhone('');
      setDiscountAmount(0); 
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!selectedOutlet) { toast.error('Select an outlet first'); return; }
    if (cart.length === 0) { toast.error('Add items to the order'); return; }
    await createOrder.mutateAsync(buildPayload());
    toast.success(`Order placed! ${orderType === 'dine_in' ? `Table ${tableNo || tableId}` : orderType.replace('_', ' ')}`);
    resetCart();
    setTab('orders');
  };

  const handleKot = async () => {
    if (!selectedOutlet) { toast.error('Select an outlet first'); return; }
    if (cart.length === 0) { toast.error('Add items first'); return; }
    const res = await createOrder.mutateAsync(buildPayload());
    const orderId = (res as any)?.data?.data?.id ?? (res as any)?.data?.id;
    if (orderId) {
      await kotPrint.mutateAsync(orderId);
      setPrintData({
        ...buildPayload(),
        id: orderId,
        order_number: 'KOT-' + orderId, // Simple fallback if backend doesn't return full order yet
        created_at: new Date().toISOString()
      });
      setPrintType('kot');
    }
    resetCart();
    setTab('orders');
  };

  const handleBillSettle = async () => {
    if (!billOrderId) return;
    await billOrder.mutateAsync({ id: billOrderId, payment_mode: paymentMode });
    
    // Set for printing
    const orderToPrint = orders.find(o => o.id === billOrderId);
    if (orderToPrint) {
      setPrintData(orderToPrint);
      setPrintType('bill');
    }

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

  const handlePrintBillDirect = (order: any) => {
    setPrintData(order);
    setPrintType('bill');
  };

  const handlePrintKotDirect = (order: any) => {
    setPrintData(order);
    setPrintType('kot');
  };

  const openBillModal  = (id: number) => { setBillOrderId(id);  setPaymentMode('cash'); setShowBillModal(true);  };
  const openPostModal  = (id: number) => { setPostOrderId(id);  setSelectedBookingId(''); setShowPostRoomModal(true); };

  const billOrderDetails = orders.find(o => o.id === billOrderId);

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <>
    <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#09090b] dark:to-[#121217] flex flex-col overflow-hidden relative print:hidden">

      {/* Glassy Top bar */}
      <div className="bg-white/70 dark:bg-[#111118]/70 backdrop-blur-xl border-b border-white/50 dark:border-white/10 px-6 py-3 flex items-center gap-4 flex-wrap z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-tr ${isRoomService ? 'from-blue-500 to-sky-400' : 'from-orange-500 to-amber-400'} shadow-lg shadow-black/10`}>
            {isRoomService ? <ConciergeBell className="w-5 h-5 text-white" /> : <UtensilsCrossed className="w-5 h-5 text-white" />}
          </div>
          <h1 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
            {isRoomService ? 'Room Service POS' : 'Restaurant POS'}
          </h1>
        </div>

        <Select
          value={String(selectedOutlet ?? '')}
          onChange={e => { setSelectedOutlet(e.target.value ? Number(e.target.value) : null); setCart([]); }}
          className="w-56 rounded-xl bg-white/50 dark:bg-black/20 border-slate-200 dark:border-white/10 font-bold"
        >
          <option value="">Select Outlet...</option>
          {outlets.filter(o => o.is_active).map(o => <option key={o.id} value={String(o.id)}>{o.name}</option>)}
        </Select>

        <div className="flex gap-1 bg-slate-200/50 dark:bg-white/5 p-1 rounded-xl">
          {(['pos', 'orders'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all duration-300 ${tab === t ? 'bg-white dark:bg-[#20202a] text-slate-900 dark:text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              {t === 'pos' ? '🍽️ New Order' : '📋 Orders'}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-3">
          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-300 dark:border-white/10 hover:bg-white dark:hover:bg-white/5" onClick={() => navigate('/hotel/pos/outlets')}>Manage Outlets</Button>
          <Button variant="outline" size="sm" className="rounded-xl font-bold border-slate-300 dark:border-white/10 hover:bg-white dark:hover:bg-white/5" onClick={() => navigate('/hotel/pos/services')}>Edit Menu</Button>
        </div>
      </div>

      {/* ─── POS Tab ──────────────────────────────────────────────────────── */}
      {tab === 'pos' ? (
        <div className="flex-1 flex overflow-hidden">

          {/* LEFT — Menu */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Order type + table */}
            <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-white/40 dark:border-white/5 px-6 py-3 flex items-center gap-4 flex-wrap z-10">
              {!isRoomService && (
                <div className="flex gap-1 bg-slate-200/50 dark:bg-white/5 p-1 rounded-xl">
                  {(['dine_in', 'takeaway'] as const).map(t => (
                    <button key={t} onClick={() => setOrderType(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide uppercase transition-all duration-300 ${orderType === t ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                      {t === 'dine_in' ? '🍽 Dine In' : '🥡 Takeaway'}
                    </button>
                  ))}
                </div>
              )}
              {isRoomService && (
                <div className="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide bg-blue-500 text-white shadow-md flex items-center gap-2">
                  <ConciergeBell className="w-4 h-4" /> Room Service
                </div>
              )}
              
              {orderType === 'dine_in' && (
                <div className="flex gap-3">
                  <Select 
                    value={tableId ? String(tableId) : ''}
                    onChange={e => setTableId(e.target.value ? Number(e.target.value) : null)}
                    className="w-44 rounded-xl bg-white/70 dark:bg-white/5 border-slate-200 dark:border-white/10 font-semibold"
                  >
                    <option value="">Select Table...</option>
                    {tables.map(t => <option key={t.id} value={t.id}>{t.name} (Cap: {t.capacity})</option>)}
                  </Select>
                  
                  {reservations.length > 0 && (
                    <Select 
                      value={reservationId ? String(reservationId) : ''}
                      onChange={e => {
                        const rId = e.target.value ? Number(e.target.value) : null;
                        setReservationId(rId);
                        if (rId) {
                          const res = reservations.find(r => r.id === rId);
                          if (res && res.table_id) setTableId(res.table_id);
                          if (res && res.guest_name) setGuestName(res.guest_name);
                          if (res && res.guest_phone) setGuestPhone(res.guest_phone);
                        }
                      }}
                      className="w-52 rounded-xl bg-white/70 dark:bg-white/5 border-slate-200 dark:border-white/10 font-semibold"
                    >
                      <option value="">Link Reservation...</option>
                      {reservations.map(r => (
                        <option key={r.id} value={r.id}>{r.guest_name} (Dep: ₹{r.deposit_amount})</option>
                      ))}
                    </Select>
                  )}
                </div>
              )}
              {orderType === 'room_service' && (
                <Input
                  placeholder="Room No. (e.g. 101)"
                  value={tableNo}
                  onChange={e => setTableNo(e.target.value)}
                  className="w-44 rounded-xl bg-white/70 dark:bg-white/5 border-slate-200 dark:border-white/10 font-bold text-center"
                />
              )}
              <div className="relative ml-auto">
                <Search className="absolute z-10 pointer-events-none left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input placeholder="Search menu items..." value={serviceSearch} onChange={e => setServiceSearch(e.target.value)} className="pl-9 h-10 w-64 rounded-xl bg-white/80 dark:bg-[#111118]/80 border-slate-200 dark:border-white/10 font-medium" />
              </div>
            </div>

            {/* Category chips */}
            <div className="px-6 py-4 flex gap-3 overflow-x-auto">
              {POS_CATEGORY_FILTERS.map(cat => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={`shrink-0 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 ${categoryFilter === cat ? (isRoomService ? 'bg-blue-600 shadow-blue-500/20' : 'bg-orange-600 shadow-orange-500/20') + ' text-white shadow-lg -translate-y-0.5' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:-translate-y-0.5 shadow-sm'}`}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Menu grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-24">
              {!selectedOutlet ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-xl">
                    <UtensilsCrossed className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  </div>
                  <h2 className="text-xl font-black text-slate-700 dark:text-slate-200">Ready to take orders!</h2>
                  <p className="text-slate-500 font-medium mt-2">Please select an outlet from the top dropdown to view its menu.</p>
                </div>
              ) : Object.keys(serviceGroups).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Package className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                  <p className="text-slate-500 font-bold text-lg">No services found in this category.</p>
                  <Button variant="outline" className="mt-4 rounded-xl font-bold shadow-sm border-slate-300 dark:border-white/10" onClick={() => navigate('/hotel/pos/services')}>
                    Manage Menu Items
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(serviceGroups).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="flex items-center gap-4 mb-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 capitalize bg-white/60 dark:bg-white/5 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm border border-white/40 dark:border-white/5">{cat}</h4>
                        <div className="flex-1 h-px bg-slate-200 dark:bg-white/10"></div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {items.map(s => (
                          <button key={s.id} onClick={() => addToCart(s)}
                            className="bg-white/80 dark:bg-[#15151a]/80 backdrop-blur-sm border border-slate-200/80 dark:border-white/5 rounded-2xl p-4 text-left hover:border-orange-400 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group active:scale-[0.98] relative overflow-hidden flex flex-col h-full justify-between">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent transition-all duration-500"></div>
                            
                            <div className="relative z-10 font-bold text-[15px] text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 leading-snug mb-3 pr-2">{s.name}</div>
                            
                            <div className="relative z-10 mt-auto flex items-end justify-between">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600 hidden">₹{s.price + 50}</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">₹{s.price}</span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-white/5 px-1.5 py-0.5 rounded-md">{s.tax_percent}% Tax</span>
                              </div>
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

          {/* RIGHT — Cart & Customer Details */}
          <div className="w-[380px] bg-white dark:bg-[#111118] border-l border-slate-200 dark:border-white/5 flex flex-col shadow-2xl relative z-20">
            
            {/* Cart Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-orange-100 dark:bg-orange-500/20 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white leading-none mb-1">Current Order</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{orderType.replace('_', ' ')}</p>
                </div>
              </div>
              {cart.length > 0 && (
                <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-2.5 py-1 text-xs rounded-lg shadow-sm">
                  {cart.reduce((s, c) => s + c.qty, 0)} Items
                </Badge>
              )}
            </div>

            {/* Customer Details Panel (Glassy) */}
            <div className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-100 dark:border-white/5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Guest Details (Optional)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="Guest Name" 
                    value={guestName} 
                    onChange={e => setGuestName(e.target.value)}
                    className="pl-9 h-9 text-xs rounded-xl bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 font-semibold"
                  />
                </div>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder="Phone No." 
                    value={guestPhone} 
                    onChange={e => setGuestPhone(e.target.value)}
                    className="pl-9 h-9 text-xs rounded-xl bg-white dark:bg-black/20 border-slate-200 dark:border-white/10 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
              {cart.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <UtensilsCrossed className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-300">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1">Tap on menu items from the left to start building your order.</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-white/[0.03] rounded-2xl p-3 border border-slate-100 dark:border-white/5 shadow-sm group hover:border-slate-300 dark:hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="font-bold text-[13px] text-slate-800 dark:text-slate-100 leading-tight">{item.name}</span>
                      <button onClick={() => removeItem(i)} className="shrink-0 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-100 dark:bg-white/5 rounded-lg p-0.5 border border-slate-200 dark:border-white/5">
                        <button onClick={() => updateQty(i, -1)}
                          className="w-7 h-7 rounded-md bg-white dark:bg-white/10 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-500/30 transition-all shadow-sm">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-[13px] w-8 text-center text-slate-900 dark:text-white">{item.qty}</span>
                        <button onClick={() => updateQty(i, 1)}
                          className="w-7 h-7 rounded-md bg-white dark:bg-white/10 flex items-center justify-center hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-500/30 transition-all shadow-sm">
                          <Plus className="w-3.5 h-3.5" />
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
              <div className="bg-slate-50 dark:bg-[#15151a] border-t border-slate-200 dark:border-white/5 p-5 pb-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.2)]">
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                    <span>Subtotal</span><span>₹{cartSubtotal.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                    <span>Taxes</span><span>₹{cartTax.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-500">Discount</span>
                    <div className="relative w-24">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                      <Input type="number" min="0" value={discountAmount || ''} onChange={e => setDiscountAmount(Number(e.target.value) || 0)} className="h-8 pl-6 text-sm font-bold rounded-lg border-slate-300 dark:border-white/10 bg-white dark:bg-black/20" placeholder="0" />
                    </div>
                  </div>
                  
                  {depositApplied > 0 && (
                    <div className="flex justify-between items-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Deposit Applied</span>
                      <span>-₹{depositApplied.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="w-full h-px bg-slate-200 dark:bg-white/10 my-3 border-dashed"></div>

                  <div className="flex justify-between items-end">
                    <span className="text-base font-black text-slate-900 dark:text-white">Grand Total</span>
                    <span className="text-3xl font-black text-orange-600 dark:text-orange-500 tracking-tight leading-none">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold text-[13px] border-slate-300 dark:border-white/10 shadow-sm hover:bg-slate-100 dark:hover:bg-white/5 group" onClick={handleKot} disabled={kotPrint.isPending || createOrder.isPending}>
                      <Printer className="w-4 h-4 mr-2 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200" /> Print KOT
                    </Button>
                    <Button variant="outline" className="h-11 rounded-xl font-bold text-[13px] border-slate-300 dark:border-white/10 shadow-sm hover:bg-slate-100 dark:hover:bg-white/5 group" onClick={async () => {
                      if (!selectedOutlet) { toast.error('Select an outlet first'); return; }
                      if (cart.length === 0) { toast.error('Add items first'); return; }
                      const res = await createOrder.mutateAsync(buildPayload());
                      const orderId = (res as any)?.data?.data?.id ?? (res as any)?.data?.id;
                      if (orderId) { resetCart(); openPostModal(orderId); setTab('orders'); }
                    }}>
                      <BedDouble className="w-4 h-4 mr-2 text-slate-500 group-hover:text-blue-500" /> Room Bill
                    </Button>
                  </div>
                  <Button className={`w-full h-12 rounded-xl font-black text-base shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${isRoomService ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/25'} text-white`} onClick={handlePlaceOrder} disabled={createOrder.isPending}>
                    <Send className="w-5 h-5" /> Place Order 
                    <span className="opacity-50 mx-1">·</span> 
                    ₹{cartTotal.toLocaleString()}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

      ) : (
        /* ─── Orders Tab ──────────────────────────────────────────────────── */
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-[#09090b] relative">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* ─── Orders Filter Bar ─── */}
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#111118] p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm relative z-10">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                <Input 
                  placeholder="Search by Order #, Guest Name, Phone or Table..."
                  className="w-full bg-transparent border-0 focus-visible:ring-0 shadow-none pl-9 py-2 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 h-10"
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-white/10 mx-2"></div>
              <div className="w-full sm:w-48">
                <Select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="ready">Ready</option>
                  <option value="billed">Billed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-32 bg-white dark:bg-[#111118] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm">
                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">No Orders Yet</h3>
                <p className="font-medium text-slate-500 mt-2">Placed orders for this outlet will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredOrders.map(order => {
                  const sCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                  const SIcon = sCfg.icon;
                  return (
                    <div key={order.id} className="bg-white dark:bg-[#111118] border border-slate-200/80 dark:border-white/10 rounded-2xl p-4 shadow-sm group hover:shadow-md transition-all flex flex-col h-full">
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-400">
                            <UtensilsCrossed className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                              #{order.order_number}
                            </h3>
                            <p className="text-[10px] uppercase font-bold tracking-wide text-slate-500 mt-0.5">{order.order_type?.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-0.5 text-[10px] font-black uppercase rounded border ${sCfg.color} bg-opacity-10 dark:bg-opacity-20`}>
                          {sCfg.label}
                        </div>
                      </div>

                      {(order.guest_name || order.table_no || order.guest_phone) && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl">
                          {order.table_no && (
                            <div className="flex items-center gap-1.5 mb-1 font-medium">
                              <UtensilsCrossed className="w-3 h-3 text-slate-400" />
                              <span>Table {order.table_no}</span>
                            </div>
                          )}
                          {(order.guest_name || order.guest_phone) && (
                            <div className="flex items-center gap-1.5 font-medium">
                              <User className="w-3 h-3 text-slate-400" />
                              <span className="truncate">{order.guest_name || 'Walk-in Guest'}</span>
                              {order.guest_phone && <span className="text-slate-500 ml-1">({order.guest_phone})</span>}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex-1 space-y-2 mb-5">
                        {order.items && order.items.length > 0 && order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-start text-sm">
                            <span className="font-semibold text-slate-600 dark:text-slate-400 leading-snug pr-4">
                              <span className="font-black text-slate-800 dark:text-slate-200">{item.qty}x</span> {item.name}
                            </span>
                            <span className="font-black text-slate-800 dark:text-slate-200">₹{item.total_price?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <div className="flex justify-between items-center mb-4 pt-3 border-t border-slate-100 dark:border-white/5">
                          <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Total</span>
                          <span className="font-bold text-base text-slate-900 dark:text-white">₹{order.total?.toLocaleString()}</span>
                        </div>

                        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-white/5 flex gap-2">
                          {order.status !== 'billed' && order.status !== 'cancelled' ? (
                            <>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0 shrink-0 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400" onClick={() => handlePrintKotDirect(order)} title="Print KOT">
                                <Printer className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5" onClick={() => openPostModal(order.id)}>
                                Room Bill
                              </Button>
                              <Button size="sm" className="flex-[1.5] h-8 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => openBillModal(order.id)}>
                                <Receipt className="w-3 h-3 mr-1" /> Settle
                              </Button>
                            </>
                          ) : order.status === 'billed' ? (
                            <Button size="sm" variant="outline" className="w-full h-8 text-xs font-bold rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400" onClick={() => handlePrintBillDirect(order)}>
                              <Printer className="w-3.5 h-3.5 mr-1" /> Print Bill
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Bill Settlement Modal ─────────────────────────────────────────── */}
      <Modal isOpen={showBillModal} onClose={() => setShowBillModal(false)} title="Settle Bill" maxWidth="sm">
        <div className="space-y-5">
          <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
            <h3 className="text-sm font-bold text-slate-500 mb-1">Total Amount Due</h3>
            <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{billOrderDetails?.total?.toLocaleString()}</div>
            {billOrderDetails?.guest_name && (
              <div className="mt-3 flex items-center justify-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-300">
                <User className="w-4 h-4 text-slate-400" /> {billOrderDetails.guest_name}
                {billOrderDetails?.guest_phone && <span className="text-slate-400 font-medium ml-1">({billOrderDetails.guest_phone})</span>}
              </div>
            )}
          </div>

          <div>
            <Label className="text-xs font-black uppercase text-slate-500 mb-3 block tracking-widest">Select Payment Mode</Label>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_MODES.map(pm => {
                const Icon = pm.icon;
                return (
                  <button key={pm.value} onClick={() => setPaymentMode(pm.value)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${paymentMode === pm.value ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 text-slate-600 dark:text-slate-400 hover:border-orange-300 dark:hover:border-orange-500/50 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <Icon className="w-7 h-7" />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setShowBillModal(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl h-12 bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 text-white font-black text-base" onClick={handleBillSettle} disabled={billOrder.isPending}>
              Confirm & Print
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── Post to Room Modal ────────────────────────────────────────────── */}
      <Modal isOpen={showPostRoomModal} onClose={() => setShowPostRoomModal(false)} title="Post to Room Folio" maxWidth="sm">
        <div className="space-y-5">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-500/20">
             <div className="flex items-center gap-3 mb-2 text-blue-600 dark:text-blue-400">
                <BedDouble className="w-6 h-6" />
                <h3 className="font-black text-lg">Room Charge</h3>
             </div>
             <p className="text-sm font-medium text-slate-700 dark:text-slate-300">This will add the order amount to the guest's final room bill.</p>
          </div>
          
          <div className="space-y-2">
            <Label className="font-black text-xs uppercase tracking-widest text-slate-500 block">Select Checked-in Room *</Label>
            <Select value={selectedBookingId} onChange={e => setSelectedBookingId(e.target.value)} className="h-12 rounded-xl text-base font-bold bg-white dark:bg-black/20">
              <option value="">Select active room...</option>
              {checkedInBookings.map((b: any) => (
                <option key={b.id} value={String(b.id)}>
                  Room {b.room?.room_number} — {b.guest?.name}
                </option>
              ))}
            </Select>
            {checkedInBookings.length === 0 && (
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-2">
                <XCircle className="w-3.5 h-3.5" /> No checked-in guests right now.
              </p>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setShowPostRoomModal(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 text-white font-black text-base" onClick={handlePostRoom} disabled={postToRoom.isPending || !selectedBookingId}>
              Post to Folio
            </Button>
          </div>
        </div>
      </Modal>
    </div>

    {/* ─── Printable Thermal Receipts ────────────────────────────────────── */}
    {printData && (
      <div className="hidden print:block text-black bg-white w-full max-w-[80mm] mx-auto p-4 text-[12px] leading-tight font-mono">
        
        {/* === KOT RECEIPT === */}
        {printType === 'kot' && (
          <div className="flex flex-col">
            <h2 className="text-center font-bold text-lg mb-1 uppercase tracking-widest border-b-2 border-black border-dashed pb-2">K.O.T</h2>
            
            <div className="flex justify-between mb-1 mt-2">
              <span className="font-bold">Order #: {printData.order_number || printData.id}</span>
              <span>{new Date(printData.created_at || new Date()).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
            </div>
            
            <div className="flex justify-between mb-1">
              <span className="uppercase font-bold">Type: {printData.order_type.replace('_', ' ')}</span>
              {printData.table_id && <span className="font-bold">Table: {printData.table_id}</span>}
            </div>
            
            {(printData.guest_name || printData.guest_phone) && (
              <div className="mb-2">
                <span>Guest: {printData.guest_name || ''} {printData.guest_phone ? `(${printData.guest_phone})` : ''}</span>
              </div>
            )}

            <div className="border-b-2 border-black border-dashed my-2"></div>
            
            <div className="flex justify-between font-bold mb-1 uppercase">
              <span className="w-3/4">Item</span>
              <span className="w-1/4 text-right">Qty</span>
            </div>
            
            <div className="border-b-2 border-black border-dashed mb-2"></div>
            
            {printData.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between mb-1">
                <span className="w-3/4 pr-2">{item.name || item.service_name}</span>
                <span className="w-1/4 text-right font-bold">{item.qty}</span>
              </div>
            ))}
            
            <div className="border-b-2 border-black border-dashed my-2"></div>
            <p className="text-center italic mt-2 text-xs">--- End of KOT ---</p>
          </div>
        )}

        {/* === FINAL BILL RECEIPT === */}
        {printType === 'bill' && (
          <div className="flex flex-col">
            <div className="text-center mb-4">
              <h1 className="font-bold text-xl uppercase mb-1">{activeBusiness?.name || 'Restaurant POS'}</h1>
              <p className="text-xs">Original Receipt</p>
            </div>
            
            <div className="flex justify-between mb-1">
              <span>Order #: {printData.order_number || printData.id}</span>
              <span>{new Date(printData.created_at || new Date()).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between mb-1 uppercase">
              <span>{printData.order_type.replace('_', ' ')}</span>
              {printData.table && <span>Table: {printData.table.name}</span>}
              {!printData.table && printData.table_no && <span>Table: {printData.table_no}</span>}
            </div>
            
            {(printData.guest_name || printData.guest_phone) && (
              <div className="mb-2 uppercase">
                <span>Guest: {printData.guest_name || ''} {printData.guest_phone ? `(${printData.guest_phone})` : ''}</span>
              </div>
            )}
            
            <div className="border-b-2 border-black border-dashed my-2"></div>
            
            <div className="flex justify-between font-bold mb-1 uppercase text-[10px]">
              <span className="w-1/2">Item</span>
              <span className="w-1/6 text-center">Qty</span>
              <span className="w-1/3 text-right">Amount</span>
            </div>
            
            <div className="border-b-2 border-black border-dashed mb-2"></div>
            
            {printData.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between mb-1">
                <span className="w-1/2 pr-1 truncate">{item.name || item.service?.name || 'Item'}</span>
                <span className="w-1/6 text-center">{item.qty}</span>
                <span className="w-1/3 text-right font-medium">₹{(Number(item.qty) * Number(item.unit_price)).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="border-b-2 border-black border-dashed my-2"></div>
            
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>₹{(printData.subtotal ?? printData.total_amount)?.toLocaleString()}</span>
            </div>
            {Number(printData.tax_amount) > 0 && (
              <div className="flex justify-between mb-1">
                <span>Tax:</span>
                <span>₹{printData.tax_amount?.toLocaleString()}</span>
              </div>
            )}
            {Number(printData.discount_amount || printData.discount) > 0 && (
              <div className="flex justify-between mb-1">
                <span>Discount:</span>
                <span>-₹{(printData.discount_amount || printData.discount)?.toLocaleString()}</span>
              </div>
            )}
            
            <div className="border-b-2 border-black border-dashed my-2"></div>
            
            <div className="flex justify-between font-bold text-base mb-2">
              <span>GRAND TOTAL:</span>
              <span>₹{(printData.total ?? printData.final_amount)?.toLocaleString()}</span>
            </div>
            
            <div className="border-b-2 border-black border-dashed mb-4"></div>
            
            <div className="text-center text-[10px] space-y-1">
              <p>Thank you for visiting!</p>
              <p>Please come again.</p>
            </div>
          </div>
        )}
      </div>
    )}
    </>
  );
};

export default RestaurantPosPage;
