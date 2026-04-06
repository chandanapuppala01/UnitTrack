import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Moon,
  Zap,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  ExternalLink,
  Edit2,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [location, setLocation] = useState('Mumbai, Maharashtra');

  // Reset form when user loads
  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, { displayName });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };

  const handleSignOutAll = async () => {
    toast.success('Signed out from all devices');
    await logout();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile, preferences, and billing information.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Profile Info */}
        <div className="col-span-4 space-y-6">
          <div className="glass-card p-8 flex flex-col items-center text-center space-y-6">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-tr from-primary to-secondary rounded-full p-1.5 shadow-xl shadow-primary/10">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-white text-4xl font-bold text-slate-300">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <button onClick={() => toast("Avatar uploads coming soon!", { icon: '📸' })} className="absolute bottom-1 right-1 bg-white text-slate-600 p-2 rounded-full shadow-lg border border-slate-100 hover:text-primary transition-colors active:scale-95">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="w-full">
              {isEditing ? (
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-center font-bold text-lg focus:ring-2 focus:ring-primary/20"
                    placeholder="Display Name"
                  />
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-center text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Phone"
                  />
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-center text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="Location"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900">{user?.displayName || 'Unnamed User'}</h2>
                  <p className="text-slate-400 font-medium text-sm mt-1">Active Member</p>
                </>
              )}
            </div>

            <div className="w-full pt-6 border-t border-slate-50 space-y-4">
              <ProfileInfoItem icon={Mail} label="Email" value={user?.email || 'No email configured'} />
              {!isEditing && (
                <>
                  <ProfileInfoItem icon={Phone} label="Phone" value={phone} />
                  <ProfileInfoItem icon={MapPin} label="Location" value={location} />
                </>
              )}
            </div>

            {isEditing ? (
              <div className="flex w-full space-x-2">
                <button onClick={() => setIsEditing(false)} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center space-x-2 active:scale-95">
                  <X size={18} /><span>Cancel</span>
                </button>
                <button onClick={handleSave} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 active:scale-95">
                  <Save size={18} /><span>Save</span>
                </button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 active:scale-95">
                <Edit2 size={18} /><span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="glass-card p-6 bg-emerald-50 border-emerald-100">
            <div className="flex items-center space-x-3 text-emerald-600 mb-2">
              <Shield size={20} />
              <h4 className="font-bold text-sm">Account Verified</h4>
            </div>
            <p className="text-emerald-700 text-xs leading-relaxed">
              Your identity and utility provider connection have been verified via Firebase Auth.
            </p>
          </div>
        </div>

        {/* Right Column: Preferences & Settings */}
        <div className="col-span-8 space-y-8">
          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">System Preferences</h3>
            <div className="glass-card overflow-hidden">
              <PreferenceToggle 
                icon={Moon} 
                label="Dark Mode" 
                description="Toggle the application aesthetic between light and dark themes."
                enabled={theme === 'dark'}
                onToggle={() => { toggleTheme(); toast.success(`Dark Mode ${theme === 'dark' ? 'Disabled' : 'Enabled'}`); }}
              />
              <PreferenceToggle 
                icon={Bell} 
                label="Push Notifications" 
                description="Receive alerts for high usage and billing updates."
                enabled={true}
              />
            </div>
          </div>

          {/* Billing & Provider Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Utility & Billing</h3>
            <div className="glass-card p-8 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Electricity Provider</label>
                  <select className="w-full bg-slate-50 border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 transition-all font-semibold appearance-none">
                    <option>Tata Power</option>
                    <option>Adani Electricity</option>
                    <option>BESCOM</option>
                    <option>BSES Rajdhani</option>
                    <option>TANGEDCO</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tariff Slab Selection</label>
                  <select className="w-full bg-slate-50 border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 transition-all font-semibold appearance-none">
                    <option>Residential (Up to 100 units)</option>
                    <option>Residential (101 - 300 units)</option>
                    <option>Residential (Above 300 units)</option>
                    <option>Commercial</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Visa ending in 4242</p>
                    <p className="text-xs text-slate-400 font-medium">Expires 12/2028 • Default Payment Method</p>
                  </div>
                </div>
                <button onClick={() => toast.error('Payment gateway not configured in simulation mode')} className="text-primary font-bold text-sm hover:underline">Update Payment</button>
              </div>
            </div>
          </div>

          <button onClick={handleSignOutAll} className="w-full flex items-center justify-center space-x-2 text-rose-500 font-bold py-4 glass-card border-rose-100 hover:bg-rose-50 transition-colors active:scale-95 cursor-pointer">
            <LogOut size={20} />
            <span>Sign Out everywhere</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileInfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center space-x-4 text-left p-2 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="text-slate-400 bg-slate-100 p-2 rounded-lg">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function PreferenceToggle({ icon: Icon, label, description, enabled, onToggle }: { icon: any, label: string, description: string, enabled: boolean, onToggle?: (state: boolean) => void }) {
  const [internalToggle, setInternalToggle] = useState(enabled);
  const toggle = onToggle !== undefined ? enabled : internalToggle;

  return (
    <div className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0">
      <div className="flex items-center space-x-4">
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-xl text-slate-600 dark:text-slate-300">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        onClick={() => {
          if (onToggle) {
            onToggle(!toggle);
          } else {
            setInternalToggle(!toggle);
            toast.success(`${label} ${!toggle ? 'Enabled' : 'Disabled'}`);
          }
        }}
        className={cn(
        "w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
        toggle ? "bg-primary" : "bg-slate-200"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
          toggle ? "left-7" : "left-1"
        )} />
      </button>
    </div>
  );
}
