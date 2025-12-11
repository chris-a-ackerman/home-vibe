import { FeatureCardData } from '@/components/FeatureCard';

export const featureCards: FeatureCardData[] = [
  {
    icon: '🍽️',
    title: 'Restaurants',
    subtitle: 'How important are dining options nearby?',
    options: [
      { label: 'Not important', value: 'not-important' },
      { label: 'Nice to have', value: 'nice-to-have' },
      { label: 'Very important', value: 'very-important' },
      { label: 'Essential', value: 'essential' },
    ],
    defaultValue: 'nice-to-have',
  },
  {
    icon: '💧',
    title: 'Flood Risk',
    subtitle: 'Evaluate flood zones and water risk.',
    options: [
      { label: 'Not a concern', value: 'not-a-concern' },
      { label: 'Minimal risk only', value: 'minimal-risk-only' },
      { label: 'No flood zones', value: 'no-flood-zones' },
    ],
    defaultValue: 'minimal-risk-only',
  },
  {
    icon: '🌳',
    title: 'Parks',
    subtitle: 'Access to green spaces and nature.',
    options: [
      { label: 'Not important', value: 'not-important' },
      { label: 'Within 20 min', value: 'within-20-min' },
      { label: 'Within 10 min', value: 'within-10-min' },
      { label: 'Within 5 min', value: 'within-5-min' },
    ],
    defaultValue: 'within-10-min',
  },
  {
    icon: '🎓',
    title: 'Schools',
    subtitle: 'Quality of schools in the area.',
    options: [
      { label: 'Not applicable', value: 'not-applicable' },
      { label: 'Average OK', value: 'average-ok' },
      { label: 'Above average', value: 'above-average' },
      { label: 'Top-rated', value: 'top-rated' },
    ],
    defaultValue: 'average-ok',
  },
  {
    icon: '🛡️',
    title: 'Crime',
    subtitle: 'Safety and crime rate expectations.',
    options: [
      { label: 'Not a concern', value: 'not-a-concern' },
      { label: 'Average OK', value: 'average-ok' },
      { label: 'Below average', value: 'below-average' },
      { label: 'Very low only', value: 'very-low-only' },
    ],
    defaultValue: 'average-ok',
  },
  {
    icon: '🚶',
    title: 'Walkability',
    subtitle: 'Ability to walk to daily amenities.',
    options: [
      { label: 'Car-dependent OK', value: 'car-dependent-ok' },
      { label: 'Some walkability', value: 'some-walkability' },
      { label: 'Very walkable', value: 'very-walkable' },
      { label: 'Car-free lifestyle', value: 'car-free-lifestyle' },
    ],
    defaultValue: 'some-walkability',
  },
  {
    icon: '🔇',
    title: 'Noise',
    subtitle: 'Preference for quiet neighborhoods.',
    options: [
      { label: 'Not a concern', value: 'not-a-concern' },
      { label: 'Moderate quiet', value: 'moderate-quiet' },
      { label: 'Very quiet', value: 'very-quiet' },
    ],
    defaultValue: 'moderate-quiet',
  },
];
