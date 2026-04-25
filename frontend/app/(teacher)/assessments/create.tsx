import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CreateAssessmentScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [selectedClass, setSelectedClass] = useState('Grade 3-A');
  const [storyLength, setStoryLength] = useState('Medium');
  const [storyText, setStoryText] = useState('');
  const [numQuestions, setNumQuestions] = useState('3');
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeLimit, setTimeLimit] = useState('15');
  const [dueDate, setDueDate] = useState('Today');

  const handleGenerateStory = () => {
    setIsLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setStoryText("Once upon a time, in a lush tropical forest, there lived a brave cockatoo named Matty. Matty had bright green feathers and a golden yellow crest that shimmered in the sunlight. One day, a great storm threatened the forest. The animals were scared, and the wind howled loudly. Matty knew he had to help. He spread his wings wide and flew high above the trees to warn everyone. With courage and kindness, Matty helped all the animals find shelter. After the storm passed, the forest was safe again, and everyone cheered for their brave hero, Matty the cockatoo.");
      setIsLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleGenerateQuestions = () => {
    setIsLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      setQuestions([
        { q: "What is the name of the brave cockatoo?", options: ["A) Milo", "B) Matty", "C) Marco", "D) Tito"], answer: "B" },
        { q: "What color were Matty's feathers?", options: ["A) Red", "B) Blue", "C) Green", "D) Yellow"], answer: "C" },
        { q: "What did Matty do to help the animals?", options: ["A) Sang a song", "B) Warned everyone about the storm", "C) Built a house", "D) Flew away"], answer: "B" }
      ]);
      setIsLoading(false);
      setStep(3);
    }, 2000);
  };

  const handlePost = (type: 'Post' | 'Schedule') => {
    Alert.alert(
      "Success!",
      `Assessment has been ${type === 'Post' ? 'posted immediately' : 'scheduled for ' + dueDate}.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { step > 1 ? setStep(step - 1) : router.back() }} style={{ marginRight: 15 }}>
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
            
            <Text style={styles.label}>Select Class (Determines Level)</Text>
            <View style={styles.buttonGroup}>
              {['Grade 3-A', 'Grade 3-B', 'Grade 4-A'].map((cls) => (
                <TouchableOpacity 
                  key={cls} 
                  style={[styles.toggleBtn, selectedClass === cls && styles.toggleBtnActive]}
                  onPress={() => setSelectedClass(cls)}
                >
                  <Text style={[styles.toggleBtnText, selectedClass === cls && styles.toggleBtnTextActive]}>{cls}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Story Length</Text>
            <View style={styles.buttonGroup}>
              {['Short', 'Medium', 'Long'].map((len) => (
                <TouchableOpacity 
                  key={len} 
                  style={[styles.toggleBtn, storyLength === len && styles.toggleBtnActive]}
                  onPress={() => setStoryLength(len)}
                >
                  <Text style={[styles.toggleBtnText, storyLength === len && styles.toggleBtnTextActive]}>{len}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateStory} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Generate Story</Text>}
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

            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateQuestions} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>Confirm Story & Generate Questions</Text>}
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
                <TextInput style={styles.qInput} value={q.q} onChangeText={(text) => {
                  const newQ = [...questions]; newQ[idx].q = text; setQuestions(newQ);
                }} />
                
                <Text style={styles.qLabel}>Options</Text>
                {q.options.map((opt: string, oIdx: number) => (
                  <TextInput key={oIdx} style={styles.optInput} value={opt} onChangeText={(text) => {
                    const newQ = [...questions]; newQ[idx].options[oIdx] = text; setQuestions(newQ);
                  }} />
                ))}
              </View>
            ))}

            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(4)}>
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
              {['Today', 'Tomorrow', 'Next Week'].map((date) => (
                <TouchableOpacity 
                  key={date} 
                  style={[styles.toggleBtn, dueDate === date && styles.toggleBtnActive]}
                  onPress={() => setDueDate(date)}
                >
                  <Text style={[styles.toggleBtnText, dueDate === date && styles.toggleBtnTextActive]}>{date}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => handlePost('Schedule')}>
                <Text style={styles.secondaryButtonText}>Schedule for Later</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryButton, { flex: 0.48, marginTop: 0 }]} onPress={() => handlePost('Post')}>
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
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#146C43', flex: 1 },
  stepIndicator: { fontSize: 14, fontWeight: 'bold', color: '#666' },
  content: { padding: 20 },
  stepContainer: { flex: 1 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 25 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10, marginTop: 15 },
  buttonGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toggleBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FFF' },
  toggleBtnActive: { backgroundColor: '#146C43', borderColor: '#146C43' },
  toggleBtnText: { color: '#666', fontWeight: '500' },
  toggleBtnTextActive: { color: '#FFF', fontWeight: 'bold' },
  primaryButton: { backgroundColor: '#146C43', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 30 },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { flex: 0.48, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#146C43', padding: 15, borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { color: '#146C43', fontSize: 16, fontWeight: 'bold' },
  textArea: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 15, minHeight: 200, textAlignVertical: 'top', fontSize: 16, lineHeight: 24, color: '#333' },
  inputContainer: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 10, paddingHorizontal: 15 },
  input: { paddingVertical: 12, fontSize: 16, color: '#333' },
  questionCard: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EEE', borderRadius: 12, padding: 15, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  qLabel: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5, marginTop: 10 },
  qInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, fontSize: 16, color: '#333', backgroundColor: '#FAFAFA' },
  optInput: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 8, fontSize: 14, color: '#333', backgroundColor: '#FAFAFA', marginBottom: 5 }
});
