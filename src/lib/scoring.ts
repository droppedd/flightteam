import type { EventCategory, EventDefinition, Member, MemberStanding, ScoreEntry, ScoringWeights } from '../types';

const categories: EventCategory[] = ['knowledge', 'landing', 'misc'];

export function isScoreVisible(score: ScoreEntry, member: Member, isAdmin: boolean) {
  if (isAdmin) return true;
  if (!score.isPublic) return false;
  if (member.visibility.preference === 'private_profile') return false;
  if (member.visibility.preference === 'hide_lower_scores' && member.visibility.publicMinimumScore) {
    return score.rawScore >= member.visibility.publicMinimumScore;
  }
  return true;
}

export function normalizeScore(score: ScoreEntry, event: EventDefinition) {
  if (event.scoringDirection === 'higher') {
    const max = event.maxRawScore ?? 100;
    return Math.max(0, Math.min(100, (score.rawScore / max) * 100));
  }
  const max = event.maxRawScore ?? 200;
  return Math.max(0, Math.min(100, 100 - (score.rawScore / max) * 100));
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values: number[]) {
  if (values.length < 2) return 0;
  const avg = average(values);
  return Math.sqrt(average(values.map((value) => (value - avg) ** 2)));
}

export function getMemberStandings(params: {
  members: Member[];
  events: EventDefinition[];
  scores: ScoreEntry[];
  weights: ScoringWeights;
  isAdmin: boolean;
  category?: EventCategory | 'all';
  eventId?: string | 'all';
}): MemberStanding[] {
  const { members, events, scores, weights, isAdmin, category = 'all', eventId = 'all' } = params;
  const eventMap = new Map(events.map((event) => [event.id, event]));

  return members.map((member) => {
    const allMemberScores = scores.filter((score) => score.memberId === member.id);
    const visibleScores = allMemberScores.filter((score) => {
      const event = eventMap.get(score.eventId);
      return event && isScoreVisible(score, member, isAdmin);
    });
    const scopedScores = visibleScores.filter((score) => {
      const event = eventMap.get(score.eventId);
      if (!event) return false;
      if (eventId !== 'all' && score.eventId !== eventId) return false;
      if (category !== 'all' && event.category !== category) return false;
      return true;
    });

    const normalized = scopedScores.map((score) => normalizeScore(score, eventMap.get(score.eventId)!));
    const rawPerformance = average(normalized);
    const categoryScores = categories.reduce((acc, item) => {
      const categoryValues = visibleScores
        .filter((score) => eventMap.get(score.eventId)?.category === item)
        .map((score) => normalizeScore(score, eventMap.get(score.eventId)!));
      acc[item] = average(categoryValues);
      return acc;
    }, {} as Record<EventCategory, number>);

    const byWeek = [...new Set(scopedScores.map((score) => score.week))].sort();
    const weeklyAverages = byWeek.map((week) => average(scopedScores
      .filter((score) => score.week === week)
      .map((score) => normalizeScore(score, eventMap.get(score.eventId)!))));
    const firstHalf = weeklyAverages.slice(0, Math.max(1, Math.floor(weeklyAverages.length / 2)));
    const secondHalf = weeklyAverages.slice(Math.max(1, Math.floor(weeklyAverages.length / 2)));
    const improvementScore = Math.max(0, Math.min(100, 50 + (average(secondHalf) - average(firstHalf)) * 3));
    const consistencyScore = Math.max(0, 100 - standardDeviation(weeklyAverages) * 4);
    const participationScore = Math.min(100, scopedScores.length * 7 + member.streakWeeks * 3);
    const categoryComposite = (
      categoryScores.knowledge * weights.knowledge +
      categoryScores.landing * weights.landing +
      categoryScores.misc * weights.misc
    ) / (weights.knowledge + weights.landing + weights.misc);
    const totalScore = categoryComposite +
      improvementScore * weights.improvement +
      consistencyScore * weights.consistency +
      participationScore * weights.participation;

    return {
      member,
      totalScore,
      rawPerformance,
      improvementScore,
      consistencyScore,
      participationScore,
      categoryScores,
      averageNormalized: rawPerformance,
      recentPerformance: average(weeklyAverages.slice(-2)),
      publicScoreCount: visibleScores.length,
      allScoreCount: allMemberScores.length,
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
}

export function getPersonalBests(memberId: string, events: EventDefinition[], scores: ScoreEntry[], isAdmin = true) {
  return events.map((event) => {
    const eventScores = scores.filter((score) => score.memberId === memberId && score.eventId === event.id && (isAdmin || score.isPublic));
    const best = eventScores.sort((a, b) => event.scoringDirection === 'higher' ? b.rawScore - a.rawScore : a.rawScore - b.rawScore)[0];
    return best ? { event, score: best } : undefined;
  }).filter(Boolean) as { event: EventDefinition; score: ScoreEntry }[];
}

export function formatCategory(category: EventCategory) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export function rankMovementLabel(value: number) {
  if (value > 0) return `▲ ${value}`;
  if (value < 0) return `▼ ${Math.abs(value)}`;
  return '—';
}
