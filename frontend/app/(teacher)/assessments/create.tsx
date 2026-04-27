import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../../../service/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { useAuth } from "../../../hooks/useAuth";
import { getClassesByTeacher, ClassData } from "../../../service/classes.repository";

const API_BASE_URL = "https://geriatric-radial-coroner.ngrok-free.dev";

export default function CreateAssessmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classes, setClasses] = useState<ClassData[]>([]);

  // Form State
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [difficultyLevel, setDifficultyLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [storyLength, setStoryLength] = useState<"short" | "medium" | "long">("medium");
  const [storyText, setStoryText] = useState("");
  const [numQuestions, setNumQuestions] = useState("3");
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeLimit, setTimeLimit] = useState("15");
  const [dueDate, setDueDate] = useState("Today");
  const [storyTitle, setStoryTitle] = useState("");

  // Load teacher's classes on mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        if (user?.uid) {
          const teacherClasses = await getClassesByTeacher(user.uid);
          setClasses(teacherClasses);
          if (teacherClasses.length > 0) {
            setSelectedClass(teacherClasses[0]);
          }
        }
      } catch (error) {
        console.error("Error loading classes:", error);
        Alert.alert("Error", "Failed to load classes");
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, [user?.uid]);

  // Helper functions
  const getStoryLength = (): "short" | "medium" | "long" => {
    return storyLength;
  };

  const handleGenerateStory = async () => {
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class first");
      return;
    }

    setIsLoading(true);
    try {
      const length = getStoryLength();

      const response = await fetch(`${API_BASE_URL}/api/stories/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gradeLevel: selectedClass.gradeLevel,
          length,
          language: "english",
          subject: selectedClass.subject,
          topicHint: `Difficulty level ${difficultyLevel} for ${selectedClass.className}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

     const story = await response.json();

     setStoryText(story.body);
     setStoryTitle(story.title || "Untitled Story"); 

     setIsLoading(false);
     setStep(2);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        `Failed to generate story: ${error instanceof Error ? error.message : "Unknown error"}\n\nMake sure the backend server is running on ${API_BASE_URL}`,
        [{ text: "OK" }],
      );
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedClass) {
      Alert.alert("Error", "Please select a class first");
      return;
    }

    setIsLoading(true);
    try {
      const numQ = parseInt(numQuestions) || 3;

      const story = {
        title: storyTitle || "Generated Story",
        body: storyText,
        wordCount: storyText.split(/\s+/).length,
        language: "english",
        suggestedReadingTimeMinutes: 5,
      };

      const response = await fetch(`${API_BASE_URL}/api/questions/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story,
          numberOfQuestions: numQ,
          gradeLevel: selectedClass.gradeLevel,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const generatedQuestions = await response.json();

      const formattedQuestions = generatedQuestions.map((q: any) => ({
        q: q.question,
        options: q.choices.map((c: any) => `${c.label}) ${c.text}`),
        answer: q.correctAnswer,
      }));

      setQuestions(formattedQuestions);
      setIsLoading(false);
      setStep(3);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        "Error",
        `Failed to generate questions: ${error instanceof Error ? error.message : "Unknown error"}`,
        [{ text: "OK" }],
      );
    }
  };

  const handlePost = async (type: "Post" | "Schedule") => {
    try {

      if (!user || !user.uid) {
        Alert.alert("Error", "User not found. Please log in again.");
        return;
      }

      const assessmentData = {
        teacherId: doc(db, "users", user.uid),
        classId: selectedClass?.id,
        className: selectedClass?.className,
        title: storyTitle?.trim() || "Untitled Assessment",
        difficultyLevel,
        story: storyText,
        questions: questions.map((q, idx) => ({
          id: `q${idx + 1}`,
          question: q.q,
          options: q.options,
          correctAnswer: q.answer,
        })),
        timeLimit: parseInt(timeLimit),
        dueDate,
        status: type === "Post" ? "active" : "scheduled",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "assessments"), assessmentData);

      Alert.alert(
        "Success!",
        `Assessment has been ${type === "Post" ? "posted immediately" : "scheduled for " + dueDate}.`,
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        `Failed to save assessment: ${error instanceof Error ? error.message : "Unknown error"}`,
        [{ text: "OK" }],
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            step > 1 ? setStep(step - 1) : router.back();
          }}
          style={{ marginRight: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Assessment</Text>
        <Text style={styles.stepIndicator}>Step {step} of 4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* STEP 1: Parameters */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>1. Assessment Parameters</Text>

            <Text style={styles.label}>Select Class</Text>
            {loadingClasses ? (
              <ActivityIndicator size="large" color="#146C43" />
            ) : classes.length === 0 ? (
              <Text style={styles.label}>No classes found. Create a class first.</Text>
            ) : (
              <View style={styles.buttonGroup}>
                {classes.map((cls) => (
                  <TouchableOpacity
                    key={cls.id}
                    style={[
                      styles.toggleBtn,
                      selectedClass?.id === cls.id && styles.toggleBtnActive,
                    ]}
                    onPress={() => setSelectedClass(cls)}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        selectedClass?.id === cls.id &&
                          styles.toggleBtnTextActive,
                      ]}
                    >
                      {cls.className}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Difficulty Level</Text>
            <View style={styles.buttonGroup}>
              {[1, 2, 3, 4, 5].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.toggleBtn,
                    difficultyLevel === level && styles.toggleBtnActive,
                  ]}
                  onPress={() => setDifficultyLevel(level as 1 | 2 | 3 | 4 | 5)}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      difficultyLevel === level && styles.toggleBtnTextActive,
                    ]}
                  >
                    Level {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Story Length</Text>
            <View style={styles.buttonGroup}>
              {["short", "medium", "long"].map((len) => (
                <TouchableOpacity
                  key={len}
                  style={[
                    styles.toggleBtn,
                    storyLength === len && styles.toggleBtnActive,
                  ]}
                  onPress={() => setStoryLength(len as "short" | "medium" | "long")}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      storyLength === len && styles.toggleBtnTextActive,
                    ]}
                  >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGenerateStory}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Generate Story</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: Edit Story */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>2. Review & Edit Story</Text>

            <Text style={styles.label}>AI Generated Story</Text>
            <TextInput
              style={styles.textArea}
              multiline
              value={storyText}
              onChangeText={setStoryText}
            />

            <Text style={styles.label}>Number of Questions</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={numQuestions}
                onChangeText={setNumQuestions}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGenerateQuestions}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Confirm Story & Generate Questions
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: Edit Questions */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>3. Review & Edit Questions</Text>

            {questions.map((q, idx) => (
              <View key={idx} style={styles.questionCard}>
                <Text style={styles.qLabel}>Question {idx + 1}</Text>
                <TextInput
                  style={styles.qInput}
                  value={q.q}
                  onChangeText={(text) => {
                    const newQ = [...questions];
                    newQ[idx].q = text;
                    setQuestions(newQ);
                  }}
                />

                <Text style={styles.qLabel}>Options</Text>
                {q.options.map((opt: string, oIdx: number) => (
                  <TextInput
                    key={oIdx}
                    style={styles.optInput}
                    value={opt}
                    onChangeText={(text) => {
                      const newQ = [...questions];
                      newQ[idx].options[oIdx] = text;
                      setQuestions(newQ);
                    }}
                  />
                ))}
              </View>
            ))}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setStep(4)}
            >
              <Text style={styles.primaryButtonText}>Confirm Questions</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 4: Schedule */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.sectionTitle}>4. Scheduling & Assignment</Text>

            <Text style={styles.label}>Time Limit (Minutes)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={timeLimit}
                onChangeText={setTimeLimit}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.label}>Due Date</Text>
            <View style={styles.buttonGroup}>
              {["Today", "Tomorrow", "Next Week"].map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.toggleBtn,
                    dueDate === date && styles.toggleBtnActive,
                  ]}
                  onPress={() => setDueDate(date)}
                >
                  <Text
                    style={[
                      styles.toggleBtnText,
                      dueDate === date && styles.toggleBtnTextActive,
                    ]}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 30,
              }}
            >
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handlePost("Schedule")}
              >
                <Text style={styles.secondaryButtonText}>
                  Schedule for Later
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryButton, { flex: 0.48, marginTop: 0 }]}
                onPress={() => handlePost("Post")}
              >
                <Text style={styles.primaryButtonText}>Post Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#146C43", flex: 1 },
  stepIndicator: { fontSize: 14, fontWeight: "bold", color: "#666" },
  content: { padding: 20 },
  stepContainer: { flex: 1 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    marginTop: 15,
  },
  buttonGroup: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  toggleBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
  },
  toggleBtnActive: { backgroundColor: "#146C43", borderColor: "#146C43" },
  toggleBtnText: { color: "#666", fontWeight: "500" },
  toggleBtnTextActive: { color: "#FFF", fontWeight: "bold" },
  primaryButton: {
    backgroundColor: "#146C43",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  primaryButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  secondaryButton: {
    flex: 0.48,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#146C43",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#146C43", fontSize: 16, fontWeight: "bold" },
  textArea: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    minHeight: 200,
    textAlignVertical: "top",
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  input: { paddingVertical: 12, fontSize: 16, color: "#333" },
  questionCard: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  qLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 5,
    marginTop: 10,
  },
  qInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FAFAFA",
  },
  optInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#FAFAFA",
    marginBottom: 5,
  },
});
