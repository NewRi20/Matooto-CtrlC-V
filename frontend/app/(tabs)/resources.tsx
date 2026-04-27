import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import lessonsData from "@/constants/lessons.json";

type Subject = "english" | "math" | "science";

export default function ResourcesScreen() {
  const router = useRouter();

  const handleSubjectPress = (subject: Subject) => {
    router.push({
      pathname: "/resources/lessons" as any,
      params: { subject },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RESOURCES</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>SUBJECTS</Text>

        <View style={styles.gridContainer}>
          {/* Science Card */}
          <TouchableOpacity
            style={[styles.subjectCard, { backgroundColor: "#8D5524" }]}
            onPress={() => handleSubjectPress("science")}
          >
            <Ionicons
              name="flask-outline"
              size={40}
              color="#FFF"
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Science</Text>
            <Text style={styles.cardSubtitle}>
              {lessonsData.science.length} resources
            </Text>
          </TouchableOpacity>

          {/* Math Card */}
          <TouchableOpacity
            style={[styles.subjectCard, { backgroundColor: "#FFB300" }]}
            onPress={() => handleSubjectPress("math")}
          >
            <Ionicons
              name="calculator-outline"
              size={40}
              color="#333"
              style={styles.cardIcon}
            />
            <Text style={[styles.cardTitle, { color: "#333" }]}>Math</Text>
            <Text style={[styles.cardSubtitle, { color: "#333" }]}>
              {lessonsData.math.length} resources
            </Text>
          </TouchableOpacity>

          {/* English Card */}
          <TouchableOpacity
            style={[styles.subjectCard, { backgroundColor: "#146C43" }]}
            onPress={() => handleSubjectPress("english")}
          >
            <Ionicons
              name="book-outline"
              size={40}
              color="#FFF"
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>English</Text>
            <Text style={styles.cardSubtitle}>
              {lessonsData.english.length} resources
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FAF9F6",
    position: "relative",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#146C43",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#146C43",
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 15,
  },
  subjectCard: {
    width: "47%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#FFF",
    opacity: 0.9,
  },
});
