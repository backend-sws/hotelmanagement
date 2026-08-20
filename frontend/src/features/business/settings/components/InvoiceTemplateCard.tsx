import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface InvoiceTemplateCardProps {
  id: 'default' | 'modern' | 'classic' | 'premium' | 'pos';
  name: string;
  description: string;
  selected: boolean;
  onSelect: (id: 'default' | 'modern' | 'classic' | 'premium' | 'pos') => void;
}

export const InvoiceTemplateCard: React.FC<InvoiceTemplateCardProps> = ({
  id,
  name,
  description,
  selected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(id)}
      className={cn(
        'relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
        selected
          ? 'border-indigo-600 bg-indigo-50/50'
          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 text-indigo-600">
          <CheckCircle2 className="w-5 h-5 fill-indigo-100" />
        </div>
      )}
      
      {/* Mockup Preview Icon based on template type */}
      <div className="w-16 h-20 mb-3 rounded shadow-sm border border-slate-200 bg-white flex flex-col overflow-hidden">
        {id === 'default' && (
          <>
            <div className="h-3 bg-slate-100 border-b border-slate-200"></div>
            <div className="flex-1 p-1">
              <div className="flex justify-between mb-1">
                <div className="w-4 h-1 bg-slate-200 rounded"></div>
                <div className="w-6 h-1 bg-slate-300 rounded"></div>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded border border-slate-200 mb-1"></div>
              <div className="flex justify-between">
                <div className="w-8 h-3 bg-slate-100 rounded"></div>
                <div className="w-4 h-3 bg-slate-100 rounded"></div>
              </div>
            </div>
          </>
        )}
        {id === 'modern' && (
          <>
            <div className="h-5 bg-indigo-50 flex items-center px-1">
              <div className="w-6 h-2 bg-indigo-200 rounded-full"></div>
            </div>
            <div className="flex-1 p-1">
              <div className="flex justify-between mb-2">
                <div className="w-5 h-1 bg-slate-200 rounded"></div>
                <div className="w-4 h-1 bg-slate-200 rounded"></div>
              </div>
              <div className="w-full h-1 bg-indigo-100 rounded mb-1"></div>
              <div className="w-full h-1 bg-slate-100 rounded mb-1"></div>
              <div className="w-full h-1 bg-slate-100 rounded mb-1"></div>
            </div>
          </>
        )}
        {id === 'classic' && (
          <div className="h-full border border-slate-800 p-[2px] flex flex-col">
            <div className="h-3 border-b border-slate-800 flex justify-center items-center">
              <div className="w-8 h-1 bg-slate-800"></div>
            </div>
            <div className="flex border-b border-slate-800 h-3">
              <div className="flex-1 border-r border-slate-800"></div>
              <div className="flex-1"></div>
            </div>
            <div className="w-full h-1 bg-slate-200 border-b border-slate-800"></div>
            <div className="flex-1 flex flex-col justify-end items-end p-[2px]">
              <div className="w-6 h-1 bg-slate-800 mb-[1px]"></div>
              <div className="w-6 h-1 bg-slate-800"></div>
            </div>
          </div>
        )}
        {id === 'premium' && (
          <div className="h-full bg-slate-900 text-slate-100 flex flex-col">
            <div className="h-4 bg-amber-500/20 border-b border-amber-500/30 flex items-center justify-between px-1">
               <div className="w-4 h-1 bg-amber-400 rounded"></div>
               <div className="w-6 h-1 bg-slate-400 rounded"></div>
            </div>
            <div className="flex-1 p-1 flex flex-col gap-1">
              <div className="w-full h-3 bg-slate-800 rounded border border-slate-700"></div>
              <div className="flex gap-1">
                <div className="w-2/3 h-1 bg-slate-700 rounded"></div>
                <div className="w-1/3 h-1 bg-amber-500/50 rounded"></div>
              </div>
              <div className="w-1/2 h-1 bg-slate-700 rounded mt-auto self-end"></div>
            </div>
          </div>
        )}
        {id === 'pos' && (
          <div className="h-full bg-amber-50/40 border border-dashed border-slate-400 p-[3px] flex flex-col justify-between items-center text-slate-800">
            <div className="w-7 h-1.5 bg-slate-700 rounded-sm mb-0.5"></div>
            <div className="w-9 h-0.5 bg-slate-400 rounded-sm mb-1"></div>
            <div className="w-full border-t border-dashed border-slate-400 my-0.5"></div>
            <div className="w-full flex justify-between px-0.5">
              <div className="w-4 h-1 bg-slate-500 rounded-sm"></div>
              <div className="w-3 h-1 bg-slate-500 rounded-sm"></div>
            </div>
            <div className="w-full flex justify-between px-0.5">
              <div className="w-5 h-1 bg-slate-500 rounded-sm"></div>
              <div className="w-2 h-1 bg-slate-500 rounded-sm"></div>
            </div>
            <div className="w-full border-t border-dashed border-slate-400 my-0.5"></div>
            <div className="w-7 h-1.5 bg-slate-800 rounded-sm mt-0.5"></div>
          </div>
        )}
      </div>

      <h3 className={cn("font-medium text-sm mb-1", selected ? "text-indigo-900" : "text-slate-700")}>
        {name}
      </h3>
      <p className="text-xs text-slate-500 text-center line-clamp-2">
        {description}
      </p>
    </div>
  );
};
