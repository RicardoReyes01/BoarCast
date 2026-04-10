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

//Account settings 
import AccountMenu from '../../components/AccountMenu';

// useAuth gives us currentUser (Firebase user object) and getToken (fetches ID token)
// currentUser.email is available immediately from Firebase
// The full profile (name, role, etc.) comes from our backend /me route
import { useAuth } from '../../context/AuthContext';

const TAMUK_BLUE = '#003087';
const TAMUK_GOLD = '#FFB81C';

// Replace with your actual server IP
const SERVER_URL = 'https://boarcast-production.up.railway.app';

const interestTags = [
  { label: 'Greek Life', bg: '#F4C0D1', color: '#72243E' },
  { label: 'Academic',   bg: '#CECBF6', color: '#3C3489' },
  { label: 'Music',      bg: '#AFA9EC', color: '#26215C' },
  { label: 'Sports',     bg: '#9FE1CB', color: '#085041' },
  { label: 'Food',       bg: '#FAC775', color: '#633806' },
];

const badges = [
  { id: 1, label: 'First Event',       icon: 'star',         bg: '#f0f4ff', iconBg: TAMUK_BLUE,  iconColor: TAMUK_GOLD,  locked: false },
  { id: 2, label: 'Night Owl',         icon: 'moon',         bg: '#fff8e6', iconBg: TAMUK_GOLD,  iconColor: TAMUK_BLUE,  locked: false },
  { id: 3, label: 'Social Butterfly',  icon: 'user-group',   bg: '#eaf3de', iconBg: '#3B6D11',   iconColor: '#fff',      locked: false },
  { id: 4, label: 'Campus Fan',        icon: 'heart',        bg: '#fbeaf0', iconBg: '#993556',   iconColor: '#fff',      locked: false },
  { id: 5, label: 'Explorer',          icon: 'lock',         bg: '#f5f5f5', iconBg: '#bbb',      iconColor: '#fff',      locked: true  },
  { id: 6, label: 'Streak Master',     icon: 'lock',         bg: '#f5f5f5', iconBg: '#bbb',      iconColor: '#fff',      locked: true  },
];

export default function AccountScreen({ navigation }) {
  // profile holds the data fetched from our backend /me route
  // null means not loaded yet, object means loaded successfully
  const [profile, setProfile] = useState(null);

  // loading tracks whether we're still waiting for the backend response
  const [loading, setLoading] = useState(true);

  // Pull getToken from AuthContext so we can attach the token to our request
  const authContext = useAuth();

  // menu_open controls whether the right side menu is open
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the user's ID token — this proves to the backend who they are
        const token = await authContext.getToken();

        // Call GET /me on our backend
        // The Authorization header is how we send the token
        // verifyToken middleware on the backend checks this before returning data
        const response = await fetch(`${SERVER_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          // Store the profile data — now we have real name, email, role etc.
          setProfile(data);
        } else {
          console.error('Failed to fetch profile:', data.error);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        // Always stop the loading spinner whether it succeeded or failed
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // empty array means this only runs once when the screen first loads

  // Show a spinner while waiting for the backend to respond
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={TAMUK_BLUE} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Blue Header ── */}
        <View style={styles.header}>
          {/* Show real email from profile, fallback to empty string while loading */}
          <Text style={styles.username}>
            {profile?.email ?? ''}
          </Text>
          <TouchableOpacity onPress={() => setMenuOpen(true)}>
            <FontAwesome6 name="bars" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Gold Profile Band ── */}
        <View style={styles.profileBand}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <FontAwesome6 name="circle-user" size={52} color="#fff" />
            </View>

            <View style={styles.profileInfo}>
              {/* Real name from Firestore profile */}
              <Text style={styles.fullName}>
                {profile?.name ?? 'Unknown'}
              </Text>
              {/* Role from Firestore — "student" or "admin" */}
              <Text style={styles.majorText}>
                {profile?.role === 'admin' ? 'Admin' : 'Student'}
              </Text>
              <View style={styles.eventsBadge}>
                {/* rsvps array length tells us how many events they've attended */}
                <Text style={styles.eventsBadgeText}>
                  {profile?.rsvps?.length ?? 0} events attended
                </Text>
              </View>
            </View>
          </View>

          {/* Interest Tags — hardcoded for now, can be stored in Firestore later */}
          <View style={styles.tagsSection}>
            <Text style={styles.tagsLabel}>INTERESTS</Text>
            <View style={styles.tagsRow}>
              {interestTags.map((tag) => (
                <View key={tag.label} style={[styles.tag, { backgroundColor: tag.bg }]}>
                  <Text style={[styles.tagText, { color: tag.color }]}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Badges Grid ── hardcoded for now, can be stored in Firestore later */}
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
  username: { color: '#fff', fontSize: 18, fontWeight: '500', letterSpacing: 0.5 },
  menuBtn: { gap: 5, padding: 4 },
  menuLine: { width: 22, height: 2, backgroundColor: '#fff', borderRadius: 2 },
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
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: TAMUK_BLUE,
    borderWidth: 3, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: 3 },
  fullName: { fontSize: 16, fontWeight: '600', color: TAMUK_BLUE },
  majorText: { fontSize: 13, color: '#1a3a6e' },
  eventsBadge: {
    alignSelf: 'flex-start',
    backgroundColor: TAMUK_BLUE,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  eventsBadgeText: { fontSize: 11, color: TAMUK_GOLD, fontWeight: '500' },
  tagsSection: { marginTop: 14 },
  tagsLabel: { fontSize: 11, fontWeight: '600', color: '#1a3a6e', letterSpacing: 0.6, marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 12, fontWeight: '500' },
  badgesSection: { backgroundColor: '#fff', padding: 20 },
  badgesLabel: { fontSize: 13, fontWeight: '500', color: '#888', letterSpacing: 0.6, marginBottom: 12 },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: { width: '47%', borderRadius: 14, padding: 14, alignItems: 'center', gap: 6 },
  badgeIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  badgeLabel: { fontSize: 11, fontWeight: '500', color: '#333', textAlign: 'center' },
});
