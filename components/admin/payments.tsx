'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, CheckCircle, XCircle } from 'lucide-react';

interface PaymentMethod {
  id: number;
  name: string;
  iconUrl: string;
  minimum: string;
  status: 'active' | 'inactive';
}

export default function AdminPayments() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, name: 'BINANCE UID', iconUrl: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=029', minimum: '10 USDC', status: 'inactive' },
    { id: 2, name: 'METAMASK', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1200px-MetaMask_Fox.svg.png', minimum: '10 USDC', status: 'active' },
    { id: 3, name: 'TRUST WALLET', iconUrl: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg', minimum: '10 USDC', status: 'active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    iconUrl: '',
    minimum: '',
    status: 'active' as 'active' | 'inactive'
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: '', iconUrl: '', minimum: '', status: 'active' });
    setIsModalOpen(true);
  };

  const openEditModal = (method: PaymentMethod) => {
    setIsEditMode(true);
    setCurrentId(method.id);
    setFormData({
      name: method.name,
      iconUrl: method.iconUrl,
      minimum: method.minimum,
      status: method.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (isEditMode && currentId !== null) {
      setPaymentMethods(paymentMethods.map(m => 
        m.id === currentId ? { ...m, ...formData } : m
      ));
    } else {
      const newId = Math.max(...paymentMethods.map(m => m.id), 0) + 1;
      setPaymentMethods([...paymentMethods, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  const deleteMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deposit Methods</h1>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-lg">Deposit Methods</h2>
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
                <th className="px-4 py-3">ICON</th>
                <th className="px-4 py-3">NAME</th>
                <th className="px-4 py-3">MINIMUM</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <img src={method.iconUrl} alt={method.name} className="w-6 h-6 object-contain" />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{method.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{method.minimum}</td>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg border border-border animate-in fade-in zoom-in duration-200">
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-lg">{isEditMode ? 'Edit Method' : 'Add Method'}</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon URL</label>
                  <input
                    type="text"
                    value={formData.iconUrl}
                    onChange={(e) => setFormData({...formData, iconUrl: e.target.value})}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Minimum Withdraw</label>
                  <input
                    type="text"
                    value={formData.minimum}
                    onChange={(e) => setFormData({...formData, minimum: e.target.value})}
                    className="w-full p-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-4 pt-2">
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

              <div className="flex justify-end gap-2 pt-4">
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
                  {isEditMode ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}