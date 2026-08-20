import React, { useState, useEffect } from 'react';
import { useInvoiceSettings, useUpdateInvoiceSettings, useUploadInvoiceImage, useDeleteInvoiceImage, type InvoiceSettings } from '../api/useInvoiceSettings';
import { InvoiceTemplateCard } from '../components/InvoiceTemplateCard';
import InvoiceLivePreview from '../components/InvoiceLivePreview';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Save, UploadCloud, Trash2, Loader2, Plus, X, ChevronDown, ChevronRight, Check } from 'lucide-react';

const Accordion = ({ title, children, defaultOpen = false }: { title: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg mb-3 bg-white overflow-hidden shadow-sm">
      <button 
        className="w-full flex justify-between items-center p-3 hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-slate-800 text-sm">{title}</span>
        <span className="text-slate-400">
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </span>
      </button>
      {isOpen && <div className="p-4 border-t border-slate-100 bg-white space-y-4">{children}</div>}
    </div>
  );
};
import { toast } from 'sonner';

export const InvoiceSettingsTab = () => {
  const { data: serverSettings, isLoading } = useInvoiceSettings();
  const updateSettings = useUpdateInvoiceSettings();
  const uploadImage = useUploadInvoiceImage();
  const deleteImage = useDeleteInvoiceImage();

  const [settings, setSettings] = useState<InvoiceSettings | null>(null);
  
  useEffect(() => {
    if (serverSettings) {
      setSettings(serverSettings);
    }
  }, [serverSettings]);

  if (isLoading || !settings) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const handleSave = () => {
    updateSettings.mutate(settings, {
      onSuccess: () => {
        toast.success('Invoice settings saved successfully');
      },
      onError: () => {
        toast.error('Failed to save invoice settings');
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'footer' | 'signature' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      uploadImage.mutate({ type, file }, {
        onSuccess: (data) => {
          toast.success(`${type} image uploaded`);
          setSettings(prev => prev ? {
            ...prev,
            [`${type}_image`]: data.url
          } : prev);
        },
        onError: () => {
          toast.error(`Failed to upload ${type} image`);
        }
      });
    }
  };

  const handleDeleteImage = (type: 'header' | 'footer' | 'signature' | 'background') => {
    deleteImage.mutate(type, {
      onSuccess: () => {
        toast.success(`${type} image removed`);
        setSettings(prev => prev ? {
          ...prev,
          [`${type}_image`]: null
        } : prev);
      }
    });
  };

  const handleAddCustomField = () => {
    setSettings(prev => prev ? {
      ...prev,
      custom_fields: [...(prev.custom_fields || []), { key: '', value: '' }]
    } : prev);
  };

  const handleUpdateCustomField = (index: number, key: string, value: string) => {
    setSettings(prev => {
      if (!prev) return prev;
      const updated = [...(prev.custom_fields || [])];
      updated[index] = { key, value };
      return { ...prev, custom_fields: updated };
    });
  };

  const handleRemoveCustomField = (index: number) => {
    setSettings(prev => {
      if (!prev) return prev;
      const updated = [...(prev.custom_fields || [])];
      updated.splice(index, 1);
      return { ...prev, custom_fields: updated };
    });
  };

  const presetColors = [
    { name: 'Slate', color: '#1a1a1a' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Purple', color: '#7c3aed' },
    { name: 'Red', color: '#dc2626' },
    { name: 'Green', color: '#16a34a' },
    { name: 'Orange', color: '#ea580c' },
  ];

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm">
      
      {/* LEFT PANEL - CONTROLS */}
      <div className="w-full md:w-[45%] flex flex-col border-r border-slate-200 bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-4">
          
          <div className="flex justify-between items-center sticky top-0 bg-slate-50/90 backdrop-blur z-10 py-2 border-b border-slate-200 mb-2">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Invoice Settings</h2>
            </div>
            <Button onClick={handleSave} disabled={updateSettings.isPending} className="bg-indigo-600 hover:bg-indigo-700 h-8">
              {updateSettings.isPending ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-2" />}
              Save Changes
            </Button>
          </div>

          <Accordion title="Themes" defaultOpen={true}>
            <div className="bg-yellow-50 text-yellow-800 text-xs p-2 rounded mb-3 flex items-start gap-2 border border-yellow-100">
              <span className="font-semibold text-yellow-600">Tip:</span> 
              Select a template that matches your brand style.
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <InvoiceTemplateCard
                id="default"
                name="Default"
                description="Clean standard GST layout"
                selected={settings.template === 'default'}
                onSelect={(id) => setSettings({ ...settings, template: id })}
              />
              <InvoiceTemplateCard
                id="modern"
                name="Modern"
                description="Contemporary minimalist design"
                selected={settings.template === 'modern'}
                onSelect={(id) => setSettings({ ...settings, template: id })}
              />
              <InvoiceTemplateCard
                id="classic"
                name="Classic"
                description="Traditional boxed bill"
                selected={settings.template === 'classic'}
                onSelect={(id) => setSettings({ ...settings, template: id })}
              />
              <InvoiceTemplateCard
                id="premium"
                name="Premium"
                description="Dark-header luxury layout"
                selected={settings.template === 'premium'}
                onSelect={(id) => setSettings({ ...settings, template: id })}
              />
              <InvoiceTemplateCard
                id="pos"
                name="POS Thermal (80mm)"
                description="Compact receipt for roll printers"
                selected={settings.template === 'pos'}
                onSelect={(id) => setSettings({ ...settings, template: id })}
              />
            </div>
          </Accordion>

          <Accordion title="Theme Styling" defaultOpen={true}>
            <div>
              <Label className="block mb-2 text-xs font-semibold text-slate-600">Select Color</Label>
              <div className="flex flex-wrap gap-2 mb-4">
                {presetColors.map((pc) => (
                  <button
                    key={pc.color}
                    onClick={() => setSettings({...settings, styles: {...settings.styles, primary_color: pc.color}})}
                    className={`w-10 h-8 rounded border flex items-center justify-center transition-all ${settings.styles.primary_color === pc.color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: pc.color, borderColor: pc.color }}
                    title={pc.name}
                  >
                    {settings.styles.primary_color === pc.color && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <Label className="block mb-2 text-xs font-semibold text-slate-500">Custom Primary</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    value={settings.styles.primary_color || '#1a1a1a'} 
                    onChange={(e) => setSettings({...settings, styles: {...settings.styles, primary_color: e.target.value}})}
                    className="w-8 h-8 p-0 border-0 cursor-pointer rounded"
                  />
                  <Input 
                    type="text" 
                    value={settings.styles.primary_color || '#1a1a1a'} 
                    onChange={(e) => setSettings({...settings, styles: {...settings.styles, primary_color: e.target.value}})}
                    className="w-full h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>
              <div>
                <Label className="block mb-2 text-xs font-semibold text-slate-500">Secondary / Border</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="color" 
                    value={settings.styles.secondary_color || '#64748b'} 
                    onChange={(e) => setSettings({...settings, styles: {...settings.styles, secondary_color: e.target.value, border_color: e.target.value}})}
                    className="w-8 h-8 p-0 border-0 cursor-pointer rounded"
                  />
                  <Input 
                    type="text" 
                    value={settings.styles.secondary_color || '#64748b'} 
                    onChange={(e) => setSettings({...settings, styles: {...settings.styles, secondary_color: e.target.value, border_color: e.target.value}})}
                    className="w-full h-8 font-mono text-xs uppercase"
                  />
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion title="Theme Settings (Layout)">
            <div>
              <Label className="flex justify-between mb-3 text-xs font-semibold text-slate-500">
                <span>Base Font Size</span>
                <span className="text-indigo-600 font-medium">{settings.styles.font_size}px</span>
              </Label>
              <input 
                type="range"
                className="w-full accent-indigo-600"
                min={8} max={18} step={1} 
                value={settings.styles.font_size} 
                onChange={(e) => setSettings({...settings, styles: {...settings.styles, font_size: parseInt(e.target.value)}})}
              />
            </div>

            <div>
              <Label className="flex justify-between mb-3 text-xs font-semibold text-slate-500">
                <span>Font Family</span>
              </Label>
              <select 
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                value={settings.styles.font_family || "Helvetica Neue, Helvetica, Arial, sans-serif"}
                onChange={(e) => setSettings({...settings, styles: {...settings.styles, font_family: e.target.value}})}
              >
                <option value="Helvetica Neue, Helvetica, Arial, sans-serif">Helvetica / Arial (Modern)</option>
                <option value="Times New Roman, Times, serif">Times New Roman (Classic)</option>
                <option value="Courier New, Courier, monospace">Courier (Monospace)</option>
                <option value="Roboto, sans-serif">Roboto</option>
                <option value="Inter, sans-serif">Inter</option>
              </select>
            </div>

            <div>
              <Label className="flex justify-between mb-3 text-xs font-semibold text-slate-500">
                <span>Line Spacing</span>
                <span className="text-indigo-600 font-medium">{settings.styles.line_spacing || 1.5}</span>
              </Label>
              <input 
                type="range"
                className="w-full accent-indigo-600"
                min={1} max={2.5} step={0.1} 
                value={settings.styles.line_spacing || 1.5} 
                onChange={(e) => setSettings({...settings, styles: {...settings.styles, line_spacing: parseFloat(e.target.value)}})}
              />
            </div>

            <div>
              <Label className="flex justify-between mb-3 text-xs font-semibold text-slate-500">
                <span>Border Radius (Modern Layout)</span>
                <span className="text-indigo-600 font-medium">{settings.styles.border_radius || 0}px</span>
              </Label>
              <input 
                type="range"
                className="w-full accent-indigo-600"
                min={0} max={24} step={2} 
                value={settings.styles.border_radius || 0} 
                onChange={(e) => setSettings({...settings, styles: {...settings.styles, border_radius: parseInt(e.target.value)}})}
              />
            </div>
            
            <div>
                <Label className="block mb-2 text-xs font-semibold text-slate-500">Full Page Frame Style</Label>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="h-8 text-xs" variant={settings.styles.frame_style === 'elegant' ? 'default' : 'outline'} onClick={() => setSettings({...settings, styles: {...settings.styles, frame_style: 'elegant'}})}>Elegant</Button>
                  <Button size="sm" className="h-8 text-xs" variant={settings.styles.frame_style === 'solid' ? 'default' : 'outline'} onClick={() => setSettings({...settings, styles: {...settings.styles, frame_style: 'solid'}})}>Solid</Button>
                  <Button size="sm" className="h-8 text-xs" variant={settings.styles.frame_style === 'dashed' ? 'default' : 'outline'} onClick={() => setSettings({...settings, styles: {...settings.styles, frame_style: 'dashed'}})}>Dashed</Button>
                  <Button size="sm" className="h-8 text-xs" variant={settings.styles.frame_style === 'dotted' ? 'default' : 'outline'} onClick={() => setSettings({...settings, styles: {...settings.styles, frame_style: 'dotted'}})}>Dotted</Button>
                  <Button size="sm" className="h-8 text-xs" variant={settings.styles.frame_style === 'none' ? 'default' : 'outline'} onClick={() => setSettings({...settings, styles: {...settings.styles, frame_style: 'none'}})}>None</Button>
                </div>
            </div>

            <div>
              <Label className="block mb-4 text-xs text-slate-600 font-semibold border-b pb-2 pt-4">Page Margins (px)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs mb-2 block text-slate-500">Top ({settings.styles.margin_top})</Label>
                  <input type="range" className="w-full accent-indigo-600" min={0} max={50} step={1} value={settings.styles.margin_top} onChange={(e) => setSettings({...settings, styles: {...settings.styles, margin_top: parseInt(e.target.value)}})} />
                </div>
                <div>
                  <Label className="text-xs mb-2 block text-slate-500">Bottom ({settings.styles.margin_bottom})</Label>
                  <input type="range" className="w-full accent-indigo-600" min={0} max={50} step={1} value={settings.styles.margin_bottom} onChange={(e) => setSettings({...settings, styles: {...settings.styles, margin_bottom: parseInt(e.target.value)}})} />
                </div>
                <div>
                  <Label className="text-xs mb-2 block text-slate-500">Left ({settings.styles.margin_left})</Label>
                  <input type="range" className="w-full accent-indigo-600" min={0} max={50} step={1} value={settings.styles.margin_left} onChange={(e) => setSettings({...settings, styles: {...settings.styles, margin_left: parseInt(e.target.value)}})} />
                </div>
                <div>
                  <Label className="text-xs mb-2 block text-slate-500">Right ({settings.styles.margin_right})</Label>
                  <input type="range" className="w-full accent-indigo-600" min={0} max={50} step={1} value={settings.styles.margin_right} onChange={(e) => setSettings({...settings, styles: {...settings.styles, margin_right: parseInt(e.target.value)}})} />
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion title="Branding (Images)">
            {/* Header Image */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <Label className="mb-1 block text-xs">Header Banner Image</Label>
              {settings.header_image ? (
                <div className="relative rounded overflow-hidden border border-slate-200 group">
                  <img src={settings.header_image} alt="Header" className="w-full h-20 object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleDeleteImage('header')}>
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-16 border border-slate-300 border-dashed rounded cursor-pointer bg-white hover:bg-slate-50 relative">
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                      <p className="text-[10px] text-slate-500">Upload Header</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'header')} />
                    {uploadImage.isPending && uploadImage.variables?.type === 'header' && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Footer Image */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <Label className="mb-1 block text-xs">Footer Image</Label>
              {settings.footer_image ? (
                <div className="relative rounded overflow-hidden border border-slate-200 group flex justify-end p-2 bg-white">
                  <img src={settings.footer_image} alt="Footer" className="max-h-16 object-contain" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleDeleteImage('footer')}>
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-16 border border-slate-300 border-dashed rounded cursor-pointer bg-white hover:bg-slate-50 relative">
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                      <p className="text-[10px] text-slate-500">Upload Footer</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'footer')} />
                    {uploadImage.isPending && uploadImage.variables?.type === 'footer' && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Signature Image */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 mt-3">
              <Label className="mb-1 block text-xs">Authorized Signature Image</Label>
              {settings.signature_image ? (
                <div className="relative rounded overflow-hidden border border-slate-200 group flex justify-center p-2 bg-white">
                  <img src={settings.signature_image} alt="Signature" className="max-h-16 object-contain" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleDeleteImage('signature')}>
                      <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-16 border border-slate-300 border-dashed rounded cursor-pointer bg-white hover:bg-slate-50 relative">
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                      <p className="text-[10px] text-slate-500">Upload Signature</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'signature')} />
                    {uploadImage.isPending && uploadImage.variables?.type === 'signature' && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>

            {/* Background Watermark Image */}
            <div className="bg-slate-50 p-3 rounded border border-slate-200 mt-3">
              <Label className="mb-1 block text-xs">Background Watermark Image</Label>
              {settings.background_image ? (
                <div className="space-y-3">
                  <div className="relative rounded overflow-hidden border border-slate-200 group flex justify-center p-2 bg-white">
                    <img src={settings.background_image} alt="Background Watermark" className="max-h-16 object-contain" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleDeleteImage('background')}>
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500 mb-1 block">Watermark Scale (%)</Label>
                    <div className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200">
                      <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={settings.fields.watermark_size || 80} 
                        onChange={(e) => setSettings({...settings, fields: {...settings.fields, watermark_size: Number(e.target.value)}})} 
                        className="w-full accent-indigo-600"
                      />
                      <span className="text-xs font-semibold text-slate-600 w-10 text-right">{settings.fields.watermark_size || 80}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-16 border border-slate-300 border-dashed rounded cursor-pointer bg-white hover:bg-slate-50 relative">
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-4 h-4 text-slate-400 mb-1" />
                      <p className="text-[10px] text-slate-500">Upload Background</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e as any, 'background')} />
                    {uploadImage.isPending && uploadImage.variables?.type === 'background' && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
          </Accordion>

          <Accordion title="Custom Header Fields">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[11px] text-slate-500 leading-tight">Add custom details (e.g., FSSAI, DL No.)</p>
              <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={handleAddCustomField}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {(settings.custom_fields || []).map((field, idx) => (
                <div key={idx} className="flex gap-1 items-center bg-slate-50 p-1.5 rounded border border-slate-200">
                  <Input 
                    placeholder="Label" 
                    value={field.key} 
                    onChange={(e) => handleUpdateCustomField(idx, e.target.value, field.value)}
                    className="w-1/3 h-7 text-xs px-2"
                  />
                  <Input 
                    placeholder="Value" 
                    value={field.value} 
                    onChange={(e) => handleUpdateCustomField(idx, field.key, e.target.value)}
                    className="w-2/3 h-7 text-xs px-2"
                  />
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0" onClick={() => handleRemoveCustomField(idx)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              {(settings.custom_fields || []).length === 0 && (
                <div className="text-center p-3 border border-dashed rounded text-xs text-slate-400">
                  No custom fields added.
                </div>
              )}
            </div>
          </Accordion>

          <Accordion title="Invoice Details">
            <div className="space-y-3">
              <div className="space-y-2">
                <Toggle label="Show Logo" checked={settings.fields.show_logo} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_logo: v}})} />
                {settings.fields.show_logo && (
                  <div className="pl-6 flex flex-col gap-3 py-1">
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Logo Size (Height in pixels)</Label>
                      <div className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200">
                        <input 
                          type="range" 
                          min="30" 
                          max="150" 
                          value={settings.fields.logo_size || 60} 
                          onChange={(e) => setSettings({...settings, fields: {...settings.fields, logo_size: Number(e.target.value)}})} 
                          className="w-full accent-indigo-600"
                        />
                        <span className="text-xs font-semibold text-slate-600 w-12 text-right">{settings.fields.logo_size || 60}px</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Toggle label="Show Due Date" checked={settings.fields.show_due_date ?? true} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_due_date: v}})} />
              <Toggle label="Show Document Type (e.g. Type: TAX INVOICE)" checked={settings.fields.show_invoice_type ?? true} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_invoice_type: v}})} />
              <Toggle label="Show Amount in Words" checked={settings.fields.show_amount_in_words} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_amount_in_words: v}})} />
              <Toggle label="Show Bank Details" checked={settings.fields.show_bank_details} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_bank_details: v}})} />
              <div className="space-y-2">
                <Toggle label="Show Terms & Conditions" checked={settings.fields.show_terms} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_terms: v}})} />
                {settings.fields.show_terms && (
                  <div className="pl-6">
                    <Toggle label="Print Terms on a Separate Page (Annexure)" checked={!!settings.fields.terms_on_new_page} onChange={(v) => setSettings({...settings, fields: {...settings.fields, terms_on_new_page: v}})} />
                  </div>
                )}
              </div>
              <Toggle label="Show PO / Reference No" checked={settings.fields.show_reference_number} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_reference_number: v}})} />
              <div className="space-y-2">
                <Toggle label="Show Watermark" checked={settings.fields.show_watermark} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_watermark: v}})} />
                {settings.fields.show_watermark && (
                  <div className="pl-6 flex flex-col gap-3 py-1">
                    <Toggle 
                      label="Use Document Type as Watermark (e.g., INVOICE, QUOTATION)" 
                      checked={!!settings.fields.watermark_use_document_type} 
                      onChange={(v) => setSettings({...settings, fields: {...settings.fields, watermark_use_document_type: v}})} 
                    />
                    
                    {!settings.fields.watermark_use_document_type && (
                      <div>
                        <Label className="text-xs text-slate-500 mb-1 block">Watermark Text (Leave blank for Company Name)</Label>
                        <Input 
                          placeholder="e.g. DRAFT or CONFIDENTIAL" 
                          value={settings.fields.watermark_text || ''} 
                          onChange={(e) => setSettings({...settings, fields: {...settings.fields, watermark_text: e.target.value}})} 
                          className="h-7 text-xs bg-white" 
                        />
                      </div>
                    )}
                    <div>
                      <Label className="text-xs text-slate-500 mb-1 block">Watermark Size</Label>
                      <div className="flex items-center gap-3 bg-white p-2 rounded border border-slate-200">
                        <input 
                          type="range" 
                          min="20" 
                          max="150" 
                          value={settings.fields.watermark_size || 80} 
                          onChange={(e) => setSettings({...settings, fields: {...settings.fields, watermark_size: Number(e.target.value)}})} 
                          className="w-full accent-indigo-600"
                        />
                        <span className="text-xs font-semibold text-slate-600 w-10 text-right">{settings.fields.watermark_size || 80}px</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Toggle label="Show Signature Section" checked={settings.fields.show_signature} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_signature: v}})} />
              {settings.fields.show_signature && (
                <div className="pl-6 pt-1">
                  <Label className="text-xs text-slate-500 mb-1 block">Signature Label</Label>
                  <Input 
                    value={settings.signature_label || ''} 
                    onChange={e => setSettings({...settings, signature_label: e.target.value})}
                    placeholder="e.g. Authorized Signatory"
                    className="h-7 text-xs bg-white"
                  />
                </div>
              )}
              <Toggle label="Show Receiver Signature" checked={settings.fields.show_receiver_signature} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_receiver_signature: v}})} />
              <Toggle label="Show QR Code (Scan to View)" checked={settings.fields.show_qr_code ?? true} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_qr_code: v}})} />

              <div className="pt-2 border-t border-slate-100">
                <Label className="text-xs font-semibold text-slate-600 mb-1 block">Default Terms & Conditions</Label>
                <textarea
                  value={settings.default_terms || ''}
                  onChange={(e) => setSettings({ ...settings, default_terms: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded min-h-[60px]"
                  placeholder="Enter default terms to appear on all new invoices..."
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Label className="text-xs font-semibold text-slate-600 mb-1 block">Default Bank Details</Label>
                <textarea
                  value={settings.default_bank_details || ''}
                  onChange={(e) => setSettings({ ...settings, default_bank_details: e.target.value })}
                  className="w-full text-xs p-2 border border-slate-200 rounded min-h-[60px]"
                  placeholder="Enter bank account details (A/c No, IFSC) for payments..."
                />
              </div>
            </div>
          </Accordion>

          <Accordion title="Party Details">
            <div className="space-y-3">
              <Toggle label="Show Phone Number" checked={settings.fields.show_customer_phone} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_customer_phone: v}})} />
              <Toggle label="Show GSTIN" checked={settings.fields.show_gstin} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_gstin: v}})} />
              <Toggle label="Show Place of Supply" checked={settings.fields.show_place_of_supply} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_place_of_supply: v}})} />
              <Toggle label="Show Vehicle Info" checked={settings.fields.show_vehicle_info} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_vehicle_info: v}})} />
            </div>
          </Accordion>

          <Accordion title="Item Table Columns">
            <div className="space-y-3">
              <Toggle label="Show HSN/SAC Column" checked={settings.fields.show_hsn} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_hsn: v}})} />
              <Toggle label="Show Quantity Column" checked={settings.fields.show_qty} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_qty: v}})} />
              <Toggle label="Show Rate Column" checked={settings.fields.show_rate} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_rate: v}})} />
              <Toggle label="Show Tax Amount" checked={settings.fields.show_tax_amount ?? true} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_tax_amount: v}})} />
              <Toggle label="Show Tax Breakdown (CGST/SGST Details)" checked={settings.fields.show_tax_breakdown} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_tax_breakdown: v}})} />
              <Toggle label="Show Payment Breakdown" checked={settings.fields.show_payment_breakdown ?? true} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_payment_breakdown: v}})} />
              <Toggle label="Show Discount (if any)" checked={settings.fields.show_discount} onChange={(v) => setSettings({...settings, fields: {...settings.fields, show_discount: v}})} />
            </div>
          </Accordion>

        </div>
      </div>

      {/* RIGHT PANEL - LIVE PREVIEW */}
      <div className="w-full md:w-[55%] bg-slate-200 relative overflow-hidden hidden md:block border-l border-slate-300 shadow-inner">
        <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur text-slate-700 border-b border-slate-200 p-2 text-center text-xs font-semibold z-10 flex items-center justify-center gap-2 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          LIVE PDF PREVIEW
        </div>
        <div className="pt-10 h-full">
          <InvoiceLivePreview settings={settings} />
        </div>
      </div>

    </div>
  );
};
