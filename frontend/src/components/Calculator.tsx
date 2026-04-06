import React, { useState, useMemo } from 'react';
import { Zap, DollarSign, Info, Cpu, Tv, Snowflake, Wind, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ApplianceConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  wattage: number;
  initialHours: number;
}

const APPLIANCES: ApplianceConfig[] = [
  { id: 'fan', name: 'Ceiling Fan', icon: Wind, wattage: 75, initialHours: 12 },
  { id: 'ac', name: 'Air Conditioner', icon: Cpu, wattage: 1500, initialHours: 4 },
  { id: 'tv', name: 'Television', icon: Tv, wattage: 100, initialHours: 6 },
  { id: 'refrigerator', name: 'Refrigerator', icon: Snowflake, wattage: 250, initialHours: 24 },
];

export default function Calculator() {
  const [hours, setHours] = useState<Record<string, number>>(
    APPLIANCES.reduce((acc, app) => ({ ...acc, [app.id]: app.initialHours }), {})
  );

  const results = useMemo(() => {
    let totalUnits = 0;
    APPLIANCES.forEach(app => {
      const dailyUnits = (app.wattage * hours[app.id]) / 1000;
      totalUnits += dailyUnits * 30;
    });

    const carbonFactor = 0.4;
    return {
      units: totalUnits.toFixed(1),
      cost: (totalUnits * carbonFactor).toFixed(1)
    };
  }, [hours]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Usage Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Estimate your monthly consumption by adjusting appliance usage hours.</p>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: Appliance Grid */}
        <div className="col-span-8 grid grid-cols-2 gap-6">
          {APPLIANCES.map((app) => {
            const Icon = app.icon;
            return (
              <div key={app.id} className="glass-card p-6 space-y-6 hover:border-primary/20 transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{app.name}</h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{app.wattage} Watts</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg">
                    {hours[app.id]} hrs/day
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>0 hrs</span>
                    <span>24 hrs</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="24" 
                    step="0.5"
                    value={hours[app.id]}
                    onChange={(e) => setHours(prev => ({ ...prev, [app.id]: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Est. Monthly Consumption</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {((app.wattage * hours[app.id] * 30) / 1000).toFixed(1)} kWh
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Summary */}
        <div className="col-span-4 space-y-6">
          <div className="glass-card p-8 bg-slate-900 text-white border-none shadow-xl shadow-slate-200 sticky top-24">
            <h3 className="font-bold text-lg mb-8">Monthly Summary</h3>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Estimated Units</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-white">{results.units}</span>
                  <span className="text-slate-400 font-medium">kWh</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Estimated Carbon Footprint</p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-accent">{results.cost}</span>
                  <span className="text-slate-400 font-medium">kg CO2</span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex items-center space-x-3 text-white/60">
                  <TrendingUp size={18} className="text-accent" />
                  <span className="text-xs font-medium">12% higher than your last bill</span>
                </div>
                <div className="flex items-center space-x-3 text-white/60">
                  <Sparkles size={18} className="text-amber-400" />
                  <span className="text-xs font-medium">Potential to save 15.2 kg/month</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all">
                <span>View Savings Plan</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl flex items-start space-x-4 border border-blue-100 dark:border-blue-900/50">
            <Info size={20} className="text-blue-500 mt-0.5" />
            <p className="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
              Calculations are based on a standard emissions factor of <b className="dark:text-blue-100">0.4 kg CO2 per unit</b>. Actual emissions may vary based on your local grid mix.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
