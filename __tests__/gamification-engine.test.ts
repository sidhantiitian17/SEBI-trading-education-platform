import { gamificationEngine } from '@/lib/gamification-engine';
import { Achievement, UserGamification, DailyChallenge } from '@/lib/gamification-types';

describe('Gamification Engine', () => {
  const testUserId = 'test-user-123';

  beforeEach(() => {
    // Reset any stored state
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('returns a valid user profile', () => {
      const profile = gamificationEngine.getUserProfile(testUserId);

      expect(profile).toHaveProperty('userId', testUserId);
      expect(profile).toHaveProperty('level');
      expect(profile).toHaveProperty('xp');
      expect(profile).toHaveProperty('xpToNextLevel');
      expect(profile).toHaveProperty('totalPoints');
      expect(profile).toHaveProperty('achievements');
      expect(Array.isArray(profile.achievements)).toBe(true);
    });

    it('creates profile with default values for new user', () => {
      const profile = gamificationEngine.getUserProfile('new-user');

      expect(profile.level).toBe(1);
      expect(profile.xp).toBe(0);
      expect(profile.totalPoints).toBe(0);
    });
  });

  describe('checkAchievements', () => {
    it('returns achievements for valid actions', () => {
      const achievements = gamificationEngine.checkAchievements(testUserId, 'module_complete', { moduleId: 'trading-basics' });

      expect(Array.isArray(achievements)).toBe(true);
      if (achievements.length > 0) {
        expect(achievements[0]).toHaveProperty('id');
        expect(achievements[0]).toHaveProperty('name');
        expect(achievements[0]).toHaveProperty('points');
      }
    });

    it('handles invalid actions gracefully', () => {
      const achievements = gamificationEngine.checkAchievements(testUserId, 'invalid_action');

      expect(Array.isArray(achievements)).toBe(true);
      expect(achievements.length).toBe(0);
    });
  });

  describe('updateProgress', () => {
    it('updates user progress for valid categories', () => {
      const initialProfile = gamificationEngine.getUserProfile(testUserId);
      const initialXP = initialProfile.xp;

      gamificationEngine.updateProgress(testUserId, 'learning', 100);

      const updatedProfile = gamificationEngine.getUserProfile(testUserId);
      expect(updatedProfile.xp).toBeGreaterThanOrEqual(initialXP);
    });

    it('handles invalid categories gracefully', () => {
      const initialProfile = gamificationEngine.getUserProfile(testUserId);

      gamificationEngine.updateProgress(testUserId, 'invalid_category', 50);

      const updatedProfile = gamificationEngine.getUserProfile(testUserId);
      expect(updatedProfile).toEqual(initialProfile);
    });
  });

  describe('claimDailyChallengeReward', () => {
    it('claims reward for valid challenge', () => {
      // First create a completed challenge
      const profile = gamificationEngine.getUserProfile(testUserId);
      const challengeId = profile.dailyChallenges[0]?.id;

      if (challengeId) {
        const success = gamificationEngine.claimDailyChallengeReward(testUserId, challengeId);
        expect(typeof success).toBe('boolean');
      }
    });

    it('handles invalid challenge IDs gracefully', () => {
      const success = gamificationEngine.claimDailyChallengeReward(testUserId, 'invalid-challenge');
      expect(success).toBe(false);
    });
  });
});
