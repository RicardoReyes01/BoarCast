import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseFrontend";

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  // Live events from Firestore
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  /*
    Real-time listener for events collection
  */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort newest first (safe check for missing createdAt)
      eventsData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setUpcomingEvents(eventsData);
    });

    return () => unsub();
  }, []);

  const categories = ['All', 'Academic', 'Social', 'Sports', 'Greek', 'Service', 'Arts', 'Food', 'Technology', 'Games', 'Other'];

  /*
    Filter logic
  */
  const filteredEvents =
    activeFilter === 'All'
      ? upcomingEvents
      : upcomingEvents.filter(event => event.category === activeFilter);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>BoarCast</Text>
          <Text style={styles.subtitle}>Discover campus events</Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/boarcast-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome6 name="magnifying-glass" size={14} color="#000000" />
        <TextInput
          style={styles.searchInput}
          placeholder=" Search events, organizations..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                activeFilter === category && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter(category)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === category && styles.filterTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Event Cards */}
        {filteredEvents.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={[styles.eventColorBar, { backgroundColor:'#0202df' }]} />

            <View style={styles.eventContent}>

              <View style={styles.eventHeader}>
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDateText}>{event.date}</Text>
                </View>

                <View style={styles.eventBadge}>
                  <Text style={styles.eventBadgeText}>{event.category}</Text>
                </View>
              </View>

              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventOrganization}>{event.organization}</Text>

              <View style={styles.eventDetails}>
                <View style={styles.eventDetail}>
                  <FontAwesome6 name="clock" size={14} color="#000000" />
                  <Text style={styles.eventDetailText}> {event.time}</Text>
                </View>

                <View style={styles.eventDetail}>
                  <FontAwesome6 name="location-dot" size={14} color="#000000" />
                  <Text style={styles.eventDetailText}> {event.location}</Text>
                </View>
              </View>

              <View style={styles.eventFooter}>
                <View style={styles.attendeesInfo}>
                  <FontAwesome6 name="people-group" size={14} color="#000000" />
                  <Text style={styles.attendeesText}>
                    {' '}
                    {event.attendees || 0} going
                  </Text>
                </View>

                <TouchableOpacity style={styles.rsvpButton}>
                  <Text style={styles.rsvpButtonText}>RSVP</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },

  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#FFB81C',
    borderRadius: 100, // slightly larger since we're scaling up
    padding: 2,       // gives breathing room around logo
    marginLeft: 0,   // moves it slightly left
  },

  logo: {
    width: 52,
    height: 52,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#E5E5E5',
  },
  filterChipActive: {
    backgroundColor: '#1A1A1A',
    borderColor: '#1A1A1A',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#FFF',
  },
  eventCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  eventColorBar: {
    height: 14,
    backgroundColor: '#003087',
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventDateBox: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  eventBadge: {
    backgroundColor: '#286ff588',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003087',
  },

  eventTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    backgroundColor: '#FFB81C',
    padding: 10,
    borderRadius: 8,
  },

  eventOrganization: {
    marginTop: 4,
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },

  eventDetails: {
    marginBottom: 14,
  },

  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  eventDetailText: {
    fontSize: 14,
    color: '#555',
  },

  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },

  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  attendeesText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  rsvpButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },

  rsvpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
});