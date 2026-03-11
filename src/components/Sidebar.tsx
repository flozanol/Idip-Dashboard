import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  BarChart3, 
  MapPin, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Users, label: 'Leads' },
  { icon: BarChart3, label: 'Rendimiento' },
  { icon: MapPin, label: 'Sedes' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col h-screen sticky top-0 bg-black/50 backdrop-blur-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-lg">I</div>
        <h1 className="font-bold tracking-tight text-xl">IDIP Pulse</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
              item.active 
                ? "bg-rose-500/10 text-rose-500 font-medium" 
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            )}
          >
            <item.icon size={18} className={cn(item.active ? "text-rose-500" : "text-zinc-400 group-hover:text-white")} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-lg transition-colors">
          <Settings size={18} />
          Configuración
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-lg transition-colors text-rose-400/80 hover:text-rose-400">
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
