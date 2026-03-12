'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/lib/actions';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  BarChart3, 
  MapPin, 
  Calendar,
  Settings,
  BookOpen,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Leads', href: '/leads' },
  { icon: BarChart3, label: 'Inversiones', href: '/investments' },
  { icon: BarChart3, label: 'Redes Sociales', href: '/marketing-metrics' },
  { icon: Settings, label: 'Configuración', href: '/settings' },
  { icon: MapPin, label: 'Sedes', href: '/sedes' },
  { icon: BookOpen, label: 'Manual', href: '/manual' },
  { icon: Users, label: 'Vendedores', href: '/users', roles: ['Director'] },
  { icon: ExternalLink, label: 'Dir. Estratégica', href: 'https://direccion-idip.vercel.app/', external: true },
];

export function Sidebar({ isOpen, onClose, currentUser }: { isOpen?: boolean, onClose?: () => void, currentUser?: any }) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 flex flex-col h-screen bg-black/95 backdrop-blur-xl transition-transform duration-300 lg:sticky lg:translate-x-0 lg:bg-black/50",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 flex flex-col items-center gap-4 relative">
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden absolute right-4 top-4 text-zinc-500 hover:text-white"
          >
            <X size={20} />
          </button>
        )}
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://idip.com.mx/wp-content/uploads/2024/07/idip-w.png" 
            alt="IDIP Logo" 
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#afca0b]" />
          <h1 className="font-bold tracking-tight text-xs uppercase text-zinc-500">Marketing Pulse</h1>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(currentUser?.rol)) return null;
          
          const isActive = pathname === item.href;
          const isExternal = 'external' in item && item.external;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                isActive 
                  ? "bg-[#afca0b]/10 text-[#afca0b] font-medium" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <item.icon size={18} className={cn(isActive ? "text-[#afca0b]" : "text-zinc-400 group-hover:text-white")} />
              <span className="flex-1">{item.label}</span>
              {isExternal && <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-[#afca0b]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-4">
        {currentUser && (
          <div className="px-3 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <p className="text-[10px] font-bold text-[#afca0b] uppercase tracking-widest">{currentUser.rol}</p>
            <p className="text-sm font-bold text-white truncate">{currentUser.nombre}</p>
          </div>
        )}
        <button 
          onClick={() => logoutAction()}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white rounded-lg transition-colors text-rose-400/80 hover:text-rose-400"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
