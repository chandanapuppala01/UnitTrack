import React, { useState } from 'react';
import { Zap, Mail, Lock, User, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Screen } from '@/src/types';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface SignupPageProps {
  onNavigate: (screen: Screen) => void;
}

export default function SignupPage({ onNavigate }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      // App.tsx router will automatically redirect based on user state change!
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create an account');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Form Side */}
        <div className="auth-form-side">
          <div className="flex items-center space-x-3 cursor-pointer mb-12" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-bold font-display tracking-tight text-slate-900">UnitTrack</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
            <p className="text-slate-500 font-medium">Start your energy tracking journey today.</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-bold flex items-center mt-6">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-12"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-primary focus:ring-primary/10" required />
              <p className="text-xs text-slate-500 font-medium">
                I agree to the <a href="#" className="text-primary font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-primary font-bold hover:underline">Privacy Policy</a>.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-4 flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 pt-8">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-bold text-primary hover:underline" type="button">Login</button>
          </p>
        </div>

        {/* Image Side */}
        <div className="auth-image-side">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold font-display leading-tight">
              Join the future of energy management.
            </h2>
            <p className="text-primary-100 mt-4 text-lg">
              Get detailed insights, accurate predictions, and real savings suggestions in one easy-to-use dashboard.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center space-x-4">
              <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm font-bold">No smart hardware required</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center space-x-4">
              <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm font-bold">AI-powered bill prediction</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex items-center space-x-4">
              <div className="bg-emerald-400/20 p-2 rounded-lg text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-sm font-bold">Detailed appliance analysis</p>
            </div>
          </div>

          {/* Abstract Background Shapes */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
