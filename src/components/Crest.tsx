import { teamColor } from '../lib/league';

type Props = { name: string; size?: number };

const badges = ['Herons', 'Otters', 'Wrens', 'Foxes', 'Kestrels', 'Badgers', 'Salamanders', 'Comets', 'Thunder', 'Rapids', 'Pioneers', 'Storm'];

// Decorative team badge. The team name is always written out beside it, so it is hidden from assistive tech.
// Teams without a badge image get a generated shield in their colors.
export default function Crest({ name, size = 40 }: Props) {
  if (badges.includes(name)) {
    return <img class="crest" src={`/img/crests/${name.toLowerCase()}.png`} alt="" width={size} height={Math.round(size * 1.15)} loading="lazy" />;
  }
  const [bg, fg] = teamColor(name);
  return (
    <svg class="crest" aria-hidden="true" focusable="false" width={size} height={size * 1.15} viewBox="0 0 40 46">
      <path d="M20 1.500L37 7v15c0 11-7 18-17 22.500C10 40 3 33 3 22V7z" fill={bg} stroke="#0B1F3F" stroke-width="2.500" stroke-linejoin="round" />
      <path d="M20 1.500L3 7v15c0 11 7 18 17 22.500z" fill={fg} opacity=".16" />
      <text x="20" y="28.500" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="19" fill={fg}>{name[0]}</text>
    </svg>
  );
}
