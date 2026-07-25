import type { ReactNode } from 'react';
import type { FormSectionConfig } from '@/components/ui/dynamic-form';

export const getInventoryFormConfig = (
  categories: { value: string | number; label: string }[],
  brands: { value: string | number; label: string }[],
  isEditing?: boolean
): FormSectionConfig[] => [
  {
    title: 'Basic Info',
    description: 'Provide general product details and classification.',
    fields: [
      {
        name: 'category_id',
        label: 'Category',
        type: 'select',
        options: categories,
        required: true,
        searchable: true,
        creatable: true,
        tooltip: 'The product category this item belongs to. Type to search or create a new one.',
      },
      {
        name: 'brand_id',
        label: 'Brand (Optional)',
        type: 'select',
        options: brands,
        searchable: true,
        creatable: true,
        placeholder: 'e.g. Samsung, Apple, OnePlus...',
        tooltip: 'The manufacturer or brand name of the product. Type to search or create a new one.',
      },
      {
        name: 'model_name',
        label: 'Product / Item Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Cement, Iron Rod...',
        tooltip: 'The specific product name.',
      },
      {
        name: 'item_code',
        label: 'Item Code',
        type: 'text',
        placeholder: 'e.g. CEM-001',
      },
      {
        name: 'unit',
        label: 'Unit',
        type: 'select',
        options: [
          { value: 'nos', label: 'Numbers (nos)' },
          { value: 'kg', label: 'Kilograms (kg)' },
          { value: 'ton', label: 'Tons' },
          { value: 'cft', label: 'Cubic Feet (cft)' },
          { value: 'brass', label: 'Brass' },
          { value: 'bag', label: 'Bags' },
          { value: 'sqft', label: 'Square Feet (sqft)' },
          { value: 'ltr', label: 'Liters' },
          { value: 'mtr', label: 'Meters' },
        ],
        required: true,
      },
      {
        name: 'hsn_code',
        label: 'HSN / SAC Code',
        type: 'text',
        placeholder: 'e.g. 2523',
      },
      {
        name: 'gst_rate',
        label: 'GST Rate (%)',
        type: 'select',
        options: [
          { value: '0', label: '0% (Exempt)' },
          { value: '5', label: '5%' },
          { value: '12', label: '12%' },
          { value: '18', label: '18%' },
          { value: '28', label: '28%' },
        ],
        required: true,
      },
    ],
  },
  {
    title: isEditing ? 'Pricing' : 'Pricing & Stock',
    description: isEditing ? 'Update your product pricing.' : 'Set your purchase cost, selling price, and initial stock.',
    fields: [
      {
        name: 'purchase_price',
        label: 'Purchase Rate / Price (₹)',
        type: 'number',
        required: true,
        step: '0.01',
      },
      {
        name: 'mrp',
        label: 'Sale Rate / MRP (₹)',
        type: 'number',
        required: true,
        step: '0.01',
      },
      ...(isEditing ? [] : [
        {
          name: 'quantity',
          label: 'Initial Stock',
          type: 'number' as const,
          required: true,
          step: '0.001',
          tooltip: 'The initial quantity available in your inventory.',
        },
        {
          name: 'min_stock_alert',
          label: 'Min Stock Alert',
          type: 'number' as const,
          step: '0.001',
          tooltip: 'Low stock warning limit.',
        }
      ]),
    ],
  },
];
