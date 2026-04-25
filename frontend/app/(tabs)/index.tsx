import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { auth, db } from "@/service/firebaseConfig";
import { getClassesByStudent } from "@/service/classes.repository";
import {
  getAssessmentsByClass,
  AssessmentData,
} from "@/service/assessments.repository";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";

interface AssessmentWithClassInfo extends AssessmentData {
  className?: string;
  subject?: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("AJ");
  const [pendingAssessments, setPendingAssessments] = useState<
    AssessmentWithClassInfo[]
  >([]);
  const [completedAssessments, setCompletedAssessments] = useState<
    AssessmentWithClassInfo[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.log("User not logged in");
        return;
      }

      // Set display name
      setDisplayName(currentUser.displayName?.split(" ")[0] || "AJ");

      // Get all classes the student is enrolled in
      const studentClasses = await getClassesByStudent(currentUser.uid);

      // Fetch assessments for all classes
      const allAssessments: AssessmentWithClassInfo[] = [];
      for (const classItem of studentClasses) {
        if (classItem.id) {
          const classAssessments = await getAssessmentsByClass(classItem.id);

          // Enrich assessments with class info
          for (const assessment of classAssessments) {
            const classInfo = await fetchClassInfo(assessment.classId);
            allAssessments.push({
              ...assessment,
              ...classInfo,
            });
          }
        }
      }

      // Filter assessments into pending and completed
      const pending: AssessmentWithClassInfo[] = [];
      const completed: AssessmentWithClassInfo[] = [];

      allAssessments.forEach((assessment) => {
        if (isPending(assessment.scheduledFor)) {
          pending.push(assessment);
        } else {
          completed.push(assessment);
        }
      });

      setPendingAssessments(pending);
      setCompletedAssessments(completed);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassInfo = async (classId: any) => {
    try {
      if (!classId) return {};

      const id = typeof classId === "string" ? classId : classId.id;
      const classDoc = await getDoc(doc(db, "classes", id));

      if (classDoc.exists()) {
        const data = classDoc.data();
        return {
          className: data.className || "Unknown Class",
          subject: data.subject || "Unknown Subject",
        };
      }
      return {};
    } catch (err) {
      console.error("Error fetching class info:", err);
      return {};
    }
  };

  const isPending = (scheduledFor: any) => {
    try {
      const now = new Date();
      const scheduledDate = scheduledFor?.toDate
        ? scheduledFor.toDate()
        : new Date(scheduledFor);
      return scheduledDate <= now;
    } catch {
      return false;
    }
  };

  const formatDueDate = (dueDate: any) => {
    if (!dueDate) return "No due date";
    try {
      const date = dueDate.toDate ? dueDate.toDate() : new Date(dueDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const isToday = date.toDateString() === today.toDateString();
      const isTomorrow = date.toDateString() === tomorrow.toDateString();

      if (isToday) {
        return "Due Today";
      } else if (isTomorrow) {
        return "Due Tomorrow";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return "Invalid date";
    }
  };

  const handleAssessmentPress = (assessment: AssessmentWithClassInfo) => {
    router.push({
      pathname: "/assessment/read",
      params: {
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        timeLimitMinutes: assessment.timeLimitMinutes,
        story: assessment.english_version?.story || "",
        questionsJson: JSON.stringify(
          assessment.english_version?.questions || [],
        ),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Good morning, {displayName}! <Text>👋</Text></Text>
            <Text style={styles.subGreeting}>
              Ready to learn something new today?
            </Text>
          </View>
        </View>
        {/* Learner's Pet & Progress */}
        <View style={styles.petCard}>
          <View style={styles.petTextContainer}>
            <Text style={styles.petLabel}>Your Companion</Text>
            <Text style={styles.petTitle}>Level 5 Pet</Text>

            <View style={styles.petProgressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <Text style={styles.petSub}>Keep reading to reach Level 6!</Text>
            </View>
          </View>
          <View style={styles.petImageContainer}>
            <Image
              source={require("@/assets/images/pet_5.svg")}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
          </View>
        </View>
        {/* Action Button */}
        {pendingAssessments.length > 0 && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAssessmentPress(pendingAssessments[0])}
          >
            <Text style={styles.actionButtonText}>
              Answer your assessment now!
            </Text>
          </TouchableOpacity>
        )}
        {/* Pendings */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#146C43" />
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Pendings</Text>
            {pendingAssessments.length > 0 ? (
              <View style={styles.listCard}>
                {pendingAssessments.slice(0, 2).map((assessment, index) => (
                  <View key={assessment.id}>
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => handleAssessmentPress(assessment)}
                    >
                      <Ionicons
                        name="document-text"
                        size={24}
                        color="#146C43"
                        style={styles.listIcon}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listTitle}>{assessment.title}</Text>
                        <Text style={styles.listSub}>
                          {formatDueDate(assessment.dueDate)} •{" "}
                          {assessment.subject}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#CCC"
                        style={styles.listArrow}
                      />
                    </TouchableOpacity>
                    {index < pendingAssessments.slice(0, 2).length - 1 && (
                      <View style={styles.listItemBorder} />
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No pending assessments</Text>
              </View>
            )}

            {/* Completed */}
            <Text style={styles.sectionTitle}>Completed</Text>
            {completedAssessments.length > 0 ? (
              <View style={styles.listCard}>
                {completedAssessments.slice(0, 1).map((assessment) => (
                  <TouchableOpacity
                    key={assessment.id}
                    style={styles.listItem}
                    onPress={() => handleAssessmentPress(assessment)}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#28A745"
                      style={styles.listIcon}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle}>{assessment.title}</Text>
                      <Text style={styles.listSub}>{assessment.subject}</Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#CCC"
                      style={styles.listArrow}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>
                  No completed assessments yet
                </Text>
              </View>
            )}
          </>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6", // Cream background
  },
  scrollContent: {
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  subGreeting: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#C8E6C9",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#146C43",
    borderRadius: 4,
  },
  petProgressContainer: {
    marginTop: 10,
    paddingRight: 10,
  },
  petCard: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  petTextContainer: {
    flex: 1,
  },
  petLabel: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 4,
  },
  petTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 6,
  },
  petSub: {
    fontSize: 14,
    color: "#4CAF50",
  },
  petImageContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
  },
  actionButton: {
    backgroundColor: "#146C43",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#146C43",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  listCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  listItemBorder: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 5,
  },
  listIcon: {
    marginRight: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  listSub: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  listArrow: {
    marginLeft: "auto",
  },
  loadingContainer: {
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySection: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 30,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
});
