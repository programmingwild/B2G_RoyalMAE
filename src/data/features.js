/**
 * Feature definitions for the Community Hub — all the new innovative features.
 */
import {
  Repeat,
  BookOpen,
  Library,
  Heart,
  Clock,
  BarChart3,
  Calendar,
  ShieldCheck,
  Target,
  Sparkles,
  Leaf,
  MessageSquare,
} from 'lucide-react';

export const HUB_FEATURES = [
  {
    id: 'skills',
    label: 'Skill Exchange',
    description: 'Teach what you know, learn what you need',
    icon: Repeat,
    color: 'bg-violet-100',
    iconColor: 'text-violet-600',
    route: '/community/skills',
    emoji: '🎓',
  },
  {
    id: 'library',
    label: 'Resource Library',
    description: 'Borrow & lend items in your neighborhood',
    icon: Library,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    route: '/community/library',
    emoji: '📚',
  },
  {
    id: 'gratitude',
    label: 'Gratitude Wall',
    description: 'Anonymous thank-yous that inspire kindness',
    icon: MessageSquare,
    color: 'bg-pink-100',
    iconColor: 'text-pink-600',
    route: '/community/gratitude',
    emoji: '💛',
  },
  {
    id: 'timebank',
    label: 'Time Bank',
    description: '1 hour given = 1 hour earned',
    icon: Clock,
    color: 'bg-amber-100',
    iconColor: 'text-amber-600',
    route: '/community/timebank',
    emoji: '⏳',
  },
  {
    id: 'pulse',
    label: 'Community Pulse',
    description: 'How connected does your neighborhood feel?',
    icon: BarChart3,
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    route: '/community/pulse',
    emoji: '💓',
  },
  {
    id: 'events',
    label: 'Neighborhood Events',
    description: 'Micro-events that build real connections',
    icon: Calendar,
    color: 'bg-orange-100',
    iconColor: 'text-orange-600',
    route: '/community/events',
    emoji: '📅',
  },
  {
    id: 'safety',
    label: 'Safety Net',
    description: 'Check in on neighbors who may need support',
    icon: ShieldCheck,
    color: 'bg-teal-100',
    iconColor: 'text-teal-600',
    route: '/community/safety',
    emoji: '🛡️',
  },
  {
    id: 'garden',
    label: 'Community Garden',
    description: 'Coordinate shared growing spaces & harvests',
    icon: Leaf,
    color: 'bg-lime-100',
    iconColor: 'text-lime-600',
    route: '/community/garden',
    emoji: '🌱',
  },
];

export const SKILL_CATEGORIES = [
  { id: 'tech', label: 'Technology', emoji: '💻' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'language', label: 'Languages', emoji: '🗣️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'repair', label: 'Home Repair', emoji: '🔨' },
  { id: 'fitness', label: 'Fitness', emoji: '🏃' },
  { id: 'art', label: 'Art & Craft', emoji: '🎨' },
  { id: 'finance', label: 'Finance', emoji: '💰' },
  { id: 'gardening', label: 'Gardening', emoji: '🌻' },
  { id: 'academic', label: 'Academic', emoji: '📖' },
  { id: 'childcare-skill', label: 'Childcare', emoji: '👶' },
  { id: 'other-skill', label: 'Other', emoji: '✨' },
];

export const RESOURCE_CATEGORIES = [
  { id: 'tools-res', label: 'Tools', emoji: '🔧' },
  { id: 'kitchen', label: 'Kitchen', emoji: '🍴' },
  { id: 'outdoor', label: 'Outdoor', emoji: '⛺' },
  { id: 'electronics', label: 'Electronics', emoji: '🔌' },
  { id: 'books-res', label: 'Books', emoji: '📖' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'games', label: 'Games', emoji: '🎲' },
  { id: 'baby', label: 'Baby & Kids', emoji: '🧸' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'other-res', label: 'Other', emoji: '📦' },
];

export const EVENT_TYPES = [
  { id: 'block-party', label: 'Block Party', emoji: '🎉' },
  { id: 'tool-share', label: 'Tool Sharing Day', emoji: '🔧' },
  { id: 'potluck', label: 'Potluck', emoji: '🍲' },
  { id: 'cleanup', label: 'Cleanup Day', emoji: '🧹' },
  { id: 'skill-session', label: 'Skill Session', emoji: '🎓' },
  { id: 'walk', label: 'Neighborhood Walk', emoji: '🚶' },
  { id: 'game-night', label: 'Game Night', emoji: '🎲' },
  { id: 'garden-day', label: 'Garden Day', emoji: '🌱' },
  { id: 'movie', label: 'Movie Night', emoji: '🎬' },
  { id: 'welcome', label: 'Welcome Event', emoji: '👋' },
  { id: 'meet-greet', label: 'Meet & Greet', emoji: '☕' },
  { id: 'other-event', label: 'Other', emoji: '📌' },
];

export const GARDEN_PLOT_TYPES = [
  { id: 'vegetable', label: 'Vegetables', emoji: '🥕' },
  { id: 'herbs', label: 'Herbs', emoji: '🌿' },
  { id: 'flowers', label: 'Flowers', emoji: '🌸' },
  { id: 'fruit', label: 'Fruit', emoji: '🍎' },
  { id: 'compost', label: 'Compost', emoji: '♻️' },
  { id: 'seeds', label: 'Seeds to Share', emoji: '🌰' },
];

export const PULSE_QUESTIONS = [
  { id: 'connected', question: 'How connected do you feel to your neighbors this week?', emoji: '🤝' },
  { id: 'safe', question: 'How safe do you feel in your neighborhood?', emoji: '🛡️' },
  { id: 'belonging', question: 'How strong is your sense of belonging here?', emoji: '🏡' },
];

export const PULSE_LABELS = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
