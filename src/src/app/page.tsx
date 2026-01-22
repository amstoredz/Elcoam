import { getProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { Clock, ShoppingBag, Truck, ShieldCheck, Headphones, Star } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await getProducts();
  const categories = ["الكل", "مطبخ", "غرفة المعيشة", "اكسسوارات"];

  const features = [
    {
      icon: <Truck className="w-10 h-10 text-primary" />,
      title: "توصيل سريع",
      description: "خدمة توصيل سريعة وموثوقة لجميع الولايات"
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
      title: "ضمان الجودة",
      description: "جميع منتجاتنا أصلية ومضمونة 100%"
    },
    {
      icon: <Headphones className="w-10 h-10 text-primary" />,
      title: "دعم متميز",
      description: "فريق دعم فني جاهز لخدمتكم على مدار الساعة"
    },
    {
      icon: <Star className="w-10 h-10 text-primary" />,
      title: "أفضل الماركات",
      description: "ننتقي لكم أفضل الماركات العالمية بعناية"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      
      {/* Hero Section */}
      <section 
        className="relative text-white py-24 overflow-hidden rounded-b-[3rem] shadow-2xl bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-8 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 animate-fade-in">
                <span className="text-primary">✨</span>
                <span className="text-sm font-medium">تجربة تسوق فريدة من نوعها</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              <span className="block mb-2">AM</span>
              <span className="text-primary text-6xl md:text-8xl">ELECTRO</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                التفرد، الفخامة، والدقة. وجهتكم الأولى في الجزائر لأفخر الأجهزة التي تجمع بين العراقة والتميز.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <Link href="#products" className="bg-primary text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-dark transition-all transform hover:scale-105 flex items-center gap-3 shadow-lg shadow-primary/25">
                  <ShoppingBag className="w-6 h-6" />
                  <span>اكتشف المتجر</span>
              </Link>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 -mt-16 relative z-20 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow text-center group">
              <div className="bg-gray-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="products" className="container mx-auto px-4 py-16 text-center flex-grow">
        <h2 className="text-4xl font-black mb-2">الكتالوج الذهبي</h2>
        <p className="text-gray-500 tracking-widest uppercase mb-12 text-sm">Curated Luxury Appliances</p>
        
        <div className="flex justify-center flex-wrap gap-3 mb-16">
            {categories.map((cat, idx) => (
                <button 
                    key={idx}
                    className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                      idx === 0 
                        ? 'bg-black text-white shadow-lg scale-105' 
                        : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-105'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
    </div>
  );
}
