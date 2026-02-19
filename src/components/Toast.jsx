import { useData } from '../contexts/DataContext';

export default function Toast() {
  const { toastMessage } = useData();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-6 inset-x-0 z-[100] flex justify-center pointer-events-none animate-slide-down">
      <div className="glass-dark text-white px-6 py-3 rounded-2xl text-sm font-medium pointer-events-auto" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        {toastMessage}
      </div>
      <style>{`
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-16px) scale(0.95); }
          15% { opacity: 1; transform: translateY(0) scale(1); }
          85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-10px) scale(0.95); }
        }
        .animate-slide-down { animation: slide-down 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
