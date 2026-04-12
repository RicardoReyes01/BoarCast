import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import FormTemplate, { FormSection } from '../Templates/SubPageTemplate';

// ─── Example theme colors (replace with your constants) ───
const TAMUK_BLUE = '#003087';
const TAMUK_GOLD = '#C9A227';

// ─── Badge Data ───
const badges = [
  { id: 1, label: 'First Event',       icon: 'star',       bg: '#f0f4ff', iconBg: TAMUK_BLUE, iconColor: TAMUK_GOLD, locked: false },
  { id: 2, label: 'Night Owl',         icon: 'moon',       bg: '#fff8e6', iconBg: TAMUK_GOLD, iconColor: TAMUK_BLUE, locked: false },
  { id: 3, label: 'Social Butterfly',  icon: 'user-group', bg: '#eaf3de', iconBg: '#3B6D11',  iconColor: '#fff', locked: false },
  { id: 4, label: 'Campus Fan',        icon: 'heart',      bg: '#fbeaf0', iconBg: '#993556', iconColor: '#fff', locked: false },
  { id: 5, label: 'Explorer',          icon: 'lock',       bg: '#f5f5f5', iconBg: '#bbb', iconColor: '#fff', locked: true },
  { id: 6, label: 'Streak Master',     icon: 'lock',       bg: '#f5f5f5', iconBg: '#bbb', iconColor: '#fff', locked: true },
];

export default function BadgesScreen() {
  const earnedBadges = badges.filter(b => !b.locked);
  const lockedBadges = badges.filter(b => b.locked);

  const renderBadge = (badge) => (
    <View
      key={badge.id}
      style={[
        styles.badgeCard,
        {
          backgroundColor: badge.bg,
          opacity: badge.locked ? 0.45 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.badgeIconCircle,
          { backgroundColor: badge.iconBg },
        ]}
      >
        <FontAwesome6
          name={badge.icon}
          size={16}
          color={badge.iconColor}
          solid
        />
      </View>

      <Text style={styles.badgeLabel}>{badge.label}</Text>
    </View>
  );

  return (
    <FormTemplate title="My Badges">
      {/* Earned Badges */}
      <FormSection label="Earned Badges">
        <View style={styles.badgesGrid}>
          {earnedBadges.length > 0 ? (
            earnedBadges.map(renderBadge)
          ) : (
            <Text style={styles.emptyText}>No badges earned yet.</Text>
          )}
        </View>
      </FormSection>

      {/* Locked Badges */}
      <FormSection label="Locked Badges">
        <View style={styles.badgesGrid}>
          {lockedBadges.map(renderBadge)}
        </View>
      </FormSection>

      {/* Info */}
      <FormSection label="How it works">
        <View style={{ padding: 14 }}>
          <Text style={{ fontSize: 13, color: '#666', lineHeight: 18 }}>
            Earn badges by attending events, maintaining streaks, and engaging with campus activities.
            Locked badges will unlock as you participate more.
          </Text>
        </View>
      </FormSection>
    </FormTemplate>
  );
}

// ─── Styles ───
const styles = {
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center'
  },

  badgeCard: {
    width: '47%',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },

  badgeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 12,
    color: '#999',
    padding: 10,
  },
};