import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReadScreen() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

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

  const storyChunks = [
    { text: "Once upon a time, in a lush tropical forest, there lived a brave ", isWord: false },
    { text: "cockatoo", isWord: true },
    { text: " named Matty. Matty had bright green feathers and a golden yellow crest that ", isWord: false },
    { text: "shimmered", isWord: true },
    { text: " in the sunlight. One day, a great storm ", isWord: false },
    { text: "threatened", isWord: true },
    { text: " the forest. The animals were scared, and the wind howled loudly. Matty knew he had to help. He spread his wings wide and flew high above the trees to warn everyone. With ", isWord: false },
    { text: "courage", isWord: true },
    { text: " and kindness, Matty helped all the animals find shelter. After the storm passed, the forest was safe again, and everyone cheered for their brave hero, Matty the cockatoo.", isWord: false }
  ];

  const dictionary: Record<string, string> = {
    "cockatoo": "a type of parrot with a curved beak and a crest of feathers on its head, usually white or brightly colored.",
    "shimmered": "shone with a soft, slightly wavering light.",
    "threatened": "stated one's intention to take hostile action against someone in retribution.",
    "courage": "the ability to do something that frightens one; bravery."
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
        <Text style={styles.stepText}>Step 1 of 3</Text>
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
        <Text style={styles.storyTitle}>THE BRAVE COCKATOO</Text>
        
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

        <Text style={styles.helperText}>Tap any word to see its definition</Text>

        {/* Dictionary Popup */}
        {selectedWord && (
          <View style={styles.dictionaryPopup}>
            <View style={styles.dictHeader}>
              <Text style={styles.dictWord}>{selectedWord}</Text>
              <TouchableOpacity onPress={() => setSelectedWord(null)}>
                <Ionicons name="volume-high-outline" size={24} color="#146C43" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dictPhonetic}>/ ,kɒkə'tuː /</Text>
            <View style={styles.dictDivider} />
            <Text style={styles.dictDefinition}>{dictionary[selectedWord]}</Text>
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => router.push('/assessment/quiz')}
        >
          <Text style={styles.nextButtonText}>Next (Read for 30s)</Text>
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
  dictPhonetic: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  dictDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  dictDefinition: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  nextButton: {
    backgroundColor: '#D3D3D3', // Assuming inactive at first based on image
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
});
