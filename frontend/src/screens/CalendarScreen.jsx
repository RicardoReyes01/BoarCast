import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseFrontend";

LocaleConfig.locales.custom = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  today: "Today",
};

LocaleConfig.defaultLocale = "custom";

export default function CalendarScreen() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getToday());

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const firebaseEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(firebaseEvents);
    });

    return () => unsub();
  }, []);

  const markedDates = useMemo(() => {
    const marks = {};

    events.forEach((event) => {
      const dateKey = toDateKey(event.date);
      if (!dateKey) return;

      marks[dateKey] = {
        ...(marks[dateKey] || {}),
        marked: true,
        dotColor: "#0B5CAD",
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#0B5CAD",
    };

    return marks;
  }, [events, selectedDate]);

  const selectedEvents = events.filter(
    (event) => toDateKey(event.date) === selectedDate
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Event Calendar</Text>
          <Text style={styles.headerSubtitle}>Tap a date to view events</Text>
        </View>

        <View style={styles.calendarCard}>
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              arrowColor: "#0B5CAD",
              monthTextColor: "#0B5CAD",
              textDayHeaderFontWeight: "700",
              textDayHeaderFontSize: 18,
              textMonthFontSize: 22,
              textMonthFontWeight: "700",
              todayTextColor: "#0B5CAD",
              selectedDayTextColor: "#fff",
              dotColor: "#0B5CAD",
              textSectionTitleColor: "#0B5CAD",
            }}
            style={styles.calendar}
          />
        </View>

        <View style={styles.eventsCard}>
          <Text style={styles.eventsTitle}>
            Events for {formatPrettyDate(selectedDate)}
          </Text>

          {selectedEvents.length === 0 ? (
            <Text style={styles.noEvents}>No events for this day.</Text>
          ) : (
            selectedEvents.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventAccent} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventName}>
                    {event.title || "Untitled Event"}
                  </Text>

                  {event.time ? (
                    <Text style={styles.eventText}>Time: {event.time}</Text>
                  ) : null}

                  {event.description ? (
                    <Text style={styles.eventText}>{event.description}</Text>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getToday() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toDateKey(dateValue) {
  if (!dateValue) return null;

  if (typeof dateValue === "string") return dateValue;

  if (dateValue.toDate) {
    const date = dateValue.toDate();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return null;
}

function formatPrettyDate(dateString) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  headerCard: {
    backgroundColor: "#0B5CAD",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#E6EEF8",
    fontSize: 16,
    marginTop: 6,
  },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  calendar: {
    borderRadius: 20,
  },
  eventsCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  eventsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B5CAD",
    marginBottom: 16,
  },
  noEvents: {
    fontSize: 16,
    color: "#666",
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  eventAccent: {
    width: 8,
    backgroundColor: "#F4B400",
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  eventText: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 2,
  },
});
