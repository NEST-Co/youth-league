import data from '../data/league.json';

export type Game = {
  id: number; division: string; date: string; time: string; field: string;
  home: string; away: string; homeScore?: number; awayScore?: number; note?: string;
};
export type Division = { id: string; label: string; time: string; teams: { name: string; coach: string }[] };
export type Row = { team: string; played: number; won: number; drawn: number; lost: number; gf: number; ga: number; points: number };

export const season: string = data.season;
export const divisions: Division[] = data.divisions;
export const games: Game[] = data.games as Game[];

export const played = (g: Game) => g.homeScore !== undefined && g.awayScore !== undefined;

export function standings(division: string, all: Game[] = games): Row[] {
  const div = divisions.find((d) => d.id === division)!;
  const rows = new Map<string, Row>(div.teams.map((t) => [t.name, { team: t.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }]));
  for (const g of all.filter((x) => x.division === division && played(x))) {
    const h = rows.get(g.home)!, a = rows.get(g.away)!;
    h.played++; a.played++;
    h.gf += g.homeScore!; h.ga += g.awayScore!; a.gf += g.awayScore!; a.ga += g.homeScore!;
    if (g.homeScore! > g.awayScore!) { h.won++; a.lost++; h.points += 3; }
    else if (g.homeScore! < g.awayScore!) { a.won++; h.lost++; a.points += 3; }
    else { h.drawn++; a.drawn++; h.points++; a.points++; }
  }
  return [...rows.values()].sort((x, y) => y.points - x.points || (y.gf - y.ga) - (x.gf - x.ga) || y.gf - x.gf || x.team.localeCompare(y.team));
}

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', opts);

export const closures = [
  { date: '2026-10-31', field: 'Riverbend Park Field 2', reason: 'Drainage repair. Games on this field are moved to Field 1.' },
];
export const fieldInfo = [
  { name: 'Riverbend Park Field 1', address: '500 River Road', note: 'Main field. Restrooms and parking next to the field.' },
  { name: 'Riverbend Park Field 2', address: '500 River Road', note: 'Behind the playground. Short walk from the lot.' },
  { name: 'Mill Road Field', address: '88 Mill Road', note: 'Small lot. Please carpool when you can.' },
];

const colors: Record<string, [string, string]> = {
  Herons: ['#2D7BFF', '#fff'], Otters: ['#8B5E3C', '#fff'], Wrens: ['#F59E0B', '#1B1200'], Foxes: ['#E4511E', '#fff'],
  Kestrels: ['#7C4DCC', '#fff'], Badgers: ['#2B2F36', '#fff'], Salamanders: ['#1F9D5B', '#fff'], Comets: ['#14B8CC', '#06232A'],
  Thunder: ['#FACC15', '#1B1700'], Rapids: ['#0E7AA8', '#fff'], Pioneers: ['#A63232', '#fff'], Storm: ['#5B6B82', '#fff'],
};
export const teamColor = (name: string): [string, string] => colors[name] ?? ['#0B1F3F', '#fff'];
