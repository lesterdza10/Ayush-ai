// types/yoga.ts
export interface YogaExercise {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  benefits: string[];
  image: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha' | 'All';
}

export const yogaExercises: YogaExercise[] = [
  {
    id: '1',
    name: 'Tree Pose',
    sanskritName: 'Vrikshasana',
    description: 'A grounding standing balance that improves focus and stability.',
    benefits: ['Improves balance', 'Strengthens legs', 'Calms the mind'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500',
    dosha: 'Vata'
  },
  {
    id: '2',
    name: 'Camel Pose',
    sanskritName: 'Ustrasana',
    description: 'A deep backbend that opens the chest and improves digestion.',
    benefits: ['Opens chest', 'Strengthens back', 'Relieves anxiety'],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=500',
    dosha: 'Pitta'
  },
  {
    id: '3',
    name: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    description: 'A powerful pose that builds strength and confidence.',
    benefits: ['Builds stamina', 'Stretches hips', 'Improves circulation'],
    image: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=500',
    dosha: 'Kapha'
  }
];