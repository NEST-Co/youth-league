import type { APIRoute, GetStaticPaths } from 'astro';
import { divisions, games } from '../../lib/league';

export const getStaticPaths: GetStaticPaths = () => divisions.map((d) => ({ params: { division: d.id } }));

const clock = (t: string) => {
  const [, h, m, ap] = t.match(/(\d+):(\d+) (a|p)\.m\./)!;
  let hh = Number(h) % 12; if (ap === 'p') hh += 12;
  return `${String(hh).padStart(2, '0')}${m}00`;
};

export const GET: APIRoute = ({ params }) => {
  const id = params.division!;
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Riverbend Youth Soccer concept//EN', `X-WR-CALNAME:Riverbend ${id} games`];
  for (const g of games.filter((x) => x.division === id)) {
    const day = g.date.replaceAll('-', '');
    const start = `${day}T${clock(g.time)}`;
    const endH = String(Number(clock(g.time).slice(0, 2)) + 1).padStart(2, '0');
    lines.push('BEGIN:VEVENT', `UID:game-${g.id}@riverbend-soccer.example`, `DTSTAMP:20261028T000000Z`,
      `DTSTART:${start}`, `DTEND:${day}T${endH}${clock(g.time).slice(2)}`,
      `SUMMARY:${g.home} vs ${g.away} (${id})`, `LOCATION:${g.field}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return new Response(lines.join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
