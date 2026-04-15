import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../src/FirebaseFrontend";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);

  // Fetch applications + attach user names
  const fetchApps = async () => {
    try {
      const q = query(
        collection(db, "applications"),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      const rawApps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //fetch user data for each application
      const enrichedApps = await Promise.all(
        rawApps.map(async (app) => {
          try {
            const userRef = doc(db, "users", app.userId);
            const userSnap = await getDoc(userRef);

            const userData = userSnap.exists() ? userSnap.data() : null;

            return {
              ...app,
              userName: userData?.name || "Unknown User",
            };
          } catch (err) {
            return {
              ...app,
              userName: "Unknown User",
            };
          }
        })
      );

      setApps(enrichedApps);
    } catch (err) {
      console.log("FETCH ERROR:", err);
      Alert.alert("Error", "Could not load applications");
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const approveUser = async (app) => {
    try {
      await updateDoc(doc(db, "applications", app.id), {
        status: "approved",
      });

      await updateDoc(doc(db, "users", app.userId), {
        role: "org_leader",
      });

      fetchApps();
    } catch (err) {
      console.log("APPROVE ERROR:", err);
      Alert.alert("Error", "Could not approve user");
    }
  };

  const rejectUser = async (app) => {
    try {
      await updateDoc(doc(db, "applications", app.id), {
        status: "rejected",
      });

      fetchApps();
    } catch (err) {
      console.log("REJECT ERROR:", err);
      Alert.alert("Error", "Could not reject user");
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
        Pending Applications
      </Text>

      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ marginBottom: 5, fontWeight: "600" }}>
              Name: {item.userName}
            </Text>

            <Text style={{ marginBottom: 5 }}>
              User ID: {item.userId}
            </Text>

            <Text style={{ marginBottom: 10 }}>
              Status: {item.status}
            </Text>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button
                title="Approve"
                onPress={() => approveUser(item)}
              />

              <Button
                title="Reject"
                onPress={() => rejectUser(item)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}