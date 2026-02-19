import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { MICRO_NEIGHBORHOODS } from '../data/categories';
import { ArrowRight, Users, Eye, Shield, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: Users,
    title: 'Stronger Together',
    body: 'This platform helps your neighborhood see and celebrate the everyday acts of mutual support that hold communities together.',
  },
  {
    icon: Eye,
    title: 'See Your Reciprocity',
    body: 'Log small acts — lending tools, sharing meals, checking on a neighbor. The platform turns these into a Reciprocity Density Score that reflects your community\'s strength.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    body: 'No names are publicly displayed. No personal histories stored. Only that a reciprocity event occurred in your micro-neighborhood — nothing more.',
  },
];

export default function Onboarding() {
  const { setNeighborhood, completeOnboarding } = useData();
  const [step, setStep] = useState(0);
  const [selectedHood, setSelectedHood] = useState(null);

  if (step < STEPS.length) {
    const { icon: Icon, title, body } = STEPS[step];
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 animate-fade-in" style={{ background: 'linear-gradient(to bottom, rgba(240,253,250,0.7), rgba(255,255,255,0.5))' }}>
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 glow-ring animate-bounce-in" style={{ background: 'rgba(204,251,241,0.6)', backdropFilter: 'blur(12px)' }}>
            <Icon size={32} className="text-primary-600 drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-bold text-gradient mb-3">{title}</h1>
          <p className="text-stone-500 leading-relaxed mb-10">{body}</p>

          <div className="flex gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === step ? 'bg-primary-500 w-6' : 'bg-stone-200'} transition-all`} />
            ))}
          </div>

          <button onClick={() => setStep(step + 1)} className="btn-primary flex items-center gap-2 text-base">
            {step === STEPS.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Neighborhood selection
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 animate-fade-in" style={{ background: 'linear-gradient(to bottom, rgba(240,253,250,0.7), rgba(255,255,255,0.5))' }}>
      <div className="flex flex-col items-center text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 glow-ring animate-bounce-in" style={{ background: 'rgba(255,237,213,0.6)', backdropFilter: 'blur(12px)' }}>
          <Sparkles size={32} className="text-warm-500 drop-shadow-sm" />
        </div>
        <h1 className="text-2xl font-bold text-gradient mb-2">Choose Your Neighborhood</h1>
        <p className="text-stone-500 mb-8">Select the micro-neighborhood you belong to. This keeps your data local and anonymous.</p>

        <div className="w-full space-y-3 mb-8">
          {MICRO_NEIGHBORHOODS.map((hood) => (
            <button
              key={hood.id}
              onClick={() => setSelectedHood(hood.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02]
                ${selectedHood === hood.id ? 'border-primary-500 shadow-neon-teal' : 'border-white/40 hover:border-stone-200 hover:shadow-glass'}
              `}
              style={{ backdropFilter: 'blur(12px)', background: selectedHood === hood.id ? 'rgba(240,253,250,0.7)' : 'rgba(255,255,255,0.5)' }}
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: hood.color }} />
              <span className="font-medium text-stone-700">{hood.name}</span>
              {selectedHood === hood.id && (
                <span className="ml-auto text-primary-600 text-sm font-medium">Selected</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (selectedHood) {
              setNeighborhood(selectedHood);
              completeOnboarding();
            }
          }}
          disabled={!selectedHood}
          className={`btn-primary w-full text-base ${!selectedHood ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Join My Neighborhood
        </button>
      </div>
    </div>
  );
}
