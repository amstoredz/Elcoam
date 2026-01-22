'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product } from '@/lib/types';

const wilayas = [
    "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
    "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
    "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
    "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
    "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
    "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
    "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
    "إن صالح", "إن قزام", "تقرت", "جانت", "المغير", "المنيعة"
];

function CartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    baladiya: ''
  });

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
          setLoading(false);
          return;
      }
      try {
        const res = await fetch('/api/products');
        const products = await res.json();
        const found = products.find((p: any) => p.id === productId);
        setProduct(found || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setSubmitting(true);
    
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
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        if (res.ok) {
            alert('تم استلام طلبك بنجاح! سنتصل بك قريباً.');
            router.push('/');
        } else {
            alert('حدث خطأ أثناء إرسال الطلب.');
        }
    } catch (e) {
        alert('حدث خطأ.');
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-10">جاري التحميل...</div>;
  if (!product) return <div className="text-center p-10">السلة فارغة. يرجى اختيار منتج.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">إتمام الطلب</h1>
      
      <div className="mb-8 border-b pb-4">
        <h2 className="text-lg font-semibold mb-2">ملخص الطلب</h2>
        <div className="flex justify-between items-center">
            <span>{product.name} (x1)</span>
            <span className="font-bold">{product.price} د.ج</span>
        </div>
        <div className="flex justify-between items-center mt-2 text-xl font-bold text-blue-600">
            <span>الإجمالي:</span>
            <span>{product.price} د.ج</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">اللقب</label>
                <input 
                    id="lastName"
                    required
                    type="text" 
                    className="w-full border rounded p-2"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
            </div>
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">الاسم</label>
                <input 
                    id="firstName"
                    required
                    type="text" 
                    className="w-full border rounded p-2"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
            </div>
        </div>

        <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">رقم الهاتف</label>
            <input 
                id="phone"
                required
                type="tel" 
                className="w-full border rounded p-2"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="wilaya" className="block text-sm font-medium mb-1">الولاية</label>
                <select 
                    id="wilaya"
                    required
                    className="w-full border rounded p-2"
                    value={formData.wilaya}
                    onChange={e => setFormData({...formData, wilaya: e.target.value})}
                >
                    <option value="">اختر الولاية</option>
                    {wilayas.map((w, i) => (
                        <option key={i} value={w}>{i + 1} - {w}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="baladiya" className="block text-sm font-medium mb-1">البلدية</label>
                <input 
                    id="baladiya"
                    required
                    type="text" 
                    className="w-full border rounded p-2"
                    value={formData.baladiya}
                    onChange={e => setFormData({...formData, baladiya: e.target.value})}
                />
            </div>
        </div>

        <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400 mt-6"
        >
            {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
        </button>
      </form>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="text-center p-10">جاري تحميل السلة...</div>}>
      <CartContent />
    </Suspense>
  );
}