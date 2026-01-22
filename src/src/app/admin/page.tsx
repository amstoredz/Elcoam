'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Order } from '@/lib/types';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  LogOut, 
  Trash2, 
  Plus, 
  Clock, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Search,
  LayoutDashboard
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState({ telegram: { connected: false, hasToken: false, hasChatId: false } });
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'settings'>('stats');
  const [isLoading, setIsLoading] = useState(true);
  
  // New product form
  const [newProduct, setNewProduct] = useState<{
    name: string;
    price: number;
    oldPrice: number;
    description: string;
    image: string;
    category: string;
  }>({
    name: '',
    price: 0,
    oldPrice: 0,
    description: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }

    fetchData();
  }, [router]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [pRes, oRes, sRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/admin/status')
      ]);
      
      setProducts(await pRes.json());
      setOrders(await oRes.json());
      setStatus(await sRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      if (!response.ok) throw new Error('فشل إضافة المنتج');
      
      setNewProduct({ name: '', price: 0, oldPrice: 0, description: '', image: '', category: '' });
      fetchData();
      alert('تم إضافة المنتج بنجاح');
    } catch (error) {
      console.error('خطأ:', error);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  const handleDeleteProduct = async (id: string) => {
      if(confirm('هل أنت متأكد؟')) {
          await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
          fetchData();
      }
  };

  const handleDeleteOrder = async (id: string) => {
    if(confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
        await fetch(`/api/orders?id=${id}`, { method: 'DELETE' });
        fetchData();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black text-white p-6 flex flex-col justify-between md:h-screen md:sticky md:top-0">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <span className="text-2xl font-black">AM</span>
            <span className="text-2xl font-black text-primary">ELECTRO</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('stats')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'stats' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>الرئيسية</span>
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Package className="w-5 h-5" />
              <span>المنتجات</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>الطلبات</span>
              {orders.length > 0 && <span className="mr-auto bg-white text-black text-xs px-2 py-0.5 rounded-full font-bold">{orders.length}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
            >
              <Settings className="w-5 h-5" />
              <span>الإعدادات</span>
            </button>
          </nav>
        </div>

        <button 
          onClick={() => { localStorage.removeItem('admin_auth'); router.push('/'); }} 
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors mt-8 md:mt-0"
        >
            <LogOut className="w-5 h-5" />
            <span>تسجيل خروج</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">مرحباً بك، المشرف</h1>
            <p className="text-gray-500 text-sm">إليك نظرة عامة على متجرك اليوم</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
               <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="text-left hidden sm:block">
               <div className="font-bold text-sm">{new Date().toLocaleDateString('ar-DZ')}</div>
               <div className="text-gray-400 text-xs">{new Date().toLocaleTimeString('ar-DZ')}</div>
            </div>
          </div>
        </header>

        {activeTab === 'stats' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-2xl text-primary">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-gray-500 font-medium text-sm">إجمالي المبيعات</div>
                        <div className="text-2xl font-black">{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} د.ج</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-50 p-4 rounded-2xl text-blue-500">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-gray-500 font-medium text-sm">عدد الطلبات</div>
                        <div className="text-2xl font-black">{orders.length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-purple-50 p-4 rounded-2xl text-purple-500">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-gray-500 font-medium text-sm">المنتجات</div>
                        <div className="text-2xl font-black">{products.length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-4 rounded-2xl text-green-500">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-gray-500 font-medium text-sm">العملاء</div>
                        <div className="text-2xl font-black">{new Set(orders.map(o => o.customer.phone)).size}</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6">أحدث الطلبات</h2>
                {orders.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">لا توجد طلبات لعرضها</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="text-gray-400 text-sm border-b border-gray-100">
                                <tr>
                                    <th className="pb-4">رقم الطلب</th>
                                    <th className="pb-4">العميل</th>
                                    <th className="pb-4">التاريخ</th>
                                    <th className="pb-4">المبلغ</th>
                                    <th className="pb-4">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-bold">#{order.id}</td>
                                        <td className="py-4">{order.customer.firstName} {order.customer.lastName}</td>
                                        <td className="py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('ar-DZ')}</td>
                                        <td className="py-4 font-bold">{order.total.toLocaleString()} د.ج</td>
                                        <td className="py-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">جديد</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-4 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-6 h-6 text-primary" />
                        <span>إضافة منتج</span>
                    </h2>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">اسم المنتج</label>
                            <input className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">السعر (د.ج)</label>
                            <input type="number" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors" value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">السعر القديم (د.ج) - اختياري</label>
                            <input type="number" className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors" value={newProduct.oldPrice || ''} onChange={e => setNewProduct({...newProduct, oldPrice: Number(e.target.value)})} />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">الوصف</label>
                            <textarea className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl h-24 resize-none focus:outline-none focus:border-primary transition-colors" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">رابط الصورة</label>
                            <input className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-500 mb-1 block">التصنيف</label>
                            <input className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl focus:outline-none focus:border-primary transition-colors" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
                        </div>
                        <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">حفظ المنتج</button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">قائمة المنتجات ({products.length})</h2>
                  <div className="relative">
                      <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input placeholder="بحث..." className="bg-white border border-gray-100 pl-4 pr-10 py-2 rounded-full text-sm focus:outline-none focus:border-primary w-64" />
                  </div>
              </div>
              
              {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all border border-gray-100 group">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-xl bg-gray-100" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{p.name}</h4>
                    <p className="text-gray-500 text-sm mb-1">{p.category}</p>
                    <p className="text-black font-black">{p.price.toLocaleString()} د.ج</p>
                  </div>
                  <button onClick={() => handleDeleteProduct(p.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold mb-4">إدارة الطلبات</h2>
                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">لا توجد طلبات حتى الآن</h3>
                    </div>
                ) : orders.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap justify-between items-start border-b border-gray-100 pb-4 mb-4 gap-4">
                            <div>
                                <h3 className="font-black text-xl flex items-center gap-3">
                                    طلب #{order.id}
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">جديد</span>
                                </h3>
                                <span className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(order.createdAt).toLocaleDateString('ar-DZ')} - {new Date(order.createdAt).toLocaleTimeString('ar-DZ')}
                                </span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-gray-400">الإجمالي</div>
                                <div className="text-2xl font-black text-primary">{order.total.toLocaleString()} د.ج</div>
                            </div>
                            <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-6 rounded-2xl">
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
                                    <Users className="w-5 h-5" />
                                    بيانات العميل
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-500">الاسم:</span> <span className="font-bold">{order.customer.firstName} {order.customer.lastName}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">الهاتف:</span> <span className="font-bold font-mono">{order.customer.phone}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">الولاية:</span> <span className="font-bold">{order.customer.wilaya}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">البلدية:</span> <span className="font-bold">{order.customer.baladiya}</span></p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
                                    <Package className="w-5 h-5" />
                                    المنتجات
                                </h4>
                                <ul className="space-y-3">
                                    {order.products.map((p, i) => (
                                        <li key={i} className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs">{p.quantity}x</span>
                                                <span className="text-sm font-medium">{p.name}</span>
                                            </div>
                                            <span className="font-bold text-sm">{p.price.toLocaleString()} د.ج</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'settings' && (
            <div className="animate-fade-in max-w-2xl mx-auto">
                <h2 className="text-xl font-bold mb-6">إعدادات النظام</h2>
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                        <Settings className="w-6 h-6 text-primary" />
                        إعدادات الإشعارات (Telegram)
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                {status.telegram.connected ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                                <div>
                                    <div className="font-bold">حالة الاتصال</div>
                                    <div className="text-xs text-gray-500">{status.telegram.connected ? 'متصل وجاهز لإرسال الإشعارات' : 'غير متصل، يرجى التحقق من الإعدادات'}</div>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${status.telegram.connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {status.telegram.connected ? 'نشط' : 'غير نشط'}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-4"></div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bot Token</label>
                            <div className="flex gap-2">
                                <input 
                                    type="password" 
                                    readOnly 
                                    value={status.telegram.hasToken ? "••••••••••••••••••••••••••••••" : "Not Set"} 
                                    className="flex-1 bg-gray-100 border-none rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" 
                                />
                                <span className="text-xs flex items-center text-gray-400">
                                    {status.telegram.hasToken ? 'تم الإعداد' : 'مفقود'}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Chat ID</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={status.telegram.hasChatId ? "•••••••" : "Not Set"} 
                                    className="flex-1 bg-gray-100 border-none rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" 
                                />
                                <span className="text-xs flex items-center text-gray-400">
                                    {status.telegram.hasChatId ? 'تم الإعداد' : 'مفقود'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mt-4">
                            <p className="text-xs text-blue-700 leading-relaxed">
                                <strong>ملاحظة:</strong> يتم تكوين هذه الإعدادات عبر ملفات البيئة (.env) في الخادم لأسباب أمنية. إذا كنت بحاجة لتغييرها، يرجى التواصل مع الدعم الفني.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
