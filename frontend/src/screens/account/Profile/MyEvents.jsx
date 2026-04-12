import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';

import FormTemplate, {
  FormSection,
  FormActionRow,
} from '../Templates/SubPageTemplate'; // adjust path

// Example role flag (replace with auth context / redux / backend role)
const isAdmin = false;

export default function MyEventsPage() {
  // Mock previous attended events (replace with API data)
  const [pastEvents] = useState([
    {
      id: '1',
      title: 'Startup Networking Night',
      date: 'March 12, 2026',
      location: 'Dallas Innovation Hub',
    },
    {
      id: '2',
      title: 'Tech Talk: React Native',
      date: 'February 25, 2026',
      location: 'Coworking Space Downtown',
    },
    {
      id: '3',
      title: 'AI Builders Meetup',
      date: 'January 18, 2026',
      location: 'UTA Campus Hall',
    },
  ]);

  const handleViewEvent = (event) => {
    Alert.alert(event.title, `${event.date}\n${event.location}`);
  };

  const handleExport = () => {
    Alert.alert('Export', 'Event history exported successfully.');
  };

  return (
    <FormTemplate title="My Events">
      {/* Past Events List */}
      <FormSection label="Attended Events">
        {pastEvents.length === 0 ? (
          <View style={{ padding: 14 }}>
            <Text style={{ color: '#888' }}>
              You haven’t attended any events yet.
            </Text>
          </View>
        ) : (
          pastEvents.map((event, index) => (
            <FormActionRow
              key={event.id}
              icon="calendar-check"
              label={`${event.title} • ${event.date}`}
              onPress={() => handleViewEvent(event)}
              last={index === pastEvents.length - 1}
            />
          ))
        )}
      </FormSection>

      {/* Optional Admin Section */}
      {isAdmin && (
        <FormSection label="Admin Controls">
          <FormActionRow
            icon="download"
            label="Export Attendance Data"
            onPress={handleExport}
          />

          <FormActionRow
            icon="chart-line"
            label="View Event Analytics"
            onPress={() => Alert.alert('Analytics', 'Opening dashboard...')}
            last
          />
        </FormSection>
      )}

      {/* Info Section */}
      <FormSection label="Info">
        <View style={{ padding: 14 }}>
          <Text style={{ color: '#666', fontSize: 13, lineHeight: 18 }}>
            This page shows events you’ve previously attended.{"\n"}
            Only organization leaders can manage or delete events.
          </Text>
        </View>
      </FormSection>
    </FormTemplate>
  );
}