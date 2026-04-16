import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import MenuTemplate, { MenuItem } from '../Templates/MenuTemplate';
import { db, auth } from "../../../FirebaseFrontend";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  onSnapshot
} from "firebase/firestore";

export default function Apply({ navigation }) {
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // New state to track the user's role
  const [role, setRole] = useState(null);

  /*
    Fetch the user's role in real-time.
    This ensures the UI updates immediately if an admin upgrades the user.
  */
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setRole(docSnap.data().role);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const submitApplication = async () => {
    if (!agree) {
      Alert.alert('Required', 'You must agree to continue.');
      return;
    }

    try {
      setLoading(true);

      // Check if user has already applied
      const q = query(
        collection(db, "applications"),
        where("userId", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Alert.alert(
          "Already Applied",
          "You can only submit one application."
        );
        return;
      }

      // Create a new application document in Firestore with status "pending"
      await addDoc(collection(db, "applications"), {
        userId: auth.currentUser.uid,
        status: "pending",
        agreeToRules: true,
        createdAt: serverTimestamp()
      });

      Alert.alert(
        'Application Sent',
        'Your request is now pending review.'
      );

      setAgree(false);
    } catch (err) {
      console.log("APPLICATION ERROR:", err);
      Alert.alert('Error', err.message || 'Could not submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuTemplate title="Org Leader Application">

      {/* 
        INFO CARD
        This section dynamically changes based on whether the user is an org leader
      */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {role === "org_leader"
            ? "You have been upgraded to Org Leader!"
            : "Upgrade to Org Leader"}
        </Text>

        <Text style={styles.subtitle}>
          {role === "org_leader"
            ? "You can now create and manage events by filling out an event form."
            : "Org Leaders can create events, manage members, and award badges."}
        </Text>
      </View>

      {/* 
        PERMISSIONS / EVENT MANAGEMENT
        Only visible to users with org_leader role
      */}
      {role === "org_leader" && (
        <View style={styles.card}>
          <MenuItem
            icon="calendar-plus"
            label="Create & manage events"
            onPress={() => navigation.navigate("EventManagement")}
          />
        </View>
      )}

      {/* 
        APPLICATION SECTION
        Hidden if the user is already an org leader
      */}
      {role !== "org_leader" && (
        <>
          {/* AGREEMENT */}
          <View style={styles.card}>
            <View style={styles.agreeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.agreeTitle}>
                  I agree to community rules
                </Text>
                <Text style={styles.agreeSub}>
                  Misuse of privileges may result in removal
                </Text>
              </View>

              <Switch
                value={agree}
                onValueChange={setAgree}
                trackColor={{ false: '#ddd', true: '#003087' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* SUBMIT */}
          <View style={styles.card}>
            <MenuItem
              icon={loading ? 'spinner' : 'paper-plane'}
              label={loading ? 'Submitting...' : 'Submit Application'}
              onPress={submitApplication}
            />

            <MenuItem
              icon="shield"
              label="Open Admin Panel (Test)"
              onPress={() => navigation.navigate("AdminApplications")}
            />
          </View>
        </>
      )}

    </MenuTemplate>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    padding: 14,
    paddingBottom: 6,
  },

  subtitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 14,
    paddingBottom: 14,
    lineHeight: 18,
  },

  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  agreeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },

  agreeSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
};