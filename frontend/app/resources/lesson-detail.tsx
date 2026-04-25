import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

type Subject = 'english' | 'math' | 'science';

export default function LessonDetailScreen() {
  const router = useRouter();
  const { title, body, bagOfWords, subject, index } = useLocalSearchParams<{
    title: string;
    body: string;
    bagOfWords: string;
    subject: Subject;
    index: string;
  }>();

  const [expandedWords, setExpandedWords] = useState<Set<number>>(new Set());

  const words = bagOfWords ? JSON.parse(bagOfWords) : [];

  const subjectConfig: Record<Subject, { color: string; icon: any }> = {
    english: { color: '#146C43', icon: 'book-outline' },
    math: { color: '#FFB300', icon: 'calculator-outline' },
    science: { color: '#8D5524', icon: 'flask-outline' },
  };

  const config = subject ? subjectConfig[subject] : { color: '#146C43', icon: 'book-outline' as any };

  const toggleWord = (idx: number) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedWords(newExpanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.color }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Lesson Body */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <Text style={styles.bodyText}>{body}</Text>
        </View>

        {/* Bag of Words */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Words ({words.length})</Text>
          <View style={styles.wordsGrid}>
            {words.map((word: string, idx: number) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.wordCard,
                  { borderColor: config.color },
                  expandedWords.has(idx) && styles.wordCardExpanded,
                ]}
                onPress={() => toggleWord(idx)}
              >
                <Text style={[styles.wordText, { color: config.color }]}>
                  {word}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton]}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color={config.color} />
            <Text style={[styles.navButtonText, { color: config.color }]}>
              Back
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
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  wordCard: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  wordCardExpanded: {
    backgroundColor: '#E8F5E9',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    gap: 8,
  },
  prevButton: {
    borderColor: '#146C43',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
