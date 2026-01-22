'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { ShoppingBag } from 'lucide-react';
import OrderModal from './OrderModal';

export default function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const hasDiscount = !!product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  return (
    <>
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-4 right-4 z-10 bg-primary text-black font-bold px-3 py-1 rounded-full text-sm">
            -{discountPercentage}%
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
           />
        </div>

        {/* Content */}
        <div className="p-4 text-center">
          <div className="text-primary font-medium text-sm mb-1">{product.category}</div>
          <h3 className="font-bold text-lg mb-2 line-clamp-1 cursor-pointer" onClick={() => setIsModalOpen(true)}>{product.name}</h3>
          
          <div className="flex justify-center items-center gap-3 mb-4">
             <span className="text-2xl font-black">{product.price.toLocaleString('en-US')} د.ج</span>
             {hasDiscount && (
               <span className="text-gray-400 line-through text-sm font-medium">{product.oldPrice!.toLocaleString('en-US')} د.ج</span>
             )}
          </div>

          <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-black text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300"
          >
              <ShoppingBag className="w-5 h-5" />
              <span>أطلب الآن</span>
          </button>
        </div>
      </div>

      <OrderModal 
        product={product} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}