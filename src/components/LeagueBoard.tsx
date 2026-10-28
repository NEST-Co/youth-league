import { useMemo, useState } from 'preact/hooks';
import { divisions, games, played, standings, fmtDate, type Game } from '../lib/league';
import Crest from './Crest';

type Props = { mode: 'schedule' | 'standings'; initialDivision?: string };

export default function LeagueBoard({ mode, initialDivision }: Props) {
  const [division, setDivision] = useState(initialDivision ?? divisions[0].id);
  const [team, setTeam] = useState('');
  const [show, setShow] = useState<'all' | 'upcoming' | 'results'>('all');
  const [announce, setAnnounce] = useState('');
  const div = divisions.find((d) => d.id === division)!;

  const list = useMemo(() => games
    .filter((g) => g.division === division)
    .filter((g) => !team || g.home === team || g.away === team)
    .filter((g) => show === 'all' || (show === 'results') === played(g))
    .sort((a, b) => a.date.localeCompare(b.date)), [division, team, show]);

  const table = useMemo(() => standings(division), [division]);

  function changeDivision(id: string) {
    setDivision(id); setTeam('');
    const n = divisions.find((d) => d.id === id)!.label;
    setAnnounce(`Showing ${n}`);
  }

  return (
    <div class="board">
      <div class="controls">
        <div>
          <label for="division">Division</label>
          <select id="division" value={division} onChange={(e) => changeDivision((e.target as HTMLSelectElement).value)}>
            {divisions.map((d) => <option value={d.id}>{d.label} ({d.id})</option>)}
          </select>
        </div>
        {mode === 'schedule' && (
          <>
            <div>
              <label for="team">Team</label>
              <select id="team" value={team} onChange={(e) => { setTeam((e.target as HTMLSelectElement).value); setAnnounce(''); }}>
                <option value="">All teams</option>
                {div.teams.map((t) => <option value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label for="show">Show</label>
              <select id="show" value={show} onChange={(e) => setShow((e.target as HTMLSelectElement).value as typeof show)}>
                <option value="all">All games</option>
                <option value="upcoming">Upcoming only</option>
                <option value="results">Results only</option>
              </select>
            </div>
          </>
        )}
      </div>
      <p role="status" aria-live="polite" class="status">
        {mode === 'schedule' ? `${list.length} ${list.length === 1 ? 'game' : 'games'} shown. ${announce}` : announce}
      </p>

      {mode === 'standings' ? (
        <table>
          <caption>{div.label} standings. Three points for a win, one for a draw.</caption>
          <thead><tr>
            <th scope="col">Team</th><th scope="col"><abbr title="Played">P</abbr></th><th scope="col"><abbr title="Won">W</abbr></th>
            <th scope="col"><abbr title="Drawn">D</abbr></th><th scope="col"><abbr title="Lost">L</abbr></th>
            <th scope="col"><abbr title="Goals for">GF</abbr></th><th scope="col"><abbr title="Goals against">GA</abbr></th>
            <th scope="col"><abbr title="Points">Pts</abbr></th>
          </tr></thead>
          <tbody>{table.map((r, i) => (
            <tr class={i === 0 ? 'lead' : undefined}><th scope="row"><span class="tn"><span class="pos" aria-hidden="true">{i + 1}</span><Crest name={r.team} size={30} />{r.team}</span></th><td>{r.played}</td><td>{r.won}</td><td>{r.drawn}</td><td>{r.lost}</td><td>{r.gf}</td><td>{r.ga}</td><td><strong>{r.points}</strong></td></tr>
          ))}</tbody>
        </table>
      ) : (
        <table class="stack">
          <caption>{div.label} games{team ? `, ${team}` : ''}</caption>
          <thead><tr><th scope="col">Date</th><th scope="col">Game</th><th scope="col">Result or time</th><th scope="col">Field</th></tr></thead>
          <tbody>{list.map((g: Game) => (
            <tr>
              <th scope="row"><time dateTime={g.date}>{fmtDate(g.date)}</time></th>
              <td data-label="Game"><span class="vs-cell"><span class="t"><Crest name={g.home} size={26} />{g.home}</span><span class="o">vs</span><span class="t"><Crest name={g.away} size={26} />{g.away}</span></span></td>
              <td data-label={played(g) ? 'Final' : 'Kickoff'}>{played(g) ? `${g.home} ${g.homeScore}, ${g.away} ${g.awayScore}` : g.time}</td>
              <td data-label="Field">{g.field}{g.note && <span class="note"> {g.note}</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      )}
    </div>
  );
}
