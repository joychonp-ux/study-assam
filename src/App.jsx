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

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [tab, setTab] = useState('store');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Sample Products - In a real app, these would come from your Database
  const products = [
    { id: '1', title: "Assam History Masterclass (PDF)", price: 149, category: "E-Book" },
    { id: '2', title: "APSC Prelims Mock Test Series", price: 299, category: "Exam" },
    { id: '3', title: "Current Affairs 2024 - Special Edition", price: 50, category: "Notes" },
  ];

  // --- LOGIN LOGIC ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This calls the backend we created in api/index.js
      const res = await axios.post('/api/auth/login', loginData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert("Login failed! Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // --- RAZORPAY PAYMENT LOGIC ---
  const handlePurchase = async (product) => {
    try {
      const { data: order } = await axios.post('/api/payment/order', { amount: product.price });
      
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // This will use your Vercel Env Variable
        amount: order.amount,
        currency: "INR",
        name: "studyASSAM",
        description: `Purchase ${product.title}`,
        order_id: order.id,
        handler: function (response) {
          alert("Payment Successful! File added to your vault.");
          setTab('dashboard');
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#0f172a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Payment failed to initialize.");
    }
  };

  // --- UI: LOGIN SCREEN ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
          <div className="bg-[#1e293b] p-10 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
              <BookOpen className="text-white" size={32} />
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight">studyASSAM</h1>
            <p className="text-slate-400 text-sm mt-1">Digital Learning Portal</p>
          </div>
          <form className="p-8 space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">EMAIL ADDRESS</label>
              <input 
                type="email" 
                placeholder="student@example.com" 
                className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 transition"
                onChange={e => setLoginData({...loginData, email: e.target.value})} 
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1">PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full border-2 border-slate-100 p-4 rounded-2xl outline-none focus:border-blue-500 transition"
                onChange={e => setLoginData({...loginData, password: e.target.value})} 
                required
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-[#0f172a] text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg active:scale-95"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- UI: DASHBOARD LAYOUT ---
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] text-white p-8 fixed h-full flex flex-col shadow-2xl">
        <div className="flex items-center gap-3 mb-12 text-blue-400 font-bold text-2xl tracking-tight">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          studyASSAM
        </div>

        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setTab('store')} 
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${tab === 'store' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <ShoppingCart size={22} /> 
            <span className="font-semibold">Browse Store</span>
          </button>
          <button 
            onClick={() => setTab('dashboard')} 
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${tab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={22} /> 
            <span className="font-semibold">My Vault</span>
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }} 
            className="flex items-center gap-4 p-4 text-red-400 hover:bg-red-950/20 w-full rounded-2xl transition"
          >
            <LogOut size={22} /> 
            <span className="font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-72 flex-1 p-12">
        
        {/* TOP HEADER */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-800 capitalize tracking-tight">{tab}</h2>
            <p className="text-slate-500 mt-1">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-bold border border-green-100">
              <ShieldCheck size={14} /> Secure Session
            </div>
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 px-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                {user.name[0]}
              </div>
            </div>
          </div>
        </header>

        {/* STORE VIEW */}
        {tab === 'store' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                <div className="h-44 bg-slate-50 rounded-3xl mb-6 flex items-center justify-center text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <FileText size={64} />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {p.category}
                  </span>
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2 leading-tight h-14">
                  {p.title}
                </h3>
                <div className="flex items-center justify-between mt-8">
                  <div>
                    <p className="text-sm text-slate-400 font-bold">PRICE</p>
                    <p className="text-3xl font-black text-slate-900">₹{p.price}</p>
                  </div>
                  <button 
                    onClick={() => handlePurchase(p)}
                    className="bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 hover:scale-105 transition active:scale-95 shadow-xl shadow-slate-900/10"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DASHBOARD / VAULT VIEW */
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-10 py-5">Material Name</th>
                    <th className="px-10 py-5">Status</th>
                    <th className="px-10 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Mock Purchase Data */}
                  <tr className="hover:bg-slate-50/50 transition">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                          <FileText size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Assam History Masterclass</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle size={14} /> Purchased
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="inline-flex items-center gap-2 bg-white border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 px-5 py-2.5 rounded-xl font-bold transition text-sm">
                        <Download size={16} /> Download PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Empty State if no purchases */}
              <div className="p-20 text-center">
                <p className="text-slate-400 font-medium">Your digital library is growing. Buy materials to see them here.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
      }
