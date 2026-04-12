import { Alert, Linking } from "react-native";

import FormTemplate, {
  FormSection,
  FormActionRow,
} from "../Templates/SubPageTemplate";

export default function About() {
  const appVersion = "1.0.0";

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Cannot open link");
    }
  };

  return (
    <FormTemplate title="About">

      {/* App Info */}
      <FormSection label="App Information">
        <FormActionRow
          icon="mobile-screen"
          label="App Version"
          onPress={() => Alert.alert("Version", appVersion)}
        />

        <FormActionRow
          icon="circle-info"
          label="What is this app?"
          onPress={() =>
            Alert.alert(
              "About",
              "This app helps students discover, attend, and track campus events, while earning badges and building community engagement."
            )
          }
          last
        />
      </FormSection>

      {/* Developer */}
      <FormSection label="Developer">
        <FormActionRow
          icon="code"
          label="Built by TAMUK Dev Team"
          onPress={() =>
            Alert.alert(
              "Development",
              "This application is developed as part of a student-led project for campus engagement."
            )
          }
        />

        <FormActionRow
          icon="envelope"
          label="Contact Support"
          onPress={() => openLink("mailto:support@yourapp.com")}
          last
        />
      </FormSection>

      {/* Legal */}
      <FormSection label="Legal">
        <FormActionRow
          icon="shield-halved"
          label="Privacy Policy"
          onPress={() => openLink("https://yourapp.com/privacy")}
        />

        <FormActionRow
          icon="file-contract"
          label="Terms of Service"
          onPress={() => openLink("https://yourapp.com/terms")}
          last
        />
      </FormSection>

      {/* Actions */}
      <FormSection label="More">
        <FormActionRow
          icon="star"
          label="Rate App"
          onPress={() =>
            Alert.alert("Thanks!", "Redirecting to app store...")
          }
        />

        <FormActionRow
          icon="bug"
          label="Report a Problem"
          onPress={() =>
            Alert.alert("Feedback", "Send feedback flow goes here")
          }
          last
        />
      </FormSection>

    </FormTemplate>
  );
}