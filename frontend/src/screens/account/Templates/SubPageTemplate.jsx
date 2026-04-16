import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// ─── FormTemplate ─────────────────────────────────────────────────────────────
// Drop-in wrapper for any sub-page form screen.
//
// Props:
//   title       string           Screen title shown in the header
//   onSave      function         Called when Save is tapped (omit to hide Save button)
//   saving      bool             Shows a spinner in place of Save while true
//   children    ReactNode        Compose with FormSection, FormFieldRow, etc.
//
// Usage:
//   <FormTemplate title="Edit Profile" onSave={handleSave} saving={saving}>
//     <FormSection label="Account">
//       <FormFieldRow icon="user" label="Name" value={name} onChangeText={setName} last />
//     </FormSection>
//   </FormTemplate>

export default function FormTemplate({ title, onSave, saving, children }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header — same look as MenuTemplate */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerSide}
        >
          <FontAwesome6 name="chevron-left" size={16} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{title}</Text>

        <View style={styles.headerSide}>
          {onSave &&
            (saving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <TouchableOpacity onPress={onSave}>
                <Text style={styles.headerAction}>Save</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {children}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── FormSection ──────────────────────────────────────────────────────────────
// Labelled card group. Wrap any rows inside it.
//
// Props:
//   label     string       Section header label (uppercased automatically)
//   children  ReactNode

export function FormSection({ label, children }) {
  return (
    <>
      {label && <Text style={styles.sectionLabel}>{label}</Text>}
      <View style={styles.card}>{children}</View>
    </>
  );
}

// ─── FormFieldRow ─────────────────────────────────────────────────────────────
// A labelled text input row inside a FormSection.
//
// Props:
//   icon          string     FontAwesome6 icon name
//   label         string     Left-side label
//   last          bool       Omits the bottom divider on the last row
//   ...rest                  All standard TextInput props (value, onChangeText, etc.)

export function FormFieldRow({ icon, label, last, multiline, ...inputProps }) {
  return (
    <View
      style={[
        styles.row,
        !last && styles.rowBorder,
        multiline && { alignItems: "flex-start" },
      ]}
    >
      <View style={styles.rowLeft}>
        <FontAwesome6
          name={icon}
          size={16}
          color="#333"
          style={{ width: 22 }}
        />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMulti]}
        placeholderTextColor="#bbb"
        multiline={multiline}
        {...inputProps}
      />
    </View>
  );
}

// ─── FormToggleRow ────────────────────────────────────────────────────────────
// A labelled toggle/switch row inside a FormSection.
//
// Props:
//   icon      string     FontAwesome6 icon name
//   label     string     Primary label
//   sublabel  string     Optional secondary line
//   value     bool       Current switch value
//   onChange  function   Called with new bool value
//   last      bool       Omits the bottom divider on the last row

export function FormToggleRow({
  icon,
  label,
  sublabel,
  value,
  onChange,
  last,
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <FontAwesome6
          name={icon}
          size={16}
          color="#333"
          style={{ width: 22 }}
        />
        <View>
          <Text style={styles.rowLabel}>{label}</Text>
          {sublabel && <Text style={styles.rowSublabel}>{sublabel}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: "#ddd", true: "#0202df" }}
        thumbColor="#fff"
      />
    </View>
  );
}

// ─── FormActionRow ────────────────────────────────────────────────────────────
// A tappable row (like MenuItem) for actions inside a FormSection.
//
// Props:
//   icon      string     FontAwesome6 icon name
//   label     string     Row label
//   onPress   function
//   danger    bool       Renders label and icon in red
//   last      bool       Omits the bottom divider on the last row

export function FormActionRow({ icon, label, onPress, danger, last }) {
  const color = danger ? "#E53935" : "#333";
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.row, !last && styles.rowBorder]}
    >
      <View style={styles.rowLeft}>
        <FontAwesome6
          name={icon}
          size={16}
          color={color}
          style={{ width: 22 }}
        />
        <Text style={[styles.rowLabel, danger && { color: "#E53935" }]}>
          {label}
        </Text>
      </View>
      <FontAwesome6 name="chevron-right" size={14} color="#aaa" />
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  // Header
  header: {
    backgroundColor: "#0202df",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerSide: {
    width: 50,
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    textAlign: "center",
    flex: 1,
  },
  headerAction: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },

  // Scroll content
  content: {
    padding: 16,
    gap: 8,
  },

  // Section label
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#888",
    marginTop: 10,
    marginBottom: 4,
    marginLeft: 4,
  },

  // Card — same shadow style as MenuTemplate
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  // Shared row
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
  rowSublabel: {
    fontSize: 12,
    color: "#999",
    marginTop: 1,
  },

  // Field input
  fieldInput: {
    fontSize: 15,
    color: "#444",
    textAlign: "right",
    flex: 1,
  },
  fieldInputMulti: {
    textAlign: "left",
    minHeight: 60,
    paddingTop: 2,
  },
});
