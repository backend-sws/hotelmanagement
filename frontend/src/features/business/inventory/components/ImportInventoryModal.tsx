import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { UploadCloud, FileSpreadsheet, Loader2, Download } from 'lucide-react';
import { useImportProducts } from '../api/useInventory';
import { toast } from 'sonner';
import api from '@/lib/api';

interface ImportInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportInventoryModal({ isOpen, onClose }: ImportInventoryModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const importMutation = useImportProducts();

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get('/business/inventory/template', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      const result = await importMutation.mutateAsync(file);
      toast.success(`Successfully imported ${result.data?.imported || 0} products`);
      setFile(null);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to import products');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-primary-500" />
          <span>Import Products</span>
        </div>
      }
      maxWidth="md"
    >
      <div className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <FileSpreadsheet className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold">How to import products:</p>
            <ol className="list-decimal pl-4 space-y-1 text-xs">
              <li>Download the CSV template below.</li>
              <li>Fill in your product details. <span className="font-semibold">Category Name</span> and <span className="font-semibold">Model Name</span> are required.</li>
              <li>Upload the filled CSV file.</li>
            </ol>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 text-xs h-8 bg-white/80 dark:bg-black/20 border-amber-300 dark:border-amber-500/30 hover:bg-white dark:hover:bg-amber-500/20"
              onClick={handleDownloadTemplate}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download CSV Template
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Upload Completed File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl relative hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-slate-50 dark:bg-[#111118]">
            <div className="space-y-2 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
              <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">CSV files up to 5MB</p>
              {file && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  {file.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 pt-5 border-t border-slate-100 dark:border-white/10">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-xl px-6 h-10 font-bold"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleImport}
          disabled={!file || importMutation.isPending}
          className="rounded-xl px-6 h-10 font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20"
        >
          {importMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Products'
          )}
        </Button>
      </div>
    </Modal>
  );
}
