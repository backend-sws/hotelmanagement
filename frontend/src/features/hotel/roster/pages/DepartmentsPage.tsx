import { useState } from 'react';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '../api/useHotelRoster';
import { Plus, Building2, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import type { HotelDepartment } from '../schemas/rosterSchema';

export function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<HotelDepartment | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  const openModal = (dept?: HotelDepartment) => {
    if (dept) {
      setEditingDept(dept);
      setName(dept.name);
      setDescription(dept.description || '');
      setColor(dept.color);
    } else {
      setEditingDept(null);
      setName('');
      setDescription('');
      setColor('#6366f1');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await updateDept.mutateAsync({ id: editingDept.id, name, description, color });
        toast.success('Department updated');
      } else {
        await createDept.mutateAsync({ name, description, color, is_active: true });
        toast.success('Department created');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this department?')) {
      try {
        await deleteDept.mutateAsync(id);
        toast.success('Department deleted');
      } catch (error: any) {
        toast.error('Failed to delete department');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white">
            <Building2 className="w-7 h-7 text-indigo-500" />
            Hotel Departments
          </h1>
          <p className="text-slate-500 mt-1">Manage departments for staff scheduling.</p>
        </div>
        <Button onClick={() => openModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-105 rounded-xl px-5 h-10">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments?.map((dept: HotelDepartment) => (
          <Card key={dept.id} className="group overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300 flex flex-col p-0 border-slate-200/60 dark:border-white/10 rounded-2xl">
            <div className="h-2 w-full transition-all duration-300 group-hover:h-3" style={{ backgroundColor: dept.color }} />
            <CardContent className="p-6 flex flex-col h-full bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-900/50">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">{dept.name}</h3>
                  </div>
                  <div className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-950" style={{ backgroundColor: dept.color }} />
                </div>
                {dept.description ? (
                  <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed">{dept.description}</p>
                ) : (
                  <p className="text-slate-400 text-sm mb-4 italic">No description provided.</p>
                )}
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{dept.roster_entries_count || 0}</span> shifts assigned
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openModal(dept)} className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(dept.id)} className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {departments?.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-slate-50 rounded-xl border border-dashed">
            <p className="text-slate-500">No departments configured yet.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingDept ? 'Edit Department' : 'New Department'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Department Name</Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Front Desk" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <div className="space-y-2">
            <Label>Color Code</Label>
            <div className="flex gap-3">
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-16 h-10 p-1" />
              <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createDept.isPending || updateDept.isPending}>Save Department</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

