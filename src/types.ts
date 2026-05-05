export type EventCategory = 'knowledge' | 'landing' | 'misc';
export type UserRole = 'member' | 'captain' | 'secretary' | 'treasurer' | 'coach' | 'admin';
export type VisibilityPreference = 'show_all' | 'hide_lower_scores' | 'private_profile';
export type ChallengeStatus = 'active' | 'completed' | 'draft';
export type ChallengeMetric = 'raw_score' | 'improvement' | 'consistency' | 'participation';

export interface VisibilitySettings {
  preference: VisibilityPreference;
  publicMinimumScore?: number;
  hideNotes?: boolean;
}

export interface Member {
  id: string;
  name: string;
  classYear: string;
  role: UserRole;
  specialties: string[];
  avatar: string;
  joined: string;
  streakWeeks: number;
  rankMovement: number;
  visibility: VisibilitySettings;
  profileNote: string;
}

export interface EventDefinition {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  scoringDirection: 'higher' | 'lower';
  maxRawScore?: number;
  unit: string;
  defaultWeight: number;
}

export interface ScoreEntry {
  id: string;
  memberId: string;
  eventId: string;
  rawScore: number;
  date: string;
  week: string;
  isPublic: boolean;
  notes?: string;
  enteredBy: string;
}

export interface Challenge {
  id: string;
  title: string;
  memberIds: string[];
  eventId?: string;
  category?: EventCategory;
  metric: ChallengeMetric;
  status: ChallengeStatus;
  startDate: string;
  endDate: string;
  outcome?: string;
  tone: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberIds: string[];
  category?: EventCategory;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string;
  goalMetric: string;
}

export interface ScoringWeights {
  knowledge: number;
  landing: number;
  misc: number;
  improvement: number;
  consistency: number;
  participation: number;
}

export interface MemberStanding {
  member: Member;
  totalScore: number;
  rawPerformance: number;
  improvementScore: number;
  consistencyScore: number;
  participationScore: number;
  categoryScores: Record<EventCategory, number>;
  averageNormalized: number;
  recentPerformance: number;
  publicScoreCount: number;
  allScoreCount: number;
}
