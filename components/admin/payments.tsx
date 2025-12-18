'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, RefreshCw } from 'lucide-react';

interface PaymentMethod {
  id: number;
  name: string;
  minimum: string;
  status: 'active' | 'inactive';
}

export default function AdminPayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    minimum: '',
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/payments');
      const data = await res.json();
      if (data.success) {
        setPaymentMethods(data.methods);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: '', minimum: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setIsEditMode(true);
    setCurrentId(method.id);
    setFormData({
      name: method.name,
      minimum: method.minimum,
      status: method.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode && currentId !== null) {
        await fetch('/api/admin/payments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentId, ...formData })
        });
      } else {
        await fetch('/api/admin/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      fetchMethods();
    } catch (error) {
      alert('Operation failed');
    }
  };

  const deleteMethod = async (id: number) => {
    if (confirm('Are you sure you want to delete this method?')) {
      try {
        await fetch('/api/admin/payments', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        fetchMethods();
      } catch (error) {
        alert('Failed to delete');
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading Methods...</div>;

  return (
    <div className="space-y-6 p-4 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deposit Methods</h1>
        <button onClick={fetchMethods} className="p-2 hover:bg-muted rounded-full">
          <RefreshCw className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-lg">Active Methods</h2>
          <button 
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-semibold border-b border-border text-xs uppercase">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">NAME</th>
                <th className="px-4 py-3 whitespace-nowrap">MINIMUM</th>
                <th className="px-4 py-3 whitespace-nowrap">STATUS</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paymentMethods.length === 0 ? (
                <tr><td colSpan={4} className="text-center p-8 text-muted-foreground">No methods added yet.</td></tr>
              ) : paymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {method.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {method.minimum}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      method.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {method.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openEditModal(method)}
                        className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition text-xs font-medium"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteMethod(method.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-600 transition text-xs font-medium"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-md rounded-xl shadow-xl border border-border animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold text-lg">{isEditMode ? 'Edit Method' : 'Add Method'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Method Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Binance Pay"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Deposit</label>
                <input
                  type="text"
                  value={formData.minimum}
                  onChange={(e) => setFormData({...formData, minimum: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 10 USDT"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'active'}
                      onChange={() => setFormData({...formData, status: 'active'})}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'inactive'}
                      onChange={() => setFormData({...formData, status: 'inactive'})}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm">Inactive</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                >
                  {isEditMode ? 'Update Method' : 'Add Method'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
