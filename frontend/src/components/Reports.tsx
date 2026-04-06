import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';
import { Download, FileText, Share2, Filter, Calendar, ChevronDown, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';
import toast from 'react-hot-toast';
import { cn } from '@/src/lib/utils';
import { useAuth } from '../contexts/AuthContext';



export default function Reports() {
  const { getToken } = useAuth();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    avg: 0,
    max_month: '--',
    max_val: 0,
    min_month: '--',
    min_val: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const response = await fetch('http://localhost:5000/api/bills', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          const bills = result.data;
          
          const last6 = bills.slice(-6);
          setMonthlyData(last6.map((b: any) => ({
            name: b.billing_month.split(' ')[0].substring(0, 3),
            current: b.units,
            previous: Math.max(0, Math.round(b.units * 0.9)) // simulated 10% less last year
          })));

          const currentYearUnits = bills.reduce((acc: number, b: any) => acc + b.units, 0);
          setYearlyData([
            { name: '2022', units: 2100 },
            { name: '2023', units: 1950 },
            { name: '2024', units: 2300 },
            { name: '2025', units: 2150 },
            { name: '2026', units: currentYearUnits > 0 ? currentYearUnits : 1200 },
          ]);

          const avg = (currentYearUnits / bills.length).toFixed(0);
          let maxBill = bills[0];
          let minBill = bills[0];
          bills.forEach((b: any) => {
            if (b.units > maxBill.units) maxBill = b;
            if (b.units < minBill.units) minBill = b;
          });

          setStats({
            avg: parseInt(avg),
            max_month: maxBill.billing_month,
            max_val: maxBill.units,
            min_month: minBill.billing_month,
            min_val: minBill.units
          });
        }
      } catch (err) {
        console.error('Failed to load reports', err);
      }
    };
    loadData();
  }, [getToken]);
  const handleExportCSV = () => {
    const headers = ['Month', 'Current Year (kWh)', 'Previous Year (kWh)'];
    const csvContent = [
      headers.join(','),
      ...monthlyData.map(d => `${d.name},${d.current},${d.previous}`)
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'unittrack_reports_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report data exported successfully!', { icon: '📊' });
  };

  const handlePrint = () => {
    toast.success('Preparing PDF report...');
    setTimeout(() => window.print(), 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 print:space-y-4 print:text-black">
      <header className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Generate and export detailed energy consumption reports.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={handleExportCSV} className="bg-white border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-slate-50 transition-colors active:scale-95">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button onClick={handlePrint} className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-sm shadow-lg shadow-primary/20 flex items-center space-x-2 hover:bg-primary/90 transition-colors active:scale-95">
            <FileText size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="glass-card p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-slate-400">
            <Filter size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Filters:</span>
          </div>
          <FilterDropdown label="Time Range" value="Last 6 Months" />
          <FilterDropdown label="Metric" value="Consumption (kWh)" />
          <FilterDropdown label="Compare" value="Previous Year" />
        </div>
        <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
          <Calendar size={14} />
          <span>Last updated: 2 hours ago</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Monthly Usage Comparison */}
        <div className="col-span-8 glass-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Monthly Comparison</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Current year vs previous year consumption</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-xs font-bold text-slate-600">2026</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">2025</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
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
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }} 
                />
                <Bar dataKey="current" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="previous" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Trend */}
        <div className="col-span-4 glass-card p-8">
          <div className="mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white">Yearly Trend</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Total annual consumption history</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: '600'
                  }} 
                />
                <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                  {yearlyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === yearlyData.length - 1 ? '#2563EB' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Report Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <ReportSummaryCard 
          title="Average Monthly Usage" 
          value={`${stats.avg} kWh`} 
          change="" 
          isPositive={false} 
          icon={BarChart3} 
        />
        <ReportSummaryCard 
          title="Highest Usage Month" 
          value={stats.max_month} 
          change={`${stats.max_val} kWh`} 
          isPositive={false} 
          icon={TrendingUp} 
        />
        <ReportSummaryCard 
          title="Lowest Usage Month" 
          value={stats.min_month} 
          change={`${stats.min_val} kWh`} 
          isPositive={true} 
          icon={TrendingDown} 
        />
      </div>
    </div>
  );
}

function FilterDropdown({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      <button className="flex items-center space-x-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
        <span>{value}</span>
        <ChevronDown size={14} />
      </button>
    </div>
  );
}

function ReportSummaryCard({ title, value, change, isPositive, icon: Icon }: any) {
  return (
    <div className="glass-card p-6 flex items-center space-x-6">
      <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-slate-600 dark:text-slate-300">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline space-x-3 mt-1">
          <h4 className="text-xl font-bold text-slate-900 dark:text-white">{value}</h4>
          <span className={cn(
            "text-xs font-bold",
            isPositive ? "text-emerald-500" : "text-rose-500"
          )}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}
