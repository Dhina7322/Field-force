import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  ClipboardList,
  Clock,
  CalendarDays,
  Tractor,
  Building2,
  Map,
  DollarSign,
  Landmark,
  Settings,
  Shield,
  Droplets,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from 'lucide-react';

const navSections = [
  {
    section: null,
    items: [
      { label: 'Dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" />, path: '/' },
    ],
  },
  {
    section: 'WORKFORCE',
    items: [
      { label: 'Employees', icon: <Users className="w-[18px] h-[18px]" />, path: '/employees' },
      { label: 'Groups', icon: <UsersRound className="w-[18px] h-[18px]" />, path: '/groups' },
      { label: 'Teams', icon: <UsersRound className="w-[18px] h-[18px]" />, path: '/teams' },
    ],
  },
  {
    section: 'WORK MANAGEMENT',
    items: [
      { label: 'Work Assignments', icon: <ClipboardList className="w-[18px] h-[18px]" />, path: '/work-assignments' },
    ],
  },
  {
    section: 'LOGISTICS',
    items: [
      { label: 'Petrol', icon: <Droplets className="w-[18px] h-[18px]" />, path: '/petrol' },
    ],
  },
  {
    section: 'ATTENDANCE',
    items: [
      { label: 'Time Tracking', icon: <Clock className="w-[18px] h-[18px]" />, path: '/attendance' },
      { label: 'Work Calendar', icon: <CalendarDays className="w-[18px] h-[18px]" />, path: '/time-tracking' },
    ],
  },
  {
    section: 'MACHINES',
    items: [
      { label: 'Machines', icon: <Tractor className="w-[18px] h-[18px]" />, path: '/machines' },
    ],
  },
  {
    section: 'CLIENTS',
    items: [
      { label: 'Customers', icon: <Building2 className="w-[18px] h-[18px]" />, path: '/clients' },
      { label: 'Areas', icon: <Map className="w-[18px] h-[18px]" />, path: '/work-areas' },
    ],
  },
  {
    section: 'FINANCE',
    items: [
      { label: 'Salary', icon: <DollarSign className="w-[18px] h-[18px]" />, path: '/salary-calculation' },
      { label: 'Advance Register', icon: <Banknote className="w-[18px] h-[18px]" />, path: '/advance-register' },
      { label: 'Ledger', icon: <Landmark className="w-[18px] h-[18px]" />, path: '/ledger' },
    ],
  },
  {
    section: 'SETTINGS',
    items: [
      { label: 'Company', icon: <Settings className="w-[18px] h-[18px]" />, path: '/company' },
      { label: 'Roles', icon: <Shield className="w-[18px] h-[18px]" />, path: '/roles' },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className={`relative h-screen bg-[#0F172A] text-gray-100 flex flex-col transition-all duration-300 ease-in-out flex-shrink-0 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-white/5 flex-shrink-0 ${collapsed ? 'px-4 justify-center' : 'px-5'}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-[15px] font-bold text-white whitespace-nowrap tracking-tight">FieldForce</div>
              <div className="text-[10px] text-slate-500 whitespace-nowrap uppercase tracking-widest">Workforce</div>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] z-50 w-6 h-6 bg-[#1E293B] border border-slate-600/60 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-150 group"
      >
        {collapsed
          ? <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-white" />
          : <ChevronLeft className="w-3 h-3 text-slate-400 group-hover:text-white" />
        }
      </button>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 overflow-x-hidden">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className={sIdx > 0 ? 'mt-4' : ''}>
            {/* Section Label */}
            {section.section && !collapsed && (
              <div className="px-5 pb-1.5 pt-1">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  {section.section}
                </span>
              </div>
            )}
            {section.section && collapsed && (
              <div className="px-4 pb-2">
                <div className="h-px bg-white/5" />
              </div>
            )}

            {/* Items */}
            <div className="space-y-0.5 px-2">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={`relative w-full flex items-center gap-3 rounded-lg transition-all duration-150 group
                      ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'}
                      ${active
                        ? 'bg-indigo-600/15 text-indigo-400'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }
                    `}
                  >
                    {/* Left accent border */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-r-full" />
                    )}
                    <span className={`flex-shrink-0 transition-colors ${active ? 'text-indigo-400' : ''}`}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-[13px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom user area */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-indigo-400">A</span>
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-200">Admin</div>
              <div className="text-[10px] text-slate-500">Manager</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
