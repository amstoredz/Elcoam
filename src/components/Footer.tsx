import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-4 text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-black tracking-tighter mb-6">
              <span>AM</span>
              <span className="text-primary">ELECTRO</span>
              <div className="bg-white text-black p-1 rounded ml-1">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-2xl mx-auto">
              وجهتكم الأولى للأجهزة الإلكترونية الفاخرة في الجزائر. نجمع بين الجودة العالية والتصميم العصري.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-black transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-primary hover:text-black transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AM ELECTRO. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
