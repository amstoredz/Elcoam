'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { X, CheckCircle, Loader2 } from 'lucide-react';

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    baladiya: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      products: [{
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.price
      }],
      total: product.price,
      customer: formData
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ firstName: '', lastName: '', phone: '', wilaya: '', baladiya: '' });
        }, 3000);
      } else {
        alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('حدث خطأ غير متوقع.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black mb-2">تم استلام طلبك بنجاح!</h2>
            <p className="text-gray-500">سنتصل بك قريباً لتأكيد الطلب.</p>
          </div>
        ) : (
          <div className="p-8">
            <h2 className="text-2xl font-black mb-6 text-center">إتمام الطلب</h2>
            
            <div className="flex gap-4 mb-8 bg-gray-50 p-4 rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-xl bg-white" />
              <div>
                <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                <div className="font-black text-primary text-lg">{product.price.toLocaleString()} د.ج</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">الاسم</label>
                  <input 
                    required 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">اللقب</label>
                  <input 
                    required 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 text-gray-700">رقم الهاتف</label>
                <input 
                  required 
                  type="tel"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">الولاية</label>
                  <input 
                    required 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                    value={formData.wilaya}
                    onChange={e => setFormData({...formData, wilaya: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 text-gray-700">البلدية</label>
                  <input 
                    required 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-primary transition-colors"
                    value={formData.baladiya}
                    onChange={e => setFormData({...formData, baladiya: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] flex justify-center items-center gap-2 mt-4"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : 'تأكيد الطلب'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}