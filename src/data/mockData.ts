import type { Announcement, Badge, Challenge, EventDefinition, Member, ScoreEntry, ScoringWeights } from '../types';

export const weights: ScoringWeights = {
  knowledge: 1,
  landing: 1.15,
  misc: 0.85,
  improvement: 0.25,
  consistency: 0.15,
  participation: 0.1,
};

export const members: Member[] = [
  { id: 'm1', name: 'Maya Ortiz', classYear: 'Senior', role: 'captain', specialties: ['SCAN', 'Navigation'], avatar: 'MO', joined: '2023-08-20', streakWeeks: 8, rankMovement: 1, visibility: { preference: 'show_all' }, profileNote: 'Leads focused debriefs and keeps practice energy high.' },
  { id: 'm2', name: 'Ethan Brooks', classYear: 'Junior', role: 'secretary', specialties: ['E6B', 'Weather'], avatar: 'EB', joined: '2024-01-12', streakWeeks: 6, rankMovement: 3, visibility: { preference: 'hide_lower_scores', publicMinimumScore: 72 }, profileNote: 'Tracking personal bests before regionals.' },
  { id: 'm3', name: 'Sofia Patel', classYear: 'Sophomore', role: 'member', specialties: ['Power-off landing'], avatar: 'SP', joined: '2024-08-18', streakWeeks: 5, rankMovement: 2, visibility: { preference: 'show_all' }, profileNote: 'New landing competitor with strong consistency gains.' },
  { id: 'm4', name: 'Noah Chen', classYear: 'Senior', role: 'treasurer', specialties: ['Preflight', 'Regulations'], avatar: 'NC', joined: '2022-09-01', streakWeeks: 10, rankMovement: 0, visibility: { preference: 'show_all' }, profileNote: 'Dependable utility scorer across categories.' },
  { id: 'm5', name: 'Ava Williams', classYear: 'Junior', role: 'member', specialties: ['Aircraft Recognition'], avatar: 'AW', joined: '2023-11-05', streakWeeks: 7, rankMovement: -1, visibility: { preference: 'show_all' }, profileNote: 'Aircraft recognition specialist and mentor.' },
  { id: 'm6', name: 'Lucas Rivera', classYear: 'Freshman', role: 'member', specialties: ['Simulator', 'CRM'], avatar: 'LR', joined: '2025-01-16', streakWeeks: 4, rankMovement: 4, visibility: { preference: 'hide_lower_scores', publicMinimumScore: 68 }, profileNote: 'Fast-rising rookie focused on fundamentals.' },
  { id: 'm7', name: 'Grace Kim', classYear: 'Sophomore', role: 'member', specialties: ['Short-field landing'], avatar: 'GK', joined: '2024-08-18', streakWeeks: 3, rankMovement: -2, visibility: { preference: 'hide_lower_scores', publicMinimumScore: 70 }, profileNote: 'Turns every landing block into a measurable goal.' },
  { id: 'm8', name: 'Ben Carter', classYear: 'Senior', role: 'coach', specialties: ['Safety/CRM', 'Message drop'], avatar: 'BC', joined: '2022-08-22', streakWeeks: 9, rankMovement: 1, visibility: { preference: 'show_all' }, profileNote: 'Peer coach for safety and mission discipline.' },
  { id: 'm9', name: 'Isabella Nguyen', classYear: 'Junior', role: 'member', specialties: ['Weather', 'Charts'], avatar: 'IN', joined: '2023-08-26', streakWeeks: 5, rankMovement: 2, visibility: { preference: 'show_all' }, profileNote: 'Weather board regular with strong chart interpretation.' },
  { id: 'm10', name: 'Jackson Moore', classYear: 'Freshman', role: 'member', specialties: ['Attendance', 'E6B'], avatar: 'JM', joined: '2025-01-19', streakWeeks: 6, rankMovement: 5, visibility: { preference: 'hide_lower_scores', publicMinimumScore: 65 }, profileNote: 'High-effort newcomer collecting practice reps.' },
  { id: 'm11', name: 'Chloe Davis', classYear: 'Sophomore', role: 'member', specialties: ['Spot landing'], avatar: 'CD', joined: '2024-01-10', streakWeeks: 2, rankMovement: -1, visibility: { preference: 'show_all' }, profileNote: 'Spot landing focus with strong personal-best trend.' },
  { id: 'm12', name: 'Ryan Hughes', classYear: 'Junior', role: 'member', specialties: ['Regulations', 'Flight planning'], avatar: 'RH', joined: '2023-09-03', streakWeeks: 4, rankMovement: 0, visibility: { preference: 'show_all' }, profileNote: 'Steady knowledge-event contributor.' },
  { id: 'm13', name: 'Amelia Stone', classYear: 'Freshman', role: 'member', specialties: ['Preflight', 'Attendance'], avatar: 'AS', joined: '2025-01-21', streakWeeks: 5, rankMovement: 6, visibility: { preference: 'private_profile', publicMinimumScore: 70 }, profileNote: 'Rookie building confidence through repeatable routines.' },
  { id: 'm14', name: 'Owen Martinez', classYear: 'Senior', role: 'admin', specialties: ['Landing accuracy', 'Navigation'], avatar: 'OM', joined: '2022-08-25', streakWeeks: 7, rankMovement: -1, visibility: { preference: 'show_all' }, profileNote: 'Admin reviewer and landing accuracy benchmark.' },
];

