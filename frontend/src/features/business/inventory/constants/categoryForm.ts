import type { FormSectionConfig } from '@/components/ui/dynamic-form';

export const getCategoryFormConfig = (): FormSectionConfig[] => [
  {
    title: 'Category Details',
    description: 'Provide a descriptive name to organize your products efficiently.',
    fields: [
      {
        name: 'name',
        label: 'Category Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Hardware, Electricals, Plumbing, Paints...',
        tooltip: 'Enter the descriptive name of the category (e.g. Hardware, Electricals).',
        colSpan: 2,
      }
    ],
  },
];
