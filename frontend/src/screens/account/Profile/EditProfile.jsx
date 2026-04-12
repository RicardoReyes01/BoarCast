import React, { useState } from 'react';
import FormTemplate, {
  FormSection,
  FormFieldRow,
  FormToggleRow,
  FormActionRow,
} from '../Templates/SubPageTemplate'; // adjust path

export default function EditProfileScreen() {
  const [firstName, setFirstName] = useState('Jamie');
  const [lastName, setLastName]   = useState('Dawson');
  const [bio, setBio]             = useState('');
  const [isPublic, setIsPublic]   = useState(true);
  const [saving, setSaving]       = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // ... your Firestore updateDoc logic here
    setSaving(false);
  };

  return (
    <FormTemplate title="Edit Profile" onSave={handleSave} saving={saving}>

      <FormSection label="Account">
        <FormFieldRow icon="user"       label="First name" value={firstName} onChangeText={setFirstName} placeholder="First name" autoCapitalize="words" />
        <FormFieldRow icon="user"       label="Last name"  value={lastName}  onChangeText={setLastName}  placeholder="Last name"  autoCapitalize="words" />
        <FormFieldRow icon="align-left" label="Bio"        value={bio}       onChangeText={setBio}       placeholder="Add a bio..." multiline last />
      </FormSection>

      <FormSection label="Privacy">
        <FormToggleRow icon="globe" label="Public profile" sublabel="Anyone can view your profile" value={isPublic} onChange={setIsPublic} last />
      </FormSection>

      <FormSection label="Account actions">
        <FormActionRow icon="trash" label="Delete account" danger onPress={() => {}} last />
      </FormSection>

    </FormTemplate>
  );
}