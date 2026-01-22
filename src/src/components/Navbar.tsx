'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount === 3) {
      router.push('/admin/login');
      setClickCount(0);
    }

    // Reset count after 1 second if not reached 3
    setTimeout(() => {
      setClickCount(0);
    }, 1000);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left: Cart Button - REMOVED */}
          <div className="w-10"></div>

          {/* Center: Logo */}
          <div className="flex items-center gap-2 text-2xl font-black tracking-tighter select-none">
            <Link href="/">
              <span>AM</span>
              <span className="text-primary">ELECTRO</span>
            </Link>
            <div 
              onClick={handleSecretClick}
              className="bg-black text-primary p-1 rounded ml-1 cursor-pointer active:scale-95 transition-transform"
              title="Time"
            >
                <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Right: Menu */}
          <div className="flex items-center gap-4">
            <button className="p-1">
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}