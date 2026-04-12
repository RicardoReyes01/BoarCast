import React, { useState } from 'react';
import { Alert } from 'react-native';

import FormTemplate, {
  FormSection,
  FormToggleRow,
  FormActionRow,
} from '../Templates/SubPageTemplate';

export default function Notifications() {
  // ─── Notification Settings State ───
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [eventReminders, setEventReminders] = useState(true);
  const [newEvents, setNewEvents] = useState(true);
  const [badgeAlerts, setBadgeAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // ─── Actions ───
  const handleTestNotification = () => {
    Alert.alert(
      'Test Notification',
      'This is what a push notification would look like!'
    );
  };

  const handleSave = () => {
    // later: send to backend API
    Alert.alert('Saved', 'Notification preferences updated');
  };

  return (
    <FormTemplate title="Notifications" onSave={handleSave}>
      {/* General */}
      <FormSection label="General">
        <FormToggleRow
          icon="bell"
          label="Push Notifications"
          sublabel="Receive alerts on your device"
          value={pushEnabled}
          onChange={setPushEnabled}
        />

        <FormToggleRow
          icon="envelope"
          label="Email Notifications"
          sublabel="Receive updates via email"
          value={emailEnabled}
          onChange={setEmailEnabled}
          last
        />
      </FormSection>

      {/* Event Updates */}
      <FormSection label="Event Updates">
        <FormToggleRow
          icon="calendar-check"
          label="Event Reminders"
          sublabel="Before events you RSVP’d to"
          value={eventReminders}
          onChange={setEventReminders}
        />

        <FormToggleRow
          icon="calendar-plus"
          label="New Events"
          sublabel="When new events are posted"
          value={newEvents}
          onChange={setNewEvents}
        />

        <FormToggleRow
          icon="trophy"
          label="Badge Unlocks"
          sublabel="When you earn new badges"
          value={badgeAlerts}
          onChange={setBadgeAlerts}
          last
        />
      </FormSection>

      {/* Email Preferences */}
      <FormSection label="Email Preferences">
        <FormToggleRow
          icon="newspaper"
          label="Marketing Emails"
          sublabel="Updates, promotions, announcements"
          value={marketingEmails}
          onChange={setMarketingEmails}
          last
        />
      </FormSection>

      {/* Actions */}
      <FormSection label="Actions">
        <FormActionRow
          icon="paper-plane"
          label="Send Test Notification"
          onPress={handleTestNotification}
        />

        <FormActionRow
          icon="trash"
          label="Reset to Default Settings"
          danger
          onPress={() =>
            Alert.alert(
              'Reset Settings',
              'This will restore default notification settings.'
            )
          }
          last
        />
      </FormSection>

      {/* Info */}
      <FormSection label="Info">
        <AlertBox />
      </FormSection>
    </FormTemplate>
  );
}

// ─── Small Info Component ───
function AlertBox() {
  return (
    <React.Fragment>
      <FormActionRow
        icon="circle-info"
        label="Notifications help you stay updated on events, badges, and campus activity."
        onPress={() => {}}
      />
    </React.Fragment>
  );
}