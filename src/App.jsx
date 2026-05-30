import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  LogOut, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  User as UserIcon, 
  Download,
  ShieldCheck
} from 'lucide-react';
import axios from 'axios';

export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [tab, setTab] = useState('store');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const products = [
    { id: '1', title: "Assam History Masterclass (PDF)", price: 149, category: "E-Book" },
    { id: '2', title: "APSC Prelims Mock Test Series", price: 299, category: "Exam" },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', loginData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      alert("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 shadow-2xl">
          <div className="text-center mb-8">
            <BookOpen className="text-blue-600 mx-auto" size={48} />
            <h1 className="text-2xl font-bold mt-4">studyASSAM</h1>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" className="w-full border p-4 rounded-xl" onChange={e => setLoginData({...loginData, email: e.target.value})} required />
            <input type="password" placeholder="Password" className="w-full border p-4 rounded-xl" onChange={e => setLoginData({...loginData, password: e.target.value})} required />
            <button className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-bold">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] text-white p-8 fixed h-full flex flex-col">
        <div className="flex items-center gap-3 mb-12 text-blue-400 font-bold text-2xl"><BookOpen /> studyASSAM</div>
        <nav className="flex-1 space-y-3">
          <button onClick={() => setTab('store')} className={`w-full flex items-center gap-4 p-4 rounded-2xl ${tab === 'store' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <ShoppingCart size={22} /> Store
          </button>
          <button onClick={() => setTab('dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-2xl ${tab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <LayoutDashboard size={22} /> My Vault
          </button>

          {/* ADMIN PANEL BUTTON - ONLY SHOWS IF ROLE IS ADMIN */}
          {user.role === 'ADMIN' && (
            <button onClick={() => setTab('admin')} className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-blue-500/30 ${tab === 'admin' ? 'bg-blue-900' : ''}`}>
              <ShieldCheck size={22} /> Admin Panel
            </button>
          )}
        </nav>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-red-400 p-4 font-bold mt-auto flex gap-2"><LogOut /> Sign Out</button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ml-72 flex-1 p-12">
        <h2 className="text-4xl font-extrabold text-slate-800 capitalize mb-10">{tab}</h2>

        {tab === 'store' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-3xl border shadow-sm">
                <FileText className="text-slate-300 mb-4" size={48} />
                <h3 className="font-bold text-xl">{p.title}</h3>
                <p className="text-2xl font-black text-blue-600 mt-4">₹{p.price}</p>
                <button className="w-full mt-6 bg-[#0f172a] text-white py-3 rounded-xl font-bold">Buy Now</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'admin' && (
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-blue-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Welcome to the Control Center</h3>
            <p className="text-slate-500">From here, you can eventually upload real PDFs. Currently, use the Supabase Table Editor to manage products.</p>
          </div>
        )}

        {tab === 'dashboard' && (
          <div className="p-20 text-center border-2 border-dashed rounded-[3rem]">
            <p className="text-slate-400">Your materials will appear here after purchase.</p>
          </div>
        )}
      </main>
    </div>
  );
          }
