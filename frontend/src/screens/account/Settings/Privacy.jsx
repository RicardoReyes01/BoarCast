import React, { useState } from "react";
import { Alert } from "react-native";

import FormTemplate, {
  FormSection,
  FormToggleRow,
  FormActionRow,
} from "../Templates/SubPageTemplate";

export default function Privacy() {
  // ─── Privacy Settings State ───
  const [profileVisible, setProfileVisible] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleExportData = () => {
    Alert.alert(
      "Export Data",
      "Your data export request has been submitted."
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is irreversible. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Account deleted"),
        },
      ]
    );
  };

  return (
    <FormTemplate title="Privacy & Security">
      {/* Visibility */}
      <FormSection label="Visibility">
        <FormToggleRow
          icon="user"
          label="Public Profile"
          sublabel="Allow others to view your profile"
          value={profileVisible}
          onChange={setProfileVisible}
        />

        <FormToggleRow
          icon="eye"
          label="Show Activity Status"
          sublabel="Let others see when you're active"
          value={showActivity}
          onChange={setShowActivity}
        />
      </FormSection>

      {/* Communication */}
      <FormSection label="Communication">
        <FormToggleRow
          icon="message"
          label="Allow Messages"
          sublabel="Let other users message you"
          value={allowMessages}
          onChange={setAllowMessages}
        />
      </FormSection>

      {/* Data */}
      <FormSection label="Data & Privacy">
        <FormToggleRow
          icon="database"
          label="Data Sharing"
          sublabel="Share anonymous usage data for improvements"
          value={dataSharing}
          onChange={setDataSharing}
        />
      </FormSection>

      {/* Actions */}
      <FormSection label="Account Actions">
        <FormActionRow
          icon="download"
          label="Export My Data"
          onPress={handleExportData}
        />

        <FormActionRow
          icon="trash"
          label="Delete Account"
          danger
          onPress={handleDeleteAccount}
          last
        />
      </FormSection>

      {/* Info */}
      <FormSection label="Info">
        <React.Fragment>
          <FormActionRow
            icon="shield"
            label="Privacy Policy"
            onPress={() => Alert.alert("Privacy Policy", "Open policy page")}
          />
          <FormActionRow
            icon="lock"
            label="Security Tips"
            onPress={() => Alert.alert("Security", "Show tips screen")}
            last
          />
        </React.Fragment>
      </FormSection>
    </FormTemplate>
  );
}