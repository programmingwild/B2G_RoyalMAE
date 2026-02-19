import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, AlertTriangle, Users, Rss } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/log', icon: PlusCircle, label: 'Log' },
  { to: '/feed', icon: Rss, label: 'Feed' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/emergency', icon: AlertTriangle, label: 'Alert' },
];

export default function NavBar() {
  const { emergencyMode, currentUser } = useData();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 safe-bottom" style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', borderTop: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 -4px 30px rgba(0,0,0,0.05)' }}>
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          const isEmergency = to === '/emergency';
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300
                ${active ? 'text-primary-700 bg-primary-50/70 shadow-sm scale-105' : 'text-stone-400 hover:text-stone-600 hover:bg-white/40'}
                ${isEmergency && emergencyMode.active ? '!text-rose-500' : ''}
              `}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.8}
                className={`transition-transform duration-300 ${active ? 'scale-110' : ''} ${isEmergency && emergencyMode.active ? 'animate-pulse' : ''}`}
              />
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </NavLink>
          );
        })}

        {/* Profile avatar */}
        <NavLink
          to="/profile"
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300
            ${location.pathname === '/profile' ? 'text-primary-700 bg-primary-50/70 shadow-sm scale-105' : 'text-stone-400 hover:text-stone-600 hover:bg-white/40'}
          `}
        >
          <div
            className="w-[22px] h-[22px] rounded-lg flex items-center justify-center text-[11px] transition-transform duration-300"
            style={{ backgroundColor: currentUser?.avatar?.color + '30', boxShadow: location.pathname === '/profile' ? `0 0 8px ${currentUser?.avatar?.color}40` : 'none' }}
          >
            {currentUser?.avatar?.emoji || '👤'}
          </div>
          <span className="text-[10px] font-semibold tracking-wide">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
