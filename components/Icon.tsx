import React from 'react';
import { 
  Activity, 
  Wind, 
  Utensils, 
  Brain, 
  Dumbbell, 
  Microscope,
  Send,
  ArrowLeft,
  Settings,
  X,
  Bot,
  User,
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

const icons: Record<string, React.ElementType> = {
  Activity, 
  Wind, 
  Utensils, 
  Brain, 
  Dumbbell, 
  Microscope,
  Send,
  ArrowLeft,
  Settings,
  X,
  Bot,
  User,
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  HelpCircle,
  ChevronRight
};

export const Icon: React.FC<IconProps> = ({ name, className, size = 24 }) => {
  const LucideIcon = icons[name] || Microscope;
  return <LucideIcon className={className} size={size} />;
};