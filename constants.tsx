import { Topic, TopicId } from './types';
import { 
  Activity, 
  Wind, 
  Utensils, 
  Brain, 
  Dumbbell, 
  Microscope 
} from 'lucide-react';

export const TOPICS: Topic[] = [
  {
    id: TopicId.RESPIRATORY,
    title: "Système Respiratoire",
    description: "Comprendre comment l'oxygène entre et comment le CO2 sort.",
    icon: "Wind",
    color: "bg-sky-100 text-sky-600 border-sky-200 hover:border-sky-400"
  },
  {
    id: TopicId.CIRCULATORY,
    title: "Système Circulatoire",
    description: "Le cœur, le sang et le transport des nutriments.",
    icon: "Activity",
    color: "bg-rose-100 text-rose-600 border-rose-200 hover:border-rose-400"
  },
  {
    id: TopicId.DIGESTIVE,
    title: "Système Digestif",
    description: "De la nourriture à l'énergie : le voyage des aliments.",
    icon: "Utensils",
    color: "bg-amber-100 text-amber-600 border-amber-200 hover:border-amber-400"
  },
  {
    id: TopicId.NERVOUS,
    title: "Système Nerveux",
    description: "Le cerveau et les commandes électriques du corps.",
    icon: "Brain",
    color: "bg-violet-100 text-violet-600 border-violet-200 hover:border-violet-400"
  },
  {
    id: TopicId.MUSCULAR,
    title: "Système Musculaire",
    description: "Mouvement, force et interaction avec le squelette.",
    icon: "Dumbbell",
    color: "bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-400"
  },
  {
    id: TopicId.GENERAL,
    title: "Physiologie Générale",
    description: "Introduction globale ou questions variées.",
    icon: "Microscope",
    color: "bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-400"
  }
];

export const SYSTEM_INSTRUCTION = `
Tu es un tuteur éducatif spécialisé en biologie humaine, plus précisément en physiologie humaine, pour un niveau lycée.

Ton objectif principal est d’aider l’élève à comprendre les mécanismes du corps humain de manière claire, progressive et pédagogique.

Règles de comportement :
- Adapte toujours ton langage à un niveau lycée.
- Explique les notions étape par étape.
- Utilise des exemples concrets (sport, respiration, etc.).
- Pose des questions simples pour vérifier la compréhension.
- Sois encourageant et bienveillant.

Pédagogie :
- Décompose chaque thème.
- Explique le rôle, le fonctionnement, puis les interactions.
- Utilise des analogies simples.
- Résume les points clés à la fin.

Interaction :
- Ne donne pas tout d’un coup (réponses concises mais complètes).
- Attends la réponse de l’élève.
- Propose des mini-exercices ou QCM courts.

Contraintes :
- Sujet strict : biologie/physiologie humaine.
- Pas de diagnostic médical.
`;