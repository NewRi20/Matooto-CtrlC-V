import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AttemptReadScreen() {
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
    { text: "Noong unang panahon, sa isang luntiang gubat, may nakatirang isang matapang na ", isWord: false },
    { text: "cockatoo", isWord: true },
    { text: " na nagngangalang Matty. Si Matty ay may luntiang balahibo at ginintuang dilaw na palong na ", isWord: false },
    { text: "kumikinang", isWord: true },
    { text: " sa sikat ng araw. Isang araw, isang malakas na bagyo ang ", isWord: false },
    { text: "nagbanta", isWord: true },
    { text: " sa gubat. Ang mga hayop ay natakot, at ang hangin ay humagupit nang malakas. Alam ni Matty na kailangan niyang tumulong. Ibinuka niya nang malapad ang kanyang mga pakpak at lumipad nang mataas sa mga puno upang babalaan ang lahat. Taglay ang ", isWord: false },
    { text: "tapang", isWord: true },
    { text: " at kabaitan, tinulungan ni Matty ang lahat ng hayop na makahanap ng masisilungan. Matapos ang bagyo, ang gubat ay ligtas muli, at lahat ay nagbunyi para sa kanilang matapang na bayani, si Matty ang cockatoo.", isWord: false }
  ];

  const dictionary: Record<string, { definition: string, phonetic: string }> = {
    "cockatoo": {
      phonetic: "/ ,kɒkə'tuː /",
      definition: "isang uri ng loro na may kurbang tuka at palong sa ulo, karaniwang puti o matingkad ang kulay."
    },
    "kumikinang": {
      phonetic: "/ ku-mi-ki-nang /",
      definition: "kuminang nang may malambot at bahagyang nanginginig na liwanag."
    },
    "nagbanta": {
      phonetic: "/ nag-ban-ta /",
      definition: "nagpahayag ng intensyong gumawa ng masama o manakit."
    },
    "tapang": {
      phonetic: "/ ta-pang /",
      definition: "ang kakayahang gawin ang isang bagay na nakakatakot; katapangan."
    }
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
        <Text style={styles.stepText}>Step 1 of 3 (2nd Attempt)</Text>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#146C43" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: '33%' }]} />
      </View>

      <View style={styles.languageBanner}>
        <Ionicons name="language-outline" size={20} color="#8D5524" />
        <Text style={styles.languageBannerText}>Mother Tongue: Tagalog</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.storyTitle}>ANG MATAPANG NA COCKATOO</Text>
        
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

        <Text style={styles.helperText}>I-tap ang anumang salita upang makita ang kahulugan nito</Text>

        {/* Dictionary Popup */}
        {selectedWord && dictionary[selectedWord] && (
          <View style={styles.dictionaryPopup}>
            <View style={styles.dictHeader}>
              <Text style={styles.dictWord}>{selectedWord}</Text>
              <TouchableOpacity onPress={() => setSelectedWord(null)}>
                <Ionicons name="volume-high-outline" size={24} color="#146C43" />
              </TouchableOpacity>
            </View>
            <Text style={styles.dictPhonetic}>{dictionary[selectedWord].phonetic}</Text>
            <View style={styles.dictDivider} />
            <Text style={styles.dictDefinition}>{dictionary[selectedWord].definition}</Text>
          </View>
        )}
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={() => router.push('/assessment/attempt_quiz')}
        >
          <Text style={styles.nextButtonText}>Susunod (Next)</Text>
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
    alignItems: 'center',
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#146C43',
    marginBottom: 20,
    marginTop: 10,
    textAlign: 'center',
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
