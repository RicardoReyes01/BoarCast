import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function MenuTemplate({ title, children }) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function MenuItem({ icon, label, onPress, danger }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <View style={styles.itemLeft}>
        <FontAwesome6
          name={icon}
          size={16}
          color={danger ? "#E53935" : "#333"}
        />
        <Text style={[styles.itemText, danger && { color: "#E53935" }]}>
          {label}
        </Text>
      </View>

      <FontAwesome6 name="chevron-right" size={14} color="#aaa" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  /* 🔵 modern header */
  header: {
    backgroundColor: "#0202df",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  content: {
    padding: 16,
    gap: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  itemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
});
