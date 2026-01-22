'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Clock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { 
      localStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 bg-[url('/pattern.svg')] bg-repeat"></div>
      <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-[100px] -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -bottom-20 -right-20"></div>

      <div className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md border border-white/10 relative z-10">
        <div className="text-center mb-10">
            <div className="inline-flex justify-center items-center gap-2 mb-4 bg-white/10 p-3 rounded-2xl">
                <span className="text-3xl font-black text-white">AM</span>
                <span className="text-3xl font-black text-primary">ELECTRO</span>
                <div className="bg-white text-black p-1 rounded ml-1">
                    <Clock className="w-6 h-6" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
            <p className="text-gray-400 text-sm mt-2">يرجى تسجيل الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              className="w-full bg-black/50 border border-gray-700 text-white p-4 pr-12 rounded-xl focus:outline-none focus:border-primary transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:bg-primary-dark transition-all transform hover:scale-[1.02] shadow-lg shadow-primary/25">
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
