import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

// Temporary map that likely will be changed.
// If map isnt appearing make sure install: npx expo install 
// react-native-calendars and it showed appear
 
export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          console.log("Selected day:", day.dateString);
        }}
        markedDates={{
          "2024-03-20": { selected: true, marked: true },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#ffffff",
  },
});
