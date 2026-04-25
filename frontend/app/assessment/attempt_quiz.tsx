import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AttemptQuizScreen() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 30); // 14:30
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

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

  const options = [
    { id: 0, letter: 'A', text: 'Matty ang Cockatoo' },
    { id: 1, letter: 'B', text: 'Milo ang Loro' },
    { id: 2, letter: 'C', text: 'Marco ang Macaw' },
    { id: 3, letter: 'D', text: 'Tito ang Toucan' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.stepText}>Tanong 1 of 5 (2nd Attempt)</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#146C43" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '40%' }]} />
      </View>

      <View style={styles.languageBanner}>
        <Ionicons name="language-outline" size={20} color="#8D5524" />
        <Text style={styles.languageBannerText}>Mother Tongue: Tagalog</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.questionText}>Ano ang pangalan ng pangunahing tauhan?</Text>

        <View style={styles.optionsContainer}>
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <TouchableOpacity 
                key={opt.id} 
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => setSelectedOption(opt.id)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opt.letter}) {opt.text}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#FFF" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Nav */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.prevButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#8D5524" />
          <Text style={styles.prevButtonText}>Nakaraan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => router.push('/assessment/attempt_result')}
        >
          <Text style={styles.nextButtonText}>Susunod na Tanong</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
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
    fontSize: 15,
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
  languageBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF5E6',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  languageBannerText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#8D5524',
    fontSize: 15,
  },
  content: {
    padding: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4C3B32',
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  optionCardSelected: {
    backgroundColor: '#146C43',
    borderColor: '#146C43',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
  },
  optionTextSelected: {
    color: '#FFF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D5524',
    marginRight: 10,
  },
  prevButtonText: {
    color: '#8D5524',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#146C43',
    marginLeft: 10,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
});
