import { getProductById } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
           {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg" />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6 text-lg">{product.description}</p>
          <div className="text-2xl font-bold text-green-600 mb-6">{product.price} د.ج</div>
          
          <Link 
            href={`/cart?productId=${product.id}`}
            className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors"
          >
            إضافة للسلة وإتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}