import {
  Wrench,
  ShoppingBag,
  Baby,
  Dog,
  Flower2,
  Car,
  BookOpen,
  UtensilsCrossed,
  Package,
  Heart,
  HelpCircle,
  Users,
} from 'lucide-react';

export const EVENT_CATEGORIES = [
  { id: 'tools', label: 'Tool Sharing', icon: Wrench, emoji: '🔧', examples: ['Lent a ladder', 'Shared power drill', 'Loaned garden tools'] },
  { id: 'groceries', label: 'Groceries & Errands', icon: ShoppingBag, emoji: '🛒', examples: ['Picked up groceries', 'Collected a package', 'Ran an errand'] },
  { id: 'childcare', label: 'Childcare', icon: Baby, emoji: '👶', examples: ['Watched kids for an hour', 'Walked children to school', 'Hosted a playdate'] },
  { id: 'pets', label: 'Pet Care', icon: Dog, emoji: '🐕', examples: ['Walked a dog', 'Fed neighbor\'s cat', 'Pet-sat for weekend'] },
  { id: 'garden', label: 'Garden & Plants', icon: Flower2, emoji: '🌱', examples: ['Watered plants', 'Shared produce', 'Helped with yard work'] },
  { id: 'transport', label: 'Transport', icon: Car, emoji: '🚗', examples: ['Gave a ride', 'Helped move furniture', 'Shared parking spot'] },
  { id: 'knowledge', label: 'Knowledge & Skills', icon: BookOpen, emoji: '📚', examples: ['Tutored a student', 'Tech help', 'Language practice'] },
  { id: 'food', label: 'Food & Meals', icon: UtensilsCrossed, emoji: '🍲', examples: ['Shared a meal', 'Baked for neighbor', 'Brought soup when sick'] },
  { id: 'supplies', label: 'Supplies & Lending', icon: Package, emoji: '📦', examples: ['Lent camping gear', 'Shared cleaning supplies', 'Loaned books'] },
  { id: 'emotional', label: 'Emotional Support', icon: Heart, emoji: '💛', examples: ['Checked on neighbor', 'Listened & supported', 'Welcomed newcomer'] },
  { id: 'help', label: 'General Help', icon: HelpCircle, emoji: '🤝', examples: ['Helped carry bags', 'Shoveled snow', 'Fixed something'] },
  { id: 'community', label: 'Community Event', icon: Users, emoji: '🎉', examples: ['Organized block party', 'Started a group chat', 'Hosted meet-up'] },
];

export const MICRO_NEIGHBORHOODS = [
  { id: 'maple-grove', name: 'Maple Grove', color: '#0d9488' },
  { id: 'cedar-heights', name: 'Cedar Heights', color: '#e28320' },
  { id: 'riverside-commons', name: 'Riverside Commons', color: '#7c3aed' },
  { id: 'oak-park-west', name: 'Oak Park West', color: '#2563eb' },
  { id: 'sunflower-lane', name: 'Sunflower Lane', color: '#dc2626' },
];

export const EMERGENCY_CATEGORIES = [
  { id: 'shelter', label: 'Shelter', emoji: '🏠' },
  { id: 'food-water', label: 'Food & Water', emoji: '🥤' },
  { id: 'medical', label: 'Medical', emoji: '🏥' },
  { id: 'transport-evac', label: 'Transport', emoji: '🚗' },
  { id: 'power', label: 'Power & Utilities', emoji: '🔌' },
  { id: 'childcare-elder', label: 'Child/Elder Care', emoji: '👨‍👩‍👧' },
  { id: 'supplies-emer', label: 'Supplies', emoji: '📦' },
  { id: 'communication', label: 'Communication', emoji: '📡' },
];
