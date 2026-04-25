import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface AssessmentQuestion {
  question: string;
  choices: string[];
  correctChoiceIndex: number;
}

export default function ReadScreen() {
  const router = useRouter();
  const {
    assessmentId,
    assessmentTitle,
    timeLimitMinutes,
    story: storyParam,
    questionsJson
  } = useLocalSearchParams<{
    assessmentId: string;
    assessmentTitle: string;
    timeLimitMinutes: string;
    story: string;
    questionsJson: string;
  }>();

  const [timeLeft, setTimeLeft] = useState((parseInt(timeLimitMinutes) || 15) * 60);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [storyChunks, setStoryChunks] = useState<Array<{text: string, isWord: boolean}>>([]);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);

  // Parse the story and questions
  useEffect(() => {
    if (storyParam && questionsJson) {
      try {
        const parsedQuestions = JSON.parse(questionsJson);
        setQuestions(parsedQuestions);

        // Display the story as-is
        setStoryChunks([
          { text: storyParam, isWord: false }
        ]);
      } catch (err) {
        console.error('Error parsing assessment data:', err);
      }
    }
  }, [storyParam, questionsJson]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleWordTap = (word: string) => {
    setSelectedWord(word);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 1 of 2</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#146C43" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '33%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.storyTitle}>{assessmentTitle?.toUpperCase() || 'ASSESSMENT'}</Text>

        <Text style={styles.storyText}>
          {storyChunks.map((chunk, index) => {
            if (chunk.isWord) {
              return (
                <Text
                  key={index}
                  style={styles.clickableWord}
                  onPress={() => handleWordTap(chunk.text)}
                >
                  {chunk.text}
                </Text>
              );
            }
            return <Text key={index}>{chunk.text}</Text>;
          })}
        </Text>

        <Text style={styles.helperText}>Read the passage carefully</Text>

        {/* Selected Word Popup */}
        {selectedWord && (
          <View style={styles.dictionaryPopup}>
            <View style={styles.dictHeader}>
              <Text style={styles.dictWord}>{selectedWord}</Text>
              <TouchableOpacity onPress={() => setSelectedWord(null)}>
                <Ionicons name="close" size={24} color="#146C43" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dictDefinition}>Selected: {selectedWord}</Text>
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() =>
            router.push({
              pathname: '/assessment/quiz',
              params: {
                assessmentId,
                assessmentTitle,
                questionsJson,
              }
            })
          }
        >
          <Text style={styles.nextButtonText}>Next (Start Quiz)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  stepText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#146C43',
    marginLeft: 5,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E9ECEF',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#146C43',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#146C43',
    marginBottom: 20,
    marginTop: 10,
  },
  storyText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#333',
    textAlign: 'justify',
  },
  clickableWord: {
    color: '#146C43',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  helperText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 30,
    marginBottom: 10,
  },
  dictionaryPopup: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 10,
  },
  dictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dictWord: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  dictDefinition: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginTop: 10,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  nextButton: {
    backgroundColor: '#146C43',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
