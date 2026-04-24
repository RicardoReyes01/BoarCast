import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

import AccountMenu from '../../components/AccountMenu';
import { useAuth } from '../../context/AuthContext';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseFrontend";


const TAMUK_BLUE = '#0202df';
const TAMUK_GOLD = '#FFB81C';

const SERVER_URL = "https://boarcast-production.up.railway.app";

// Centralized category list used across the app
const categories = [
  'Academic',
  'Social',
  'Sports',
  'Greek',
  'Service',
  'Arts',
  'Food',
  'Technology',
  'Games',
  'Other',
];

const categoryStyles = {
  Academic:   { bg: '#CECBF6', color: '#3C3489' },
  Social:     { bg: '#F4C0D1', color: '#72243E' },
  Sports:     { bg: '#9FE1CB', color: '#085041' },
  Greek:      { bg: '#FFD6A5', color: '#7A4100' },
  Service:    { bg: '#CDEAC0', color: '#2F6B2F' },
  Arts:       { bg: '#E0BBE4', color: '#4B2E83' },
  Food:       { bg: '#FAC775', color: '#633806' },
  Technology: { bg: '#C7EDE6', color: '#0B5D5E' },
  Games:      { bg: '#D6E0FF', color: '#1E3A8A' },
  Other:      { bg: '#E5E5E5', color: '#444' },
};

const badges = [
  { id: 1, label: 'First Event', icon: 'star', bg: '#f0f4ff', iconBg: TAMUK_BLUE, iconColor: TAMUK_GOLD, locked: false },
  { id: 2, label: 'Night Owl', icon: 'moon', bg: '#fff8e6', iconBg: TAMUK_GOLD, iconColor: TAMUK_BLUE, locked: false },
  { id: 3, label: 'Social Butterfly', icon: 'user-group', bg: '#eaf3de', iconBg: '#3B6D11', iconColor: '#fff', locked: false },
  { id: 4, label: 'Campus Fan', icon: 'heart', bg: '#fbeaf0', iconBg: '#993556', iconColor: '#fff', locked: false },
  { id: 5, label: 'Explorer', icon: 'lock', bg: '#f5f5f5', iconBg: '#bbb', iconColor: '#fff', locked: true },
  { id: 6, label: 'Streak Master', icon: 'lock', bg: '#f5f5f5', iconBg: '#bbb', iconColor: '#fff', locked: true },
];

