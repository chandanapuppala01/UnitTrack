import React from 'react';
import { Zap, ArrowRight, CheckCircle2, LayoutDashboard, BarChart3, Calculator, Lightbulb, ShieldAlert, TrendingUp, Github } from 'lucide-react';
import { Screen } from '@/src/types';

interface LandingPageProps {
  onNavigate: (screen: Screen) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-slate-900">UnitTrack</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors">How It Works</a>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('login')}
              className="text-sm font-bold text-slate-600 hover:text-primary transition-colors px-4 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="btn-primary text-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-8 max-w-7xl mx-auto text-center space-y-10">
        <div className="space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold font-display text-slate-900 leading-tight">
            Track, Predict, and Reduce Your Electricity Bills <span className="text-primary">Smartly</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            AI-powered electricity analytics without smart hardware. Upload your bills and start saving today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button onClick={() => onNavigate('signup')} className="btn-primary px-10 py-4 text-lg w-full sm:w-auto">
            Start Tracking Free
          </button>
          <button onClick={() => onNavigate('dashboard')} className="btn-secondary px-10 py-4 text-lg w-full sm:w-auto flex items-center justify-center space-x-2">
            <span>View Demo Dashboard</span>
            <ArrowRight size={20} />
          </button>
        </div>


      </section>

      {/* Features Section */}
      <section id="features" className="landing-section space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-display text-slate-900">Powerful Features for Smart Savings</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to take control of your energy consumption.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={LayoutDashboard} 
            title="Bill Tracking Dashboard" 
            description="Visualize your consumption history and spending in one place."
          />
          <FeatureCard 
            icon={TrendingUp} 
            title="Next Month Bill Prediction" 
            description="AI models predict your upcoming bills based on current usage patterns."
          />
          <FeatureCard 
            icon={Calculator} 
            title="Appliance Usage Calculator" 
            description="Estimate how much each appliance contributes to your monthly bill."
          />
          <FeatureCard 
            icon={ShieldAlert} 
            title="Tariff Slab Alerts" 
            description="Get notified before you enter a higher tariff slab to avoid extra costs."
          />
          <FeatureCard 
            icon={Lightbulb} 
            title="Saving Recommendations" 
            description="Personalized tips to reduce your energy footprint and save money."
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Usage Insights Reports" 
            description="Detailed monthly and yearly reports to analyze long-term trends."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-slate-900 text-white py-24">
        <div className="landing-section space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold font-display">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Three simple steps to start optimizing your electricity usage.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              number="1" 
              title="Upload Bill" 
              description="Simply upload a photo or PDF of your electricity bill. Our OCR handles the rest."
            />
            <StepCard 
              number="2" 
              title="Analyze Usage" 
              description="Our AI analyzes your consumption patterns and compares it with regional averages."
            />
            <StepCard 
              number="3" 
              title="Get Savings" 
              description="Receive actionable insights and predictions to reduce your next bill."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="landing-section space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold font-display text-slate-900">Loved by Energy Savers</h2>
          <p className="text-slate-500">Join thousands of households reducing their bills with UnitTrack.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TestimonialCard 
            name="Sarah Johnson" 
            role="Homeowner" 
            text="UnitTrack helped me identify that my old refrigerator was the main culprit for my high energy usage. Saved so much power!"
          />
          <TestimonialCard 
            name="David Chen" 
            role="Apartment Renter" 
            text="The tier alerts are a lifesaver. I now know exactly when to cut back to stay in the lower bracket."
          />
          <TestimonialCard 
            name="Elena Rodriguez" 
            role="Eco-Conscious User" 
            text="I love the carbon footprint tracking. It's not just about the money; it's about the planet too."
          />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="landing-section text-center">
        <div className="bg-primary p-16 rounded-[3rem] text-white space-y-8 shadow-2xl shadow-primary/20">
          <h2 className="text-4xl font-bold font-display">Start saving electricity today</h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            Join UnitTrack and take the first step towards a smarter, more efficient home.
          </p>
          <button onClick={() => onNavigate('signup')} className="bg-white text-primary font-bold px-10 py-4 rounded-xl text-lg hover:bg-slate-50 transition-all active:scale-95">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              <span className="text-lg font-bold font-display tracking-tight text-slate-900">UnitTrack</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Empowering households to track, predict, and reduce electricity consumption through smart analytics.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
          © 2026 UnitTrack Analytics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: any) {
  return (
    <div className="feature-card">
      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: any) {
  return (
    <div className="step-card">
      <div className="step-number mb-6">{number}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ name, role, text }: any) {
  return (
    <div className="glass-card p-8 space-y-6">
      <div className="flex items-center space-x-1 text-amber-400">
        {[...Array(5)].map((_, i) => <Zap key={i} size={16} fill="currentColor" />)}
      </div>
      <p className="text-slate-600 italic leading-relaxed">"{text}"</p>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-slate-100 rounded-full" />
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
          <p className="text-slate-400 text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
