import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Zap, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Lightbulb, ShieldAlert, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { getToken } = useAuth();
  const [data, setData] = useState<any>({
    latestUnits: 0,
    predictedUnits: 0,
    growth: '0',
    history: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      fetch('http://localhost:5000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setData(result.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Dashboard fetch error:', err);
          setLoading(false);
        });
    };
    fetchData();
  }, [getToken]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-primary animate-in fade-in">
        <Loader2 size={48} className="animate-spin" />
        <p className="font-bold text-slate-500">Loading your energy data...</p>
      </div>
    );
  }

  const isGrowthPositive = parseFloat(data.growth) > 0;

  const handleExportCSV = () => {
    if (!data.history.length) return toast.error('No data to export');
    
    const headers = ['Month', 'Units (kWh)', 'Growth (%)', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.history.slice().reverse().map((b: any) => `${b.month},${b.units},${b.cost},${b.status}`)
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'unittrack_energy_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Data exported successfully!');
  };

  const handlePrint = () => {
    toast.success('Preparing report...');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:space-y-4 print:text-black">
      {/* Page Header */}
      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor your real-time electricity consumption and history.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportCSV} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors active:scale-95">
            Export Data
          </button>
          <button onClick={handlePrint} className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors active:scale-95">
            Generate Report
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard 
          title="Units This Month" 
          value={data.latestUnits} 
          unit="kWh" 
          change={`${data.growth}%`} 
          isPositive={!isGrowthPositive} 
          icon={Zap} 
          color="text-primary dark:text-primary"
          bg="bg-primary/10 dark:bg-primary/20"
        />
        <StatCard 
          title="Predicted Next Bill" 
          value={data.predictedUnits} 
          unit="kWh"
          change="+5%" 
          isPositive={false} 
          icon={Calendar} 
          color="text-amber-500 dark:text-amber-400"
          bg="bg-amber-50 dark:bg-amber-500/10"
        />
        <StatCard 
          title="Usage Change" 
          value={`${data.growth}%`} 
          change="vs last month" 
          isPositive={!isGrowthPositive} 
          icon={isGrowthPositive ? TrendingUp : TrendingDown} 
          color={isGrowthPositive ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400"}
          bg={isGrowthPositive ? "bg-rose-50 dark:bg-rose-500/10" : "bg-emerald-50 dark:bg-emerald-500/10"}
        />
        <StatCard 
          title="Current Status" 
          value={isGrowthPositive ? "High Alert" : "Optimal"} 
          change=""
          isPositive={!isGrowthPositive} 
          icon={isGrowthPositive ? ShieldAlert : Lightbulb} 
          color={isGrowthPositive ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400"}
          bg={isGrowthPositive ? "bg-rose-50 dark:bg-rose-500/10" : "bg-emerald-50 dark:bg-emerald-500/10"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column: Trend Chart */}
        <div className="col-span-8 space-y-6">
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Usage Trend</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Consumption analysis over time</p>
              </div>
              <div className="flex bg-slate-50 dark:bg-slate-700/50 p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-bold text-primary bg-white dark:bg-slate-800 rounded shadow-sm">Units (kWh)</button>
              </div>
            </div>
            <div className="h-80 w-full">
              {data.history.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.history}>
                    <defs>
                      <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontSize: '12px',
                        fontWeight: '600'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="units" 
                      stroke="#2563EB" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorUnits)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">Not enough data to display chart</div>
              )}
            </div>
          </div>

          {/* Recent Bills Table */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-700/50">
              <h3 className="font-bold text-slate-900 dark:text-white">Recent History</h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                <tr>
                  <th className="table-header">Month</th>
                  <th className="table-header">Units (kWh)</th>
                  <th className="table-header">Growth (%)</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.history.slice().reverse().map((bill: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="table-cell font-bold text-slate-900 dark:text-white">{bill.month}</td>
                    <td className="table-cell">{bill.units}</td>
                    <td className="table-cell font-semibold text-slate-900 dark:text-white">{bill.cost}%</td>
                    <td className="table-cell">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                        bill.status === 'Current' ? "bg-primary/10 text-primary" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.history.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">No records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Alerts & Insights */}
        <div className="col-span-4 space-y-6">
          <AlertCard 
            title="Consistent Monitoring" 
            description="Tracking your usage helps identify optimization patterns efficiently."
            icon={ShieldAlert}
            color="text-primary dark:text-primary"
            bg="bg-primary/10 dark:bg-primary/20"
            border="border-primary/20 dark:border-primary/30"
          />
          <AlertCard 
            title="Usage Tier Check" 
            description="Regular checks prevent unexpected tier jumps."
            icon={AlertCircle}
            color="text-amber-500 dark:text-amber-400"
            bg="bg-amber-50 dark:bg-amber-500/10"
            border="border-amber-100 dark:border-amber-500/20"
          />
          <AlertCard 
            title="AI Optimization Ready" 
            description="The AI engine is monitoring your entries to generate personalized insights."
            icon={Lightbulb}
            color="text-emerald-500 dark:text-emerald-400"
            bg="bg-emerald-50 dark:bg-emerald-500/10"
            border="border-emerald-100 dark:border-emerald-500/20"
          />

          <div className="glass-card p-6 bg-gradient-to-br from-primary to-secondary text-white border-none shadow-xl shadow-primary/20">
            <h4 className="font-bold text-lg">Smart Prediction</h4>
            <p className="text-white/80 text-sm mt-2">Based on your trend, your next month expected usage.</p>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Est. Next</p>
                <p className="text-3xl font-bold">{data.predictedUnits} kWh</p>
              </div>
              <button onClick={() => toast('The AI calculates your history trend using moving averages.', { icon: '🤖' })} className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, change, isPositive, icon: Icon, color, bg }: any) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start">
        <div className={`${bg} ${color} p-2.5 rounded-xl`}>
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center text-[10px] font-bold px-2 py-1 rounded-lg",
          isPositive ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"
        )}>
          {isPositive ? <ArrowDownRight size={12} className="mr-0.5" /> : <ArrowUpRight size={12} className="mr-0.5" />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
          {value} {unit && <span className="text-sm font-normal text-slate-400">{unit}</span>}
        </h2>
      </div>
    </div>
  );
}

function AlertCard({ title, description, icon: Icon, color, bg, border }: any) {
  return (
    <div className={cn("p-5 rounded-xl border flex items-start space-x-4", bg, border)}>
      <div className={cn("p-2 rounded-lg", color, "bg-white/50 dark:bg-black/20 shadow-sm")}>
        <Icon size={20} />
      </div>
      <div>
        <h4 className={cn("font-bold text-sm", color.includes('text-amber') ? "text-amber-700 dark:text-amber-400" : color.includes('text-emerald') ? "text-emerald-700 dark:text-emerald-400" : "text-slate-900 dark:text-white")}>{title}</h4>
        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
