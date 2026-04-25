import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReviewScreen() {
  const router = useRouter();

  const questions = [
    {
      id: 1,
      question: "What is the main character's name?",
      userAnswer: "Matty the Cockatoo",
      correctAnswer: "Matty the Cockatoo",
      isCorrect: true,
      explanation: "The story states that there lived a brave cockatoo named Matty."
    },
    {
      id: 2,
      question: "What color was Matty's crest?",
      userAnswer: "Green",
      correctAnswer: "Golden Yellow",
      isCorrect: false,
      explanation: "Matty had bright green feathers and a golden yellow crest."
    },
    {
      id: 3,
      question: "What threatened the forest?",
      userAnswer: "A great storm",
      correctAnswer: "A great storm",
      isCorrect: true,
      explanation: "One day, a great storm threatened the forest."
    },
    {
      id: 4,
      question: "What did Matty do to warn everyone?",
      userAnswer: "He flew high above the trees",
      correctAnswer: "He flew high above the trees",
      isCorrect: true,
      explanation: "He spread his wings wide and flew high above the trees to warn everyone."
    },
    {
      id: 5,
      question: "How was Matty described at the end?",
      userAnswer: "A brave hero",
      correctAnswer: "A brave hero",
      isCorrect: true,
      explanation: "Everyone cheered for their brave hero, Matty the cockatoo."
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Review Answers</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {questions.map((q, index) => (
          <View key={q.id} style={[styles.questionCard, !q.isCorrect && styles.questionCardIncorrect]}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              {q.isCorrect ? (
                <Ionicons name="checkmark-circle" size={24} color="#146C43" />
              ) : (
                <Ionicons name="close-circle" size={24} color="#D32F2F" />
              )}
            </View>
            <Text style={styles.questionText}>{q.question}</Text>
            
            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>Your Answer:</Text>
              <Text style={[styles.answerText, q.isCorrect ? styles.correctText : styles.incorrectText]}>
                {q.userAnswer}
              </Text>
            </View>

            {!q.isCorrect && (
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Correct Answer:</Text>
                <Text style={[styles.answerText, styles.correctText]}>{q.correctAnswer}</Text>
              </View>
            )}

            <View style={styles.explanationBox}>
              <Ionicons name="bulb-outline" size={20} color="#8D5524" style={{ marginRight: 8 }} />
              <Text style={styles.explanationText}>{q.explanation}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#146C43',
  },
  questionCardIncorrect: {
    borderLeftColor: '#D32F2F',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8D5524',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  answerLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  answerText: {
    fontSize: 15,
    fontWeight: '600',
  },
  correctText: {
    color: '#146C43',
  },
  incorrectText: {
    color: '#D32F2F',
  },
  explanationBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF5E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  explanationText: {
    flex: 1,
    fontSize: 14,
    color: '#8D5524',
    lineHeight: 20,
  },
});