export const events: EventDefinition[] = [
  { id: 'aircraft-recognition', name: 'Aircraft Recognition', category: 'knowledge', description: 'Timed identification drills for civil, military, and historical aircraft.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'scan', name: 'SCAN', category: 'knowledge', description: 'Simulated comprehensive aircraft navigation exam practice.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1.1 },
  { id: 'e6b', name: 'E6B / Flight Computer', category: 'knowledge', description: 'Speed, fuel, wind, and conversion problems under time pressure.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'regulations', name: 'Regulations / Aviation Knowledge', category: 'knowledge', description: 'FAR/AIM, procedures, and team quiz bowl review.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 0.9 },
  { id: 'navigation', name: 'Navigation / Flight Planning', category: 'knowledge', description: 'Route planning, checkpoints, winds, fuel, and timing accuracy.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'weather', name: 'Weather / METAR / TAF', category: 'knowledge', description: 'METAR, TAF, prog chart, and weather decision-making practice.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'power-off', name: 'Power-Off Landing', category: 'landing', description: 'Approach energy management and touchdown accuracy.', scoringDirection: 'lower', maxRawScore: 200, unit: 'ft from line', defaultWeight: 1.2 },
  { id: 'short-field', name: 'Short-Field Landing', category: 'landing', description: 'Stabilized approach, target speed, and stopping precision.', scoringDirection: 'lower', maxRawScore: 200, unit: 'ft from target', defaultWeight: 1.1 },
  { id: 'spot-landing', name: 'Spot Landing', category: 'landing', description: 'Touchdown accuracy with safe, repeatable technique.', scoringDirection: 'lower', maxRawScore: 200, unit: 'ft from spot', defaultWeight: 1 },
  { id: 'pattern-consistency', name: 'Pattern / Precision Consistency', category: 'landing', description: 'Repeatable pattern altitudes, airspeeds, headings, and callouts.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 0.9 },
  { id: 'preflight', name: 'Preflight Inspection', category: 'misc', description: 'Finding discrepancies and explaining airworthiness decisions.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'message-drop', name: 'Message Drop', category: 'misc', description: 'Crew coordination and drop accuracy practice.', scoringDirection: 'lower', maxRawScore: 200, unit: 'ft from target', defaultWeight: 0.9 },
  { id: 'simulator', name: 'Simulator Events', category: 'misc', description: 'IFR procedures, abnormal scenarios, and precision profiles.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'safety-crm', name: 'Safety / CRM', category: 'misc', description: 'Briefings, threat-and-error management, and team communication.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 1 },
  { id: 'attendance', name: 'Attendance / Practice Participation', category: 'misc', description: 'Consistent participation, volunteering, and practice readiness.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 0.8 },
  { id: 'contribution', name: 'Team Contribution Points', category: 'misc', description: 'Officer-awarded points for service, mentoring, and culture building.', scoringDirection: 'higher', maxRawScore: 100, unit: 'pts', defaultWeight: 0.75 },
];

const eventCycle = ['aircraft-recognition', 'scan', 'e6b', 'weather', 'power-off', 'short-field', 'spot-landing', 'pattern-consistency', 'preflight', 'simulator', 'safety-crm', 'attendance'];
const weeks = ['2026-W10', '2026-W11', '2026-W12', '2026-W13', '2026-W14', '2026-W15'];

export const scores: ScoreEntry[] = members.flatMap((member, memberIndex) => weeks.flatMap((week, weekIndex) => {
  const selected = eventCycle.slice((memberIndex + weekIndex) % 4, (memberIndex + weekIndex) % 4 + 4);
  const ids = selected.length === 4 ? selected : [...selected, ...eventCycle.slice(0, 4 - selected.length)];
  return ids.map((eventId, eventOffset) => {
    const event = events.find((item) => item.id === eventId)!;
    const base = 62 + ((memberIndex * 7 + weekIndex * 5 + eventOffset * 9) % 30);
    const trend = Math.min(10, weekIndex * (memberIndex % 4));
    const rawScore = event.scoringDirection === 'higher'
      ? Math.min(99, base + trend)
      : Math.max(4, 165 - base - trend * 3 + eventOffset * 6);
    const lowHidden = ['m2', 'm6', 'm7', 'm10', 'm13'].includes(member.id) && weekIndex < 2 && eventOffset === 0;
    return {
      id: `${member.id}-${week}-${eventId}`,
      memberId: member.id,
      eventId,
      rawScore,
      date: `2026-0${weekIndex < 4 ? 3 : 4}-${String(4 + weekIndex * 4 + eventOffset).padStart(2, '0')}`,
      week,
      isPublic: !lowHidden,
      notes: lowHidden ? 'Member hid this early practice score from the public board.' : eventOffset === 0 ? 'Personal-best watch item.' : undefined,
      enteredBy: weekIndex > 3 ? 'm2' : 'm14',
    };
  });
}));

export const challenges: Challenge[] = [
  { id: 'c1', title: 'E6B Wind Triangle Sprint', memberIds: ['m2', 'm10'], eventId: 'e6b', metric: 'improvement', status: 'active', startDate: '2026-04-27', endDate: '2026-05-08', tone: 'Closest improvement wins; both pilots share one technique after the round.' },
  { id: 'c2', title: 'Landing Lineup', memberIds: ['m3', 'm7', 'm11'], category: 'landing', metric: 'consistency', status: 'active', startDate: '2026-04-29', endDate: '2026-05-12', tone: 'Rewarding safe, repeatable approaches before raw accuracy.' },
  { id: 'c3', title: 'Weather Brief Battle', memberIds: ['m9', 'm12'], eventId: 'weather', metric: 'raw_score', status: 'completed', startDate: '2026-04-08', endDate: '2026-04-15', outcome: 'Isabella edged Ryan by 3 points; Ryan earned a personal best.', tone: 'Great debrief from both members.' },
  { id: 'c4', title: 'Team Player Push', memberIds: ['m4', 'm8', 'm13'], eventId: 'attendance', metric: 'participation', status: 'active', startDate: '2026-05-01', endDate: '2026-05-31', tone: 'Show up, help someone else, and log a reflection.' },
];

export const badges: Badge[] = [
  { id: 'b1', name: 'Top Scorer', description: 'Current overall composite leader.', icon: '🏆', memberIds: ['m1'] },
  { id: 'b2', name: 'Most Improved', description: 'Biggest positive trend over the last three weeks.', icon: '📈', memberIds: ['m10', 'm13'] },
  { id: 'b3', name: 'Consistency King', description: 'Smallest week-to-week performance variance.', icon: '🧭', memberIds: ['m4', 'm8'] },
  { id: 'b4', name: 'Aircraft Recognition Ace', description: 'Category-leading aircraft recognition practice.', icon: '✈️', memberIds: ['m5'], category: 'knowledge' },
  { id: 'b5', name: 'E6B Wizard', description: 'Rapid and accurate flight computer work.', icon: '🧮', memberIds: ['m2'], category: 'knowledge' },
  { id: 'b6', name: 'Landing Ace', description: 'Strong landing composite with safe technique.', icon: '🛬', memberIds: ['m3', 'm14'], category: 'landing' },
  { id: 'b7', name: 'Preflight Detective', description: 'Excellent inspection discipline.', icon: '🔎', memberIds: ['m4', 'm13'], category: 'misc' },
  { id: 'b8', name: 'Practice Streak', description: 'Five or more consecutive active weeks.', icon: '🔥', memberIds: ['m1', 'm2', 'm4', 'm5', 'm8', 'm10', 'm14'] },
];

export const announcements: Announcement[] = [
  { id: 'a1', title: 'Weekly Mission: Raise the Floor', body: 'This week we are celebrating clean reps and improvement. Hide a rough practice score if you need to, but log the lesson learned so coaches can help.', author: 'E-board', date: '2026-05-04', goalMetric: '80% of active members log at least two scored practice reps.' },
  { id: 'a2', title: 'Regional Prep Focus', body: 'Knowledge events rotate first, then landing debrief cards. Pair up with someone within 6 composite points for a friendly rivalry.', author: 'Captain', date: '2026-04-28', goalMetric: 'Team average +4 points in knowledge events by May 12.' },
];
