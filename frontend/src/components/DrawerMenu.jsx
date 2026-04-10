import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

// useAuth gives us the logout() function from AuthContext
// When logout() is called, Firebase signs the user out
// onAuthStateChanged fires with null → RootNavigator switches to AuthStack automatically
import { useAuth } from '../context/AuthContext';

const TAMUK_BLUE = '#003087';
const TAMUK_GOLD = '#FFB81C';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.78;

const menuSections = [
  {
    title: 'Account',
    items: [
      { key: 'EditProfile',   label: 'Edit Profile',          icon: 'pen-to-square' },
      { key: 'Verification',  label: 'Verify Student Status', icon: 'shield-halved' },
      { key: 'SavedEvents',   label: 'Saved Events',          icon: 'bookmark'      },
    ],
  },
  {
    title: 'App',
    items: [
      { key: 'Settings',      label: 'Settings',              icon: 'gear'          },
      { key: 'Notifications', label: 'Notifications',         icon: 'bell'          },
    ],
  },
];

export default function DrawerMenu({ visible, onClose, navigation, user }) {
  const slideAnim   = useRef(new Animated.Value(DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // Pull logout from AuthContext
  // This is the real Firebase signOut — no more TODO
  const { logout } = useAuth();

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0.55,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleNav = (screen) => {
    onClose();
    setTimeout(() => navigation.navigate(screen), 240);
  };

  const handleLogOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          onClose();
          // Wait for the drawer to close before signing out
          // so the animation isn't interrupted by the screen switching
          setTimeout(async () => {
            await logout();
            // No navigation needed — RootNavigator handles the switch
            // automatically when onAuthStateChanged fires with null
          }, 240);
        },
      },
    ]);
  };

  if (!visible) return null;

  return (
    <>
      {/* Dim backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
      </TouchableWithoutFeedback>

      {/* Drawer panel slides in from right */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <SafeAreaView style={styles.drawerInner}>

          {/* ── User Info Header ── */}
          <View style={styles.drawerHeader}>
            <View style={styles.headerTop}>
              <View style={styles.drawerAvatar}>
                <FontAwesome6 name="circle-user" size={44} color="#fff" />
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <FontAwesome6 name="xmark" size={20} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
            <View style={styles.drawerNameRow}>
              {/* user prop comes from AccountScreen which fetches real data from /me */}
              <Text style={styles.drawerName}>
                {user?.fullName ?? 'Loading...'}
              </Text>
              {user?.isVerified && (
                <View style={styles.verifiedBadge}>
                  <FontAwesome6 name="check" size={8} color="#fff" />
                </View>
              )}
            </View>
            <Text style={styles.drawerUsername}>
              {user?.username ?? ''}
            </Text>
            <Text style={styles.drawerMajor}>
              {user?.major ?? ''}{user?.year ? ` · ${user.year}` : ''}
            </Text>
          </View>

          {/* ── Nav Sections ── */}
          <View style={styles.navContent}>
            {menuSections.map((section, sIdx) => (
              <View key={section.title} style={[styles.section, sIdx > 0 && styles.sectionGap]}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.navItem}
                    onPress={() => handleNav(item.key)}
                    activeOpacity={0.65}
                  >
                    <View style={styles.navIconWrap}>
                      <FontAwesome6 name={item.icon} size={15} color={TAMUK_GOLD} solid />
                    </View>
                    <Text style={styles.navLabel}>{item.label}</Text>
                    <FontAwesome6 name="chevron-right" size={11} color="rgba(255,255,255,0.2)" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* ── Log Out ── */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <TouchableOpacity style={styles.logOutBtn} onPress={handleLogOut} activeOpacity={0.7}>
              <View style={[styles.navIconWrap, styles.logOutIcon]}>
                <FontAwesome6 name="right-from-bracket" size={15} color="#e05555" solid />
              </View>
              <Text style={styles.logOutLabel}>Log Out</Text>
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    top: 0, bottom: 0, right: 0,
    width: DRAWER_WIDTH,
    backgroundColor: TAMUK_BLUE,
    zIndex: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  drawerInner: { flex: 1 },
  drawerHeader: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  drawerAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: { padding: 4, marginTop: 4 },
  drawerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  drawerName:    { fontSize: 18, fontWeight: '700', color: '#fff' },
  verifiedBadge: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: TAMUK_GOLD,
    alignItems: 'center', justifyContent: 'center',
  },
  drawerUsername: { fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 2 },
  drawerMajor:    { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
  navContent: { flex: 1, paddingTop: 8 },
  section:    { paddingHorizontal: 20, paddingTop: 16 },
  sectionGap: { marginTop: 4 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  navIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  navLabel: { flex: 1, fontSize: 15, color: '#fff', fontWeight: '500' },
  footer: { paddingHorizontal: 20, paddingBottom: 12 },
  footerDivider: { height: 0.5, backgroundColor: 'rgba(255,255,255,0.12)', marginBottom: 8 },
  logOutBtn:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, gap: 14 },
  logOutIcon: { backgroundColor: 'rgba(220,50,50,0.15)' },
  logOutLabel:{ fontSize: 15, color: '#e05555', fontWeight: '500' },
});
