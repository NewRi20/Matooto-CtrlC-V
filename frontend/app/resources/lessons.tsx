import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import lessonsData from '@/constants/lessons.json';

type Subject = 'english' | 'math' | 'science';

interface Lesson {
  title: string;
  subject: string;
  body: string;
  bag_of_words: string[];
}

export default function LessonsScreen() {
  const router = useRouter();
  const { subject } = useLocalSearchParams<{ subject: Subject }>();

  const lessons = subject ? lessonsData[subject] : [];

  const subjectConfig: Record<Subject, { color: string; icon: any }> = {
    english: { color: '#146C43', icon: 'book-outline' },
    math: { color: '#FFB300', icon: 'calculator-outline' },
    science: { color: '#8D5524', icon: 'flask-outline' },
  };

  const config = subject ? subjectConfig[subject] : { color: '#146C43', icon: 'book-outline' as any };

  const handleLessonPress = (lesson: Lesson, index: number) => {
    router.push({
      pathname: '/resources/lesson-detail',
      params: {
        title: lesson.title,
        body: lesson.body,
        bagOfWords: JSON.stringify(lesson.bag_of_words),
        subject,
        index,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: config.color }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {subject?.charAt(0).toUpperCase()}{subject?.slice(1)}
          </Text>
          <Text style={styles.headerSubtitle}>{lessons.length} lessons</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* Lessons List */}
      <FlatList
        data={lessons}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.content}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.lessonCard}
            onPress={() => handleLessonPress(item, index)}
          >
            <View style={[styles.lessonIcon, { backgroundColor: config.color }]}>
              <Ionicons name={config.icon} size={24} color="#FFF" />
            </View>
            <View style={styles.lessonInfo}>
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonPreview} numberOfLines={2}>
                {item.body.substring(0, 80)}...
              </Text>
              <View style={styles.wordsContainer}>
                {item.bag_of_words.slice(0, 3).map((word, idx) => (
                  <View key={idx} style={styles.wordTag}>
                    <Text style={styles.wordTagText}>{word}</Text>
                  </View>
                ))}
                {item.bag_of_words.length > 3 && (
                  <Text style={styles.moreWords}>+{item.bag_of_words.length - 3}</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#146C43" />
          </TouchableOpacity>
        )}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  lessonCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lessonPreview: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  wordsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  wordTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  wordTagText: {
    fontSize: 11,
    color: '#146C43',
    fontWeight: '600',
  },
  moreWords: {
    fontSize: 11,
    color: '#146C43',
    fontWeight: '600',
  },
});
