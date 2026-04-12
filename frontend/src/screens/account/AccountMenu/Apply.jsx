import React, { useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import MenuTemplate, { MenuItem } from '../Templates/MenuTemplate';

export default function Apply() {
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitApplication = async () => {
    if (!agree) {
      Alert.alert('Required', 'You must agree to continue.');
      return;
    }

    try {
      setLoading(true);

      // 🔌 replace with your backend
      await fetch('YOUR_BACKEND_URL/apply-org-leader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreeToRules: agree,
        }),
      });

      Alert.alert(
        'Application Sent',
        'Your request is now pending review.'
      );

      setAgree(false);
    } catch (err) {
      Alert.alert('Error', 'Could not submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuTemplate title="Org Leader Application">

      {/* INFO CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Upgrade to Org Leader</Text>
        <Text style={styles.subtitle}>
          Org Leaders can create events, manage members, and award badges.
        </Text>
      </View>

      {/* PERMISSIONS PREVIEW */}
      <View style={styles.card}>
        <MenuItem icon="calendar-plus" label="Create & manage events" />
        <MenuItem icon="users" label="Manage members" />
        <MenuItem icon="medal" label="Award badges" />
        <MenuItem icon="chart-line" label="View analytics" />
      </View>

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
      </View>

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