export default function AccountScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Controls the slide-out menu
  const [menuOpen, setMenuOpen] = useState(false);

  // Controls whether the user is editing interests
  const [editingInterests, setEditingInterests] = useState(false);

  // Holds the currently selected interests (editable state)
  const [selectedInterests, setSelectedInterests] = useState([]);

  const [recommendedEvents, setRecommendedEvents] = useState([]);

  const authContext = useAuth();

  const fetchRecommendedEvents = async (interests) => {
    try {
      const snapshot = await getDocs(collection(db, "events"));

      const allEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = allEvents.filter((event) =>
        interests?.length &&
        interests.includes(event.category)
      );

      setRecommendedEvents(filtered);
    } catch (err) {
      console.log("RECOMMENDATION ERROR:", err);
    }
  };

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await authContext.getToken();

        const response = await fetch(`${SERVER_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProfile(data);

          // Initialize interests from backend response
          setSelectedInterests(data.interests ?? []);
          fetchRecommendedEvents(data.interests ?? []);
        } else {
          console.error('Failed to fetch profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Toggle a category in the selected interests list
  const toggleInterest = (category) => {
    setSelectedInterests((prev) => {
      if (prev.includes(category)) {
        return prev.filter((i) => i !== category);
      }

      // Optional: limit number of selections
      if (prev.length >= 5) return prev;

      return [...prev, category];
    });
  };

  // Persist selected interests to backend
  const saveInterests = async () => {
    try {
      const token = await authContext.getToken();

      const response = await fetch(`${SERVER_URL}/me/interests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.log("Response is NOT JSON (important)");
        return;
      }

      if (!response.ok) {
        console.error("Server error:", data);
      }
      if (response.ok) {
      //UPDATE PROFILE STATE
        setProfile((prev) => ({
          ...prev,
          interests: selectedInterests,
        }));

        //REFRESH RECOMMENDATIONS IN REAL TIME
        fetchRecommendedEvents(selectedInterests);
      } else {
        console.error("Server error:", data);
      }

    } catch (err) {
      console.error("Failed to save interests", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={TAMUK_BLUE} />
      </View>
    );
  }

  const displayedInterests = editingInterests
  ? selectedInterests
  : profile?.interests ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.username}>{profile?.email ?? ''}</Text>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <FontAwesome6 name="bars" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileBand}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <FontAwesome6 name="circle-user" size={52} color="#fff" />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.fullName}>{profile?.name ?? 'Unknown'}</Text>
              <Text style={styles.majorText}>
                {profile?.role === 'org_leader'
                  ? 'Org Leader'
                  : profile?.role === 'student'
                  ? 'Student'
                  : 'Unknown'}
              </Text>

              <View style={styles.eventsBadge}>
                <Text style={styles.eventsBadgeText}>
                  {profile?.rsvps?.length ?? 0} events attended
                </Text>
              </View>
            </View>
          </View>

          {/* Interests Section */}
          <View style={styles.tagsSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.tagsLabel}>INTERESTS</Text>

              <TouchableOpacity
                onPress={async () => {
                  if (editingInterests) {
                    await saveInterests();

                    // keep local UI in sync immediately
                    setProfile((prev) => ({
                      ...prev,
                      interests: selectedInterests,
                    }));
                  }

                  setEditingInterests(!editingInterests);
                }}
              >
                <Text style={{ color: TAMUK_BLUE, fontWeight: '600' }}>
                  {editingInterests ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display saved interests */}
            <View style={styles.tagsRow}>
              {displayedInterests.map((interest) => {
                const style = categoryStyles[interest] ?? categoryStyles.Other;

                return (
                  <View
                    key={interest}
                    style={[
                      styles.tag,
                      { backgroundColor: style.bg },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: style.color }]}>
                      {interest}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Editing mode: selectable categories */}
            {editingInterests && (
              <View style={[styles.tagsRow, { marginTop: 10 }]}>
                {categories.map((category) => {
                  const selected = selectedInterests.includes(category);

                  return (
                    <TouchableOpacity
                      key={category}
                      onPress={() => toggleInterest(category)}
                      style={[
                        styles.tag,
                        { backgroundColor: selected ? TAMUK_BLUE : '#e0e0e0' },
                      ]}
                    >
                      <Text
                        style={{
                          color: selected ? '#fff' : '#333',
                          fontSize: 12,
                          fontWeight: '500',
                        }}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
        {/* EVENTS YOU MAY LIKE */}
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>
            Events You May Like
          </Text>

          {recommendedEvents.length === 0 ? (
            <Text style={styles.emptyText}>
              No recommendations yet
            </Text>
          ) : (
            recommendedEvents.slice(0, 5).map((event) => (
              <TouchableOpacity key={event.id} style={styles.recommendedCard}>

                <View style={styles.cardContent}>
                  <Text style={styles.eventTitle}>
                    {event.title}
                  </Text>

                  <Text style={styles.eventMeta}>
                    {event.category} • {event.location}
                  </Text>
                </View>

                <View style={styles.slashContainer}>
                  <View style={styles.slash} />
                  <View style={styles.slash} />
                </View>

              </TouchableOpacity>
            ))
          )}
        </View>
        {/* Badges */}
        <View style={styles.badgesSection}>
          <Text style={styles.badgesLabel}>BADGES EARNED</Text>
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  { backgroundColor: badge.bg, opacity: badge.locked ? 0.5 : 1 },
                ]}
              >
                <View style={[styles.badgeIconCircle, { backgroundColor: badge.iconBg }]}> 
                  <FontAwesome6
                    name={badge.icon}
                    size={16}
                    color={badge.iconColor}
                    solid
                  />
                </View>
                <Text style={styles.badgeLabel}>{badge.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <AccountMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: TAMUK_BLUE,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: { color: '#fff', fontSize: 18, fontWeight: '500' },
  profileBand: {
    backgroundColor: TAMUK_GOLD,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: TAMUK_BLUE,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: 3 },
  fullName: { fontSize: 16, fontWeight: '600', color: TAMUK_BLUE },
  majorText: { fontSize: 13 },
  eventsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: TAMUK_BLUE,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  eventsBadgeText: { fontSize: 11, color: TAMUK_GOLD },
  tagsSection: { marginTop: 14 },
  tagsLabel: { fontSize: 11, fontWeight: '600', marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '500' },
  badgesSection: { backgroundColor: '#fff', padding: 20 },
  badgesLabel: { fontSize: 13, color: '#888', marginBottom: 12 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { width: '47%', borderRadius: 14, padding: 14, alignItems: 'center' },
  badgeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: { fontSize: 11, textAlign: 'center' }, 

  recommendedSection: {
    backgroundColor: '#fff',
    padding: 18,
    marginTop: 12,
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 10,
  },

  recommendedTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 12,
    color: '#444',
    letterSpacing: 0.8,
  },

  recommendedCard: {
    backgroundColor: '#F6F8FF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: TAMUK_BLUE,
    flexDirection: 'row',
    alignItems: 'stretch',
    zIndex: 2,
  },

  cardContent: {
    flex: 1,
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },

  eventMeta: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  emptyText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },

  slashContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 12,
    gap: 8,
  },
  slash: {
    width: 8,
    height: 30,
    backgroundColor: '#FFB81C',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
    marginVertical: 2,
  },
});