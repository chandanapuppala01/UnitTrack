export interface Bill {
  id: string;
  units: number;
  amount: number;
  month: string;
  date: string;
}

export interface Appliance {
  name: string;
  hours: number;
  wattage: number;
}

export type Screen = 'landing' | 'login' | 'signup' | 'dashboard' | 'add-bill' | 'calculator' | 'insights' | 'reports' | 'profile' | 'settings';
