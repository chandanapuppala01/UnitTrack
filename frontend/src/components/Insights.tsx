import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Leaf, ArrowRight, Zap, Sparkles, TrendingDown, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const iconMap: Record<string, any> = {
  Lightbulb, TrendingUp, AlertTriangle, Leaf, Zap, Sparkles
};

export default function Insights() {
  const { getToken } = useAuth();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'savings' | 'alerts'>('all');

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      fetch('http://localhost:5000/api/insights', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setInsights(result.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Insights fetch error:', err);
          setLoading(false);
        });
    };
    fetchData();
  }, [getToken]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-primary animate-in fade-in">
        <Loader2 size={48} className="animate-spin" />
        <p className="font-bold text-slate-500">Generating AI Insights...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Smart Insights</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">AI-powered recommendations to optimize your energy consumption.</p>
        </div>
        <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 transition-colors">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'all' ? 'text-primary bg-primary/5 dark:bg-primary/20' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            All Insights
          </button>
          <button 
            onClick={() => setFilter('savings')} 
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'savings' ? 'text-primary bg-primary/5 dark:bg-primary/20' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Savings
          </button>
          <button 
            onClick={() => setFilter('alerts')} 
            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'alerts' ? 'text-primary bg-primary/5 dark:bg-primary/20' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            Alerts
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6">
        {(() => {
          const filteredInsights = insights.filter(insight => {
            if (filter === 'all') return true;
            const isAlert = ['rose', 'orange', 'amber'].includes(insight.type);
            if (filter === 'alerts') return isAlert;
            if (filter === 'savings') return !isAlert;
            return true;
          });

          if (filteredInsights.length === 0) {
            return (
              <div className="col-span-2 py-12 text-center text-slate-400 font-bold glass-card">
                No {filter === 'all' ? 'Insights' : filter} found in your analysis.
              </div>
            );
          }

          return filteredInsights.map((insight, index) => {
            const Icon = insight.icon ? insight.icon : (iconMap[insight.title?.split(' ')[0]] || Lightbulb);
            
            return (
            <motion.div 
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6 flex items-start space-x-6 group cursor-pointer hover:border-primary/20 hover:shadow-md transition-all"
            >
              <div className={`bg-${insight.type}-50 text-${insight.type}-500 p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                <Icon size={28} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-widest text-${insight.type}-500 dark:text-${insight.type}-400`}>
                    {insight.tag}
                  </span>
                  <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
                    <TrendingDown size={12} className={`text-${insight.type}-500 dark:text-${insight.type}-400`} />
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{insight.savings}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{insight.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {insight.description}
                </p>
                <div className="pt-4 flex items-center text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Details</span>
                  <ArrowRight size={14} className="ml-1" />
                </div>
              </div>
            </motion.div>
            );
          });
        })()}
      </div>

      {/* Featured Insight */}
      <div className="glass-card p-8 bg-slate-900 text-white border-none shadow-xl shadow-slate-200 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Monthly AI Challenge</span>
          </div>
          <h2 className="text-3xl font-bold">Reduce peak-hour usage by 15%</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Join 1,240 other users in your area to reduce energy consumption during peak hours (4 PM - 9 PM) and earn rewards on your next billing cycle.
          </p>
          <button onClick={() => toast.success('Joined Challenge successfully!', { icon: '🎉' })} className="bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-all active:scale-95">
            Join Challenge
          </button>
        </div>
        <div className="relative z-10 w-48 h-48 bg-white/5 rounded-full flex items-center justify-center">
          <Zap size={80} className="text-white/20" />
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
