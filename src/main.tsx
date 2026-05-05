import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { announcements as seedAnnouncements, badges, challenges, events as seedEvents, members as seedMembers, scores as seedScores, weights as seedWeights } from './data/mockData';
import type { Announcement, EventCategory, EventDefinition, Member, ScoreEntry, ScoringWeights } from './types';
import { formatCategory, getMemberStandings, getPersonalBests, isScoreVisible, normalizeScore, rankMovementLabel } from './lib/scoring';

const nav = ['Dashboard', 'Leaderboards', 'Profile', 'Rivalries', 'Events', 'Admin', 'Settings'] as const;
type Page = typeof nav[number];

function App() {
  const [page, setPage] = useState<Page>('Dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [members, setMembers] = useState<Member[]>(seedMembers);
  const [events, setEvents] = useState<EventDefinition[]>(seedEvents);
  const [scores, setScores] = useState<ScoreEntry[]>(seedScores);
  const [weights, setWeights] = useState<ScoringWeights>(seedWeights);
  const [announcements, setAnnouncements] = useState<Announcement[]>(seedAnnouncements);
  const [selectedMemberId, setSelectedMemberId] = useState('m2');

  const standings = useMemo(() => getMemberStandings({ members, events, scores, weights, isAdmin }), [members, events, scores, weights, isAdmin]);
  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? members[0];
  const latestAnnouncement = announcements[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-card">
          <div className="logo-mark">FT</div>
          <div>
            <p className="eyebrow">Florida Tech Flight Team</p>
            <h1>Flight Team Rivalry Board</h1>
          </div>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          {nav.map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{item}</button>)}
        </nav>
        <div className="admin-toggle">
          <span>{isAdmin ? 'E-board view: all scores' : 'Member view: privacy filtered'}</span>
          <button onClick={() => setIsAdmin((value) => !value)}>{isAdmin ? 'Switch to member' : 'Switch to admin'}</button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">Mission control • Spring 2026</p>
            <h2>{page}</h2>
          </div>
          <div className="pilot-picker">
            <label htmlFor="pilot">Profile</label>
            <select id="pilot" value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>
              {members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </div>
        </header>

        {page === 'Dashboard' && <Dashboard standings={standings} members={members} events={events} scores={scores} announcement={latestAnnouncement} isAdmin={isAdmin} />}
        {page === 'Leaderboards' && <Leaderboards members={members} events={events} scores={scores} weights={weights} isAdmin={isAdmin} />}
        {page === 'Profile' && <Profile member={selectedMember} members={members} events={events} scores={scores} standings={standings} isAdmin={isAdmin} onPrivacy={(preference) => setMembers((items) => items.map((item) => item.id === selectedMember.id ? { ...item, visibility: { ...item.visibility, preference } } : item))} />}
        {page === 'Rivalries' && <Rivalries members={members} events={events} standings={standings} />}
        {page === 'Events' && <EventsPage events={events} scores={scores} members={members} isAdmin={isAdmin} />}
        {page === 'Admin' && <AdminPanel members={members} setMembers={setMembers} events={events} setEvents={setEvents} scores={scores} setScores={setScores} weights={weights} setWeights={setWeights} announcements={announcements} setAnnouncements={setAnnouncements} />}
        {page === 'Settings' && <Settings member={selectedMember} onPrivacy={(preference) => setMembers((items) => items.map((item) => item.id === selectedMember.id ? { ...item, visibility: { ...item.visibility, preference } } : item))} />}
      </main>
    </div>
  );
}

function Dashboard({ standings, members, events, scores, announcement, isAdmin }: { standings: ReturnType<typeof getMemberStandings>; members: Member[]; events: EventDefinition[]; scores: ScoreEntry[]; announcement: Announcement; isAdmin: boolean }) {
  const topImprovers = [...standings].sort((a, b) => b.improvementScore - a.improvementScore).slice(0, 3);
  const recent = [...scores].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const eventMap = new Map(events.map((event) => [event.id, event]));
  const memberMap = new Map(members.map((member) => [member.id, member]));
  const teamAverage = standings.reduce((sum, item) => sum + item.totalScore, 0) / standings.length;
  const publicCount = scores.filter((score) => isScoreVisible(score, memberMap.get(score.memberId)!, isAdmin)).length;

  return <section className="grid-page">
    <div className="hero card span-8">
      <p className="eyebrow">Friendly rivalry, serious growth</p>
      <h3>Reward the best score, the biggest jump, and the teammate who keeps showing up.</h3>
      <p>The board blends NIFA-style raw results with improvement, consistency, and participation so rookies can compete with veterans without public shame for early rough reps.</p>
      <div className="hero-actions"><a href="#leaderboard">View standings</a><a href="#privacy">Privacy rules</a></div>
    </div>
    <Metric label="Team composite" value={teamAverage.toFixed(1)} detail="Weighted performance index" />
    <Metric label="Logged reps" value={String(publicCount)} detail={isAdmin ? 'All visible to e-board' : 'Privacy-filtered public count'} />
    <Metric label="Active streaks" value={String(members.filter((m) => m.streakWeeks >= 5).length)} detail="Members at 5+ weeks" />
    <Metric label="PB watch" value="11" detail="Alerts from recent updates" />

    <div className="card span-7" id="leaderboard"><SectionTitle title="Overall leaderboard" subtitle="Composite score includes improvement, consistency, and participation." />
      <LeaderboardTable standings={standings.slice(0, 6)} compact />
    </div>
    <div className="card span-5"><SectionTitle title="Most improved" subtitle="Newer members can win the week by moving their own baseline." />
      <div className="stack">{topImprovers.map((item) => <MiniPerson key={item.member.id} standing={item} value={`${item.improvementScore.toFixed(0)} growth`} />)}</div>
    </div>
    <div className="card span-4"><SectionTitle title="Category leaders" subtitle="Specialists get spotlight time." />
      {(['knowledge', 'landing', 'misc'] as EventCategory[]).map((category) => {
        const leader = [...standings].sort((a, b) => b.categoryScores[category] - a.categoryScores[category])[0];
        return <div className="category-row" key={category}><span>{formatCategory(category)}</span><strong>{leader.member.name}</strong><em>{leader.categoryScores[category].toFixed(1)}</em></div>;
      })}
    </div>
    <div className="card span-4"><SectionTitle title="Weekly challenge" subtitle="E6B Wind Triangle Sprint" />
      <p className="big-copy">Closest improvement wins; both pilots share one technique after the round.</p>
      <div className="chip-row"><span className="chip">Improvement metric</span><span className="chip">Ends May 8</span></div>
    </div>
    <div className="card span-4"><SectionTitle title={announcement.title} subtitle={`${announcement.author} • ${announcement.date}`} />
      <p>{announcement.body}</p><p className="goal">Goal: {announcement.goalMetric}</p>
    </div>
    <div className="card span-12"><SectionTitle title="Recent score updates" subtitle="Hidden low scores are omitted for public viewers, but available in e-board mode." />
      <div className="responsive-table"><table><tbody>{recent.map((score) => <tr key={score.id}><td>{memberMap.get(score.memberId)?.name}</td><td>{eventMap.get(score.eventId)?.name}</td><td><strong>{score.rawScore}</strong> {eventMap.get(score.eventId)?.unit}</td><td>{score.date}</td><td>{score.isPublic ? <span className="status good">Public</span> : <span className="status private">Hidden</span>}</td></tr>)}</tbody></table></div>
    </div>
  </section>;
}

function Leaderboards({ members, events, scores, weights, isAdmin }: { members: Member[]; events: EventDefinition[]; scores: ScoreEntry[]; weights: ScoringWeights; isAdmin: boolean }) {
  const [category, setCategory] = useState<EventCategory | 'all'>('all');
  const [eventId, setEventId] = useState<string | 'all'>('all');
  const [sort, setSort] = useState('totalScore');
  const standings = useMemo(() => getMemberStandings({ members, events, scores, weights, isAdmin, category, eventId }).sort((a, b) => Number(b[sort as keyof typeof b]) - Number(a[sort as keyof typeof a])), [members, events, scores, weights, isAdmin, category, eventId, sort]);
  return <section className="card"><SectionTitle title="Leaderboards" subtitle="Filter by category or event. Public mode respects hidden-score settings." />
    <div className="filters"><select value={category} onChange={(e) => setCategory(e.target.value as EventCategory | 'all')}><option value="all">All categories</option><option value="knowledge">Knowledge</option><option value="landing">Landing</option><option value="misc">Miscellaneous</option></select><select value={eventId} onChange={(e) => setEventId(e.target.value)}><option value="all">All events</option>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select><select value={sort} onChange={(e) => setSort(e.target.value)}><option value="totalScore">Total score</option><option value="averageNormalized">Average score</option><option value="improvementScore">Improvement</option><option value="consistencyScore">Consistency</option><option value="recentPerformance">Recent performance</option></select></div>
    <LeaderboardTable standings={standings} />
  </section>;
}

function Profile({ member, events, scores, standings, isAdmin, onPrivacy }: { member: Member; members?: Member[]; events: EventDefinition[]; scores: ScoreEntry[]; standings: ReturnType<typeof getMemberStandings>; isAdmin: boolean; onPrivacy: (value: Member['visibility']['preference']) => void }) {
  const standing = standings.find((item) => item.member.id === member.id)!;
  const personalBests = getPersonalBests(member.id, events, scores, isAdmin).slice(0, 6);
  const memberBadges = badges.filter((badge) => badge.memberIds.includes(member.id));
  const memberScores = scores.filter((score) => score.memberId === member.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const eventMap = new Map(events.map((event) => [event.id, event]));
  return <section className="grid-page"><div className="card span-4 profile-card"><div className="avatar large">{member.avatar}</div><h3>{member.name}</h3><p>{member.classYear} • {member.role}</p><p>{member.profileNote}</p><div className="chip-row">{member.specialties.map((specialty) => <span className="chip" key={specialty}>{specialty}</span>)}</div></div>
    <Metric label="Composite" value={standing.totalScore.toFixed(1)} detail="Overall weighted score" /><Metric label="Improvement" value={standing.improvementScore.toFixed(0)} detail="Trend score" /><Metric label="Streak" value={`${member.streakWeeks} wk`} detail="Practice activity" />
    <div className="card span-8"><SectionTitle title="Category breakdown" subtitle="Balanced growth matters as much as specialization." /><div className="bars">{Object.entries(standing.categoryScores).map(([category, value]) => <Bar key={category} label={formatCategory(category as EventCategory)} value={value} />)}</div></div>
    <div className="card span-4"><SectionTitle title="Badges earned" subtitle="Positive recognition only." /><div className="badge-grid">{memberBadges.map((badge) => <div className="badge" key={badge.id}><span>{badge.icon}</span><strong>{badge.name}</strong><small>{badge.description}</small></div>)}</div></div>
    <div className="card span-6"><SectionTitle title="Personal bests" subtitle="Raw score retained by event." />{personalBests.map(({ event, score }) => <div className="category-row" key={event.id}><span>{event.name}</span><strong>{score.rawScore} {event.unit}</strong><em>{score.date}</em></div>)}</div>
    <div className="card span-6"><SectionTitle title="Recent scores" subtitle="Privacy toggles apply to public views." /><div className="responsive-table"><table><tbody>{memberScores.map((score) => <tr key={score.id}><td>{eventMap.get(score.eventId)?.name}</td><td>{score.rawScore} {eventMap.get(score.eventId)?.unit}</td><td>{score.date}</td><td>{score.isPublic ? 'Public' : 'Hidden'}</td></tr>)}</tbody></table></div></div>
    <div className="card span-12" id="privacy"><SectionTitle title="Visibility controls" subtitle="Members can hide lower scores publicly; e-board can still review all data for coaching." /><div className="filters"><select value={member.visibility.preference} onChange={(e) => onPrivacy(e.target.value as Member['visibility']['preference'])}><option value="show_all">Show all public scores</option><option value="hide_lower_scores">Hide lower scores from public boards</option><option value="private_profile">Keep profile private from public view</option></select></div></div>
  </section>;
}

function Rivalries({ members, events, standings }: { members: Member[]; events: EventDefinition[]; standings: ReturnType<typeof getMemberStandings> }) {
  const eventMap = new Map(events.map((event) => [event.id, event]));
  const memberMap = new Map(members.map((member) => [member.id, member]));
  const suggestions = standings.slice(0, 8).map((standing, index, array) => [standing, array[index + 1]]).filter((pair) => pair[1]);
  return <section className="grid-page"><div className="card span-12"><SectionTitle title="Challenges & rivalries" subtitle="Head-to-head energy with coaching language: close scores, shared debriefs, no call-outs." /></div>
    {challenges.map((challenge) => <div className="card span-6 rivalry-card" key={challenge.id}><p className="eyebrow">{challenge.status} • {challenge.metric}</p><h3>{challenge.title}</h3><p>{challenge.tone}</p><div className="versus">{challenge.memberIds.map((id) => <span key={id}>{memberMap.get(id)?.name}</span>)}</div><p className="goal">{challenge.eventId ? eventMap.get(challenge.eventId)?.name : challenge.category && formatCategory(challenge.category)} • {challenge.startDate} to {challenge.endDate}</p>{challenge.outcome && <p>{challenge.outcome}</p>}</div>)}
    <div className="card span-12"><SectionTitle title="Suggested close-match rivals" subtitle="Based on nearby composite scores to keep matchups fair." /><div className="suggestions">{suggestions.map(([a, b]) => <div className="suggestion" key={a.member.id}><strong>{a.member.name}</strong><span>{Math.abs(a.totalScore - b.totalScore).toFixed(1)} pts apart</span><strong>{b.member.name}</strong></div>)}</div></div>
  </section>;
}

function EventsPage({ events, scores, members, isAdmin }: { events: EventDefinition[]; scores: ScoreEntry[]; members: Member[]; isAdmin: boolean }) {
  const memberMap = new Map(members.map((member) => [member.id, member]));
  return <section className="grid-page">{(['knowledge', 'landing', 'misc'] as EventCategory[]).map((category) => <div className="card span-12" key={category}><SectionTitle title={`${formatCategory(category)} events`} subtitle="NIFA-style practice categories with current leaders and team averages." /><div className="event-grid">{events.filter((event) => event.category === category).map((event) => {
    const eventScores = scores.filter((score) => score.eventId === event.id && isScoreVisible(score, memberMap.get(score.memberId)!, isAdmin));
    const sorted = [...eventScores].sort((a, b) => event.scoringDirection === 'higher' ? b.rawScore - a.rawScore : a.rawScore - b.rawScore);
    const leader = sorted[0];
    const avg = eventScores.length ? eventScores.reduce((sum, score) => sum + normalizeScore(score, event), 0) / eventScores.length : 0;
    return <article className="event-card" key={event.id}><p className="eyebrow">{event.unit} • weight {event.defaultWeight}</p><h3>{event.name}</h3><p>{event.description}</p><div className="category-row"><span>Leader</span><strong>{leader ? memberMap.get(leader.memberId)?.name : 'No scores yet'}</strong></div><div className="category-row"><span>Team avg</span><strong>{avg.toFixed(1)}</strong></div></article>;
  })}</div></div>)}</section>;
}

function AdminPanel({ members, setMembers, events, setEvents, scores, setScores, weights, setWeights, announcements, setAnnouncements }: { members: Member[]; setMembers: React.Dispatch<React.SetStateAction<Member[]>>; events: EventDefinition[]; setEvents: React.Dispatch<React.SetStateAction<EventDefinition[]>>; scores: ScoreEntry[]; setScores: React.Dispatch<React.SetStateAction<ScoreEntry[]>>; weights: ScoringWeights; setWeights: React.Dispatch<React.SetStateAction<ScoringWeights>>; announcements: Announcement[]; setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>> }) {
  const [newScore, setNewScore] = useState({ memberId: members[0].id, eventId: events[0].id, rawScore: 85, isPublic: true });
  const [memberName, setMemberName] = useState('');
  const [eventName, setEventName] = useState('');
  const eventMap = new Map(events.map((event) => [event.id, event]));
  const memberMap = new Map(members.map((member) => [member.id, member]));
  function addScore() { setScores((items) => [{ id: `manual-${Date.now()}`, memberId: newScore.memberId, eventId: newScore.eventId, rawScore: Number(newScore.rawScore), date: '2026-05-05', week: '2026-W18', isPublic: newScore.isPublic, enteredBy: 'm2', notes: 'Manual prototype entry.' }, ...items]); }
  return <section className="grid-page"><div className="card span-12"><SectionTitle title="E-board admin panel" subtitle="Prototype workflow: manual entry now; CSV, Sheets sync, auth, and season archives later." /></div>
    <div className="card span-6"><SectionTitle title="Enter score" subtitle="Manual low-cost workflow for early adoption." /><div className="form-grid"><select value={newScore.memberId} onChange={(e) => setNewScore({ ...newScore, memberId: e.target.value })}>{members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select><select value={newScore.eventId} onChange={(e) => setNewScore({ ...newScore, eventId: e.target.value })}>{events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}</select><input type="number" value={newScore.rawScore} onChange={(e) => setNewScore({ ...newScore, rawScore: Number(e.target.value) })} /><label className="checkbox"><input type="checkbox" checked={newScore.isPublic} onChange={(e) => setNewScore({ ...newScore, isPublic: e.target.checked })} /> Public score</label><button onClick={addScore}>Add score</button></div></div>
    <div className="card span-6"><SectionTitle title="Manage members & events" subtitle="Add draft records for the prototype session." /><div className="form-grid"><input placeholder="New member name" value={memberName} onChange={(e) => setMemberName(e.target.value)} /><button onClick={() => { if (!memberName) return; setMembers((items) => [...items, { id: `m${Date.now()}`, name: memberName, classYear: 'New member', role: 'member', specialties: ['Training'], avatar: memberName.split(' ').map((p) => p[0]).join('').slice(0,2).toUpperCase(), joined: '2026-05-05', streakWeeks: 0, rankMovement: 0, visibility: { preference: 'hide_lower_scores', publicMinimumScore: 70 }, profileNote: 'Draft member added in prototype.' }]); setMemberName(''); }}>Add member</button><input placeholder="New event name" value={eventName} onChange={(e) => setEventName(e.target.value)} /><button onClick={() => { if (!eventName) return; setEvents((items) => [...items, { id: eventName.toLowerCase().replaceAll(' ', '-'), name: eventName, category: 'misc', description: 'Draft event ready for e-board refinement.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 }]); setEventName(''); }}>Add event</button></div></div>
    <div className="card span-5"><SectionTitle title="Scoring weights" subtitle="Editable composite model." />{Object.entries(weights).map(([key, value]) => <label className="weight-row" key={key}><span>{key}</span><input type="number" step="0.05" value={value} onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })} /></label>)}</div>
    <div className="card span-7"><SectionTitle title="All scores, including hidden" subtitle="E-board sees hidden scores for coaching and audit trails." /><div className="responsive-table"><table><tbody>{scores.slice(0, 12).map((score) => <tr key={score.id}><td>{memberMap.get(score.memberId)?.name}</td><td>{eventMap.get(score.eventId)?.name}</td><td>{score.rawScore}</td><td>{score.isPublic ? 'Public' : 'Hidden'}</td><td><button className="link-button" onClick={() => setScores((items) => items.map((item) => item.id === score.id ? { ...item, isPublic: !item.isPublic } : item))}>Toggle</button></td><td><button className="link-button danger" onClick={() => setScores((items) => items.filter((item) => item.id !== score.id))}>Delete</button></td></tr>)}</tbody></table></div></div>
    <div className="card span-12"><SectionTitle title="Announcements" subtitle="Post weekly goals with a constructive tone." /><div className="form-grid wide"><input value={announcements[0]?.title ?? ''} onChange={(e) => setAnnouncements((items) => [{ ...items[0], title: e.target.value }, ...items.slice(1)])} /><textarea value={announcements[0]?.body ?? ''} onChange={(e) => setAnnouncements((items) => [{ ...items[0], body: e.target.value }, ...items.slice(1)])} /></div></div>
  </section>;
}

function Settings({ member, onPrivacy }: { member: Member; onPrivacy: (value: Member['visibility']['preference']) => void }) {
  return <section className="grid-page"><div className="card span-8"><SectionTitle title="Privacy & culture settings" subtitle="The board should motivate without shaming." /><p>Public leaderboards can hide lower scores or private profiles. E-board/admin mode still sees all score entries so officers can coach safely, verify trends, and prevent data loss.</p><div className="setting-list"><label><input type="radio" checked={member.visibility.preference === 'show_all'} onChange={() => onPrivacy('show_all')} /> Show all public scores</label><label><input type="radio" checked={member.visibility.preference === 'hide_lower_scores'} onChange={() => onPrivacy('hide_lower_scores')} /> Hide lower scores from public boards</label><label><input type="radio" checked={member.visibility.preference === 'private_profile'} onChange={() => onPrivacy('private_profile')} /> Keep profile private from public view</label></div></div><div className="card span-4"><SectionTitle title="Product names" subtitle="Options for feedback" /><ul className="clean-list"><li>Flight Team Rivalry Board</li><li>HangarBoard</li><li>FlightLine Leaderboard</li><li>FIT Flight Team Performance Hub</li></ul></div></section>;
}

function LeaderboardTable({ standings, compact = false }: { standings: ReturnType<typeof getMemberStandings>; compact?: boolean }) { return <div className="responsive-table"><table><thead><tr><th>Rank</th><th>Member</th><th>Total</th>{!compact && <><th>Knowledge</th><th>Landing</th><th>Misc</th><th>Growth</th><th>Consistency</th><th>Move</th></>}</tr></thead><tbody>{standings.map((item, index) => <tr key={item.member.id}><td><span className={`rank rank-${index + 1}`}>{index + 1}</span></td><td><div className="person"><span className="avatar">{item.member.avatar}</span><div><strong>{item.member.name}</strong><small>{item.member.classYear} • {item.publicScoreCount}/{item.allScoreCount} public</small></div></div></td><td><strong>{item.totalScore.toFixed(1)}</strong></td>{!compact && <><td>{item.categoryScores.knowledge.toFixed(1)}</td><td>{item.categoryScores.landing.toFixed(1)}</td><td>{item.categoryScores.misc.toFixed(1)}</td><td>{item.improvementScore.toFixed(0)}</td><td>{item.consistencyScore.toFixed(0)}</td><td className={item.member.rankMovement >= 0 ? 'up' : 'down'}>{rankMovementLabel(item.member.rankMovement)}</td></>}</tr>)}</tbody></table></div>; }
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="metric card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>; }
function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) { return <div className="section-title"><div><h3>{title}</h3><p>{subtitle}</p></div></div>; }
function MiniPerson({ standing, value }: { standing: ReturnType<typeof getMemberStandings>[number]; value: string }) { return <div className="mini-person"><span className="avatar">{standing.member.avatar}</span><div><strong>{standing.member.name}</strong><small>{standing.member.specialties.join(' • ')}</small></div><em>{value}</em></div>; }
function Bar({ label, value }: { label: string; value: number }) { return <div className="bar"><div><span>{label}</span><strong>{value.toFixed(1)}</strong></div><i style={{ width: `${Math.min(100, value)}%` }} /></div>; }

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
