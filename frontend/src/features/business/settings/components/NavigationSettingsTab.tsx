import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { Toggle } from '@/components/ui/toggle';
import { businessMenuGroups } from '@/components/layout/Sidebar';
import { AlertCircle } from 'lucide-react';

export const NavigationSettingsTab = ({ form }: { form: UseFormReturn<any> }) => {
  const hiddenItems = form.watch('settings.hidden_sidebar_items') || [];

  const handleToggleHide = (href: string) => {
    if (hiddenItems.includes(href)) {
      form.setValue('settings.hidden_sidebar_items', hiddenItems.filter((i: string) => i !== href), { shouldDirty: true });
    } else {
      form.setValue('settings.hidden_sidebar_items', [...hiddenItems, href], { shouldDirty: true });
    }
  };

  // Flatten sidebar items to use in the dropdown
  const allSidebarItems = businessMenuGroups.flatMap(group => group.items);
  
  const redirectOptions = [
    { value: '/dashboard', label: 'Dashboard (Default)' },
    ...allSidebarItems.map(item => ({
      value: item.href,
      label: item.name
    }))
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Navigation & Sidebar Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure how your sidebar looks and where users land after logging in.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Default Login Page</label>
            <CustomSelect
              options={redirectOptions}
              value={form.watch('settings.default_login_redirect')}
              onChange={(v) => form.setValue('settings.default_login_redirect', v, { shouldDirty: true })}
              placeholder="Select default page to open after login..."
            />
            <p className="text-xs text-slate-500">
              This is the page that will automatically open when you or your staff logs into this business.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Sidebar Modules
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Toggle the modules below to show or hide them from the left sidebar for everyone in your business.
            </p>

            <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                Hiding an item from the sidebar does not restrict access to it. It only removes it from the menu. To restrict access, use Roles & Permissions.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {businessMenuGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                    {group.title}
                  </h4>
                  <div className="space-y-4">
                    {group.items.map((item, itemIdx) => {
                      const isHidden = hiddenItems.includes(item.href);
                      return (
                        <div key={itemIdx}>
                          <Toggle
                            checked={!isHidden}
                            onChange={() => handleToggleHide(item.href)}
                            label={item.name}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
