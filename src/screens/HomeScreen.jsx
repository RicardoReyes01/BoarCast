import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  // Mock data - replace with your actual data source
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Talk: AI in Education',
      organization: 'Computer Science Club',
      date: 'Feb 20',
      time: '6:00 PM',
      location: 'Student Center 301',
      attendees: 45,
      color: '#FF6B6B',
      category: 'Academic',
    },
    {
      id: 2,
      title: 'Spring Mixer Social',
      organization: 'Student Activities Board',
      date: 'Feb 22',
      time: '8:00 PM',
      location: 'Campus Quad',
      attendees: 120,
      color: '#4ECDC4',
      category: 'Social',
    },
  ];

  const categories = ['All', 'Academic', 'Social', 'Sports', 'Service', 'Arts'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>BoarCast</Text>
          <Text style={styles.subtitle}>Discover campus events</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitials}>RR</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events, organizations..."
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterChip, activeFilter === category && styles.filterChipActive]}
              onPress={() => setActiveFilter(category)}
            >
              <Text style={[styles.filterText, activeFilter === category && styles.filterTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Event Cards */}
        {upcomingEvents.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
            
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
                  <Text style={styles.eventDetailIcon}>⏰</Text>
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Text style={styles.eventDetailIcon}>📍</Text>
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
              </View>

              <View style={styles.eventFooter}>
                <View style={styles.attendeesInfo}>
                  <Text style={styles.attendeesIcon}>👥</Text>
                  <Text style={styles.attendeesText}>{event.attendees} going</Text>
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
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFF',
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
  profileButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
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
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
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
    height: 6,
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
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F57C00',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  eventOrganization: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 14,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailIcon: {
    fontSize: 14,
    marginRight: 6,
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
  attendeesIcon: {
    fontSize: 16,
    marginRight: 6,
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