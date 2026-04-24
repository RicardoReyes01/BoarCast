import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import MenuTemplate, { MenuItem } from "../Templates/MenuTemplate";
import { db, auth } from "../../../FirebaseFrontend";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc // Added for editing
} from "firebase/firestore";

export default function EventManagement() {
  // Create form state
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // Track editing state
  const [editingEventId, setEditingEventId] = useState(null);

  // User events
  const [events, setEvents] = useState([]);

  /*
    Fetch only events created by this user
  */
  useEffect(() => {
    const q = query(
      collection(db, "events"),
      where("createdBy", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const userEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(userEvents);
    });

    return () => unsub();
  }, []);

  /*
    Create event
  */
  const createEvent = async () => {
    if (!title || !organization || !date || !time || !location || !category) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        title,
        organization,
        date,
        time,
        location,
        category,
        attendees: 0,
        color: "#0000FF",
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Event created.");
      clearForm();

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not create event.");
    }
  };

  /*
    Update existing event
  */
  const updateEvent = async () => {
    if (!editingEventId) return;

    try {
      await updateDoc(doc(db, "events", editingEventId), {
        title,
        organization,
        date,
        time,
        location,
        category,
      });

      Alert.alert("Updated", "Event updated.");
      clearForm();

    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not update event.");
    }
  };

  /*
    Load event into form for editing
  */
  const startEditing = (event) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setOrganization(event.organization);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setCategory(event.category);
  };

  /*
    Clear form and reset editing state
  */
  const clearForm = () => {
    setEditingEventId(null);
    setTitle("");
    setOrganization("");
    setDate("");
    setTime("");
    setLocation("");
    setCategory("");
  };

  /*
    Delete event
  */
  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      Alert.alert("Deleted", "Event removed.");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not delete event.");
    }
  };

  return (
    <MenuTemplate title="Event Management">

      {/* CREATE / EDIT EVENT SECTION */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {editingEventId ? "Edit Event" : "Create Event"}
        </Text>

        <TextInput placeholder="Event Title" style={styles.input} onChangeText={setTitle} value={title} />
        <TextInput placeholder="Organization" style={styles.input} onChangeText={setOrganization} value={organization} />
        <TextInput placeholder="Date (YYYY-MM-DD)" style={styles.input} onChangeText={setDate} value={date} />
        <TextInput placeholder="Time (6:00 PM)" style={styles.input} onChangeText={setTime} value={time} />
        <TextInput placeholder="Location" style={styles.input} onChangeText={setLocation} value={location} />
        <TextInput placeholder="Category" style={styles.input} onChangeText={setCategory} value={category} />

        {/* Create or Update button switches dynamically */}
        <MenuItem
          icon={editingEventId ? "pen" : "calendar-plus"}
          label={editingEventId ? "Update Event" : "Create Event"}
          onPress={editingEventId ? updateEvent : createEvent}
        />

        {/* Cancel editing option */}
        {editingEventId && (
          <MenuItem
            icon="xmark"
            label="Cancel Editing"
            onPress={clearForm}
          />
        )}
      </View>

      <Text style={styles.categoryInfo}>
        Categories: Academic, Social, Sports, Greek, Service, Arts, Food, Technology, Games, Other
      </Text>

      {/* MANAGE EVENTS SECTION */}
      <View style={styles.card}>
        <Text style={styles.title}>Your Events</Text>

        {events.length === 0 && (
          <Text style={styles.emptyText}>No events created yet.</Text>
        )}

        {events.map((event) => (
          <View key={event.id} style={styles.eventRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventSub}>
                {event.date} • {event.time}
              </Text>
            </View>

            {/* Edit button */}
            <MenuItem
              icon="pen"
              label="Edit"
              onPress={() => startEditing(event)}
            />

            {/* Delete button */}
            <MenuItem
              icon="trash"
              label="Delete"
              onPress={() => deleteEvent(event.id)}
            />
          </View>
        ))}
      </View>

    </MenuTemplate>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: -5,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    padding: 14,
    backgroundColor: '#FFB81C',
  },

  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  eventSub: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  emptyText: {
    padding: 14,
    color: "#888",
  },

  categoryInfo: {
    fontSize: 12,
    color: '#888',
    marginVertical: 10,
    textAlign: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,  
    paddingVertical: 8,
  },
};