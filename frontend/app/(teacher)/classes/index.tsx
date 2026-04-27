import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import { useAuth } from "@/hooks/useAuth";
import {
  getClassesByTeacher,
  type ClassData,
} from "@/service/classes.repository";

export default function ClassListScreen() {
  const router = useRouter();
  const { user, initializing } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClasses = async () => {
    if (initializing) {
      return;
    }

    if (!user) {
      setClasses([]);
      setLoading(false);
      return;
    }

    try {
      const teacherClasses = await getClassesByTeacher(user.uid);
      setClasses(teacherClasses);
    } catch (error) {
      Alert.alert("Unable to load classes", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadClasses();
  }, [user, initializing]);

  // Refresh when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (initializing) {
        return;
      }

      void loadClasses();
    }, [user, initializing]),
  );

  const handleShareCode = async (classCode: string, className: string) => {
    try {
      await Share.share({
        message: `Join my class "${className}" using the code: ${classCode}`,
        title: "Class Code",
      });
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} style={styles.container}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#146C43" />
          <Text style={styles.centerStateText}>Loading your classes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/(teacher)/classes/create" as any)}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.createButtonText}>Create Class</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {classes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={48} color="#146C43" />
            <Text style={styles.emptyTitle}>No classes yet</Text>
            <Text style={styles.emptyText}>Create a class to see it here.</Text>
          </View>
        ) : (
          classes.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.classCard}
              onPress={() => router.push(`/(teacher)/classes/${cls.id}`)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="school" size={24} color="#146C43" />
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{cls.className}</Text>
                  <Text style={styles.classSubject}>
                    Grade {cls.gradeLevel} • {cls.subject}
                  </Text>
                  <View style={styles.codeRow}>
                    <Ionicons name="key" size={12} color="#146C43" />
                    <Text style={styles.classCode}>{cls.classCode}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => handleShareCode(cls.classCode, cls.className)}
                >
                  <Ionicons name="share-social" size={18} color="#146C43" />
                </TouchableOpacity>
              </View>
              <View style={styles.cardFooter}>
                <Ionicons name="people" size={16} color="#666" />
                <Text style={styles.studentCount}>
                  {cls.studentIds?.length ?? 0} Students
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#146C43"
                  style={{ marginLeft: "auto" }}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

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
  headerActions: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#146C43",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    flex: 1,
    marginLeft: 6,
  },
  createButtonText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#146C43" },
  content: { padding: 20 },
  centerState: { flex: 1, alignItems: "center", justifyContent: "center" },
  centerStateText: { marginTop: 12, color: "#666" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyTitle: { marginTop: 12, fontSize: 18, fontWeight: "700", color: "#333" },
  emptyText: { marginTop: 6, color: "#666", textAlign: "center" },
  classCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
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
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  classInfo: { flex: 1 },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  classSubject: { fontSize: 13, color: "#666", marginBottom: 6 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  classCode: {
    fontSize: 12,
    fontWeight: "700",
    color: "#146C43",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shareButton: { padding: 8, marginLeft: 10 },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
  },
  studentCount: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
