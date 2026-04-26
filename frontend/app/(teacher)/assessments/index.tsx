import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { db } from "../../../service/firebaseConfig";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { useAuth } from "../../../hooks/useAuth";

interface Assessment {
  id: string;
  className: string;
  story: string;
  questions: any[];
  dueDate: string;
  status: "active" | "scheduled";
}

export default function AssessmentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch assessments when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const fetchAssessments = async () => {
        try {
          if (!user?.uid) return;

          const q = query(
            collection(db, "assessments"),
            where("teacherId", "==", user.uid),
          );
          const querySnapshot = await getDocs(q);
          const assessmentsList: Assessment[] = [];

          querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            assessmentsList.push({
              id: docSnap.id,
              className: data.className || "Untitled",
              story: data.story || "",
              questions: data.questions || [],
              dueDate: data.dueDate || "No date",
              status: data.status || "active",
            });
          });

          setAssessments(assessmentsList);
        } catch (error) {
          console.error("Error fetching assessments:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAssessments();
    }, [user?.uid])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assessments</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Manage Assessments</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#146C43" />
            <Text style={styles.loadingText}>Loading assessments...</Text>
          </View>
        ) : assessments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No assessments yet</Text>
            <Text style={styles.emptySubText}>
              Create your first assessment to get started
            </Text>
          </View>
        ) : (
          assessments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="document-text" size={24} color="#146C43" />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.className}</Text>
                  <Text style={styles.cardSub}>
                    {item.questions.length} questions
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.dueText}>Due: {item.dueDate}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === "active"
                      ? styles.badgeActive
                      : styles.badgeScheduled,
                  ]}
                >
                  <Text
                    style={
                      item.status === "active"
                        ? styles.badgeTextActive
                        : styles.badgeTextScheduled
                    }
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 100 }} /> {/* Padding for FAB */}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(teacher)/assessments/create")}
      >
        <Ionicons name="add" size={30} color="#FFF" />
        <Text style={styles.fabText}>Create New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  header: {
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#146C43" },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: { marginTop: 15, color: "#666", fontSize: 16 },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
  },
  emptySubText: { fontSize: 14, color: "#666", marginTop: 8 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  cardInfo: { marginLeft: 15, flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardSub: { fontSize: 14, color: "#666", marginTop: 4 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  dueText: { fontSize: 12, color: "#666", fontWeight: "500" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeActive: { backgroundColor: "#E8F5E9" },
  badgeScheduled: { backgroundColor: "#FFF8E1" },
  badgeTextActive: { color: "#2E7D32", fontSize: 12, fontWeight: "bold" },
  badgeTextScheduled: { color: "#F57F17", fontSize: 12, fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#146C43",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
  },
});
