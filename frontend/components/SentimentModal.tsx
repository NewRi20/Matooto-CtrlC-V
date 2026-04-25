import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

interface SentimentModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (sentiment: string) => void;
}

const moods = [
  { id: 'happy', label: 'Happy', image: require('@/assets/images/mascot_mood_g.svg') },
  { id: 'crazy', label: 'Crazy', image: require('@/assets/images/mascot_mood_crazy.svg') },
  { id: 'gutom', label: 'Gutom', image: require('@/assets/images/mascot_mood_gutom.svg') },
  { id: 'kabado', label: 'Kabado', image: require('@/assets/images/mascot_mood_kabado.svg') },
  { id: 'k', label: 'K', image: require('@/assets/images/mascot_mood_k.svg') },
  { id: 'lutang', label: 'Lutang', image: require('@/assets/images/mascot_mood_lutang.svg') },
  { id: 'pawis', label: 'Pawis', image: require('@/assets/images/mascot_mood_pawis.svg') },
  { id: 'sleepy', label: 'Sleepy', image: require('@/assets/images/mascot_mood_sleepy.svg') },
  { id: 'stress', label: 'Stress', image: require('@/assets/images/mascot_mood_stress.svg') },
  { id: 'badtrip', label: 'Bad Trip', image: require('@/assets/images/mascot_mood_badtrip.svg') },
];

export function SentimentModal({ visible, onClose, onSelect }: SentimentModalProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleMoodSelect = (moodId: string, label: string) => {
    setSelectedMood(moodId);
    onSelect(label);
  };

  // Only render mood options when modal is visible
  const moodOptions = useMemo(() => {
    if (!visible) return null;
    return moods;
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.mascotContainer}>
            <Image 
              source={require('@/assets/images/mascot_head_shy.svg')} 
              style={styles.mascotImage}
              contentFit="contain"
            />
          </View>
          
          <Text style={styles.title}>How are you feeling today?</Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.optionsContainer}
          >
            {moodOptions?.map((mood) => (
              <TouchableOpacity 
                key={mood.id}
                style={[
                  styles.option,
                  selectedMood === mood.id && styles.optionSelected
                ]}
                onPress={() => handleMoodSelect(mood.id, mood.label)}
              >
                <View style={styles.imageWrapper}>
                  <Image 
                    source={mood.image} 
                    style={styles.moodImage}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                  />
                </View>
                <Text style={styles.optionText}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  mascotContainer: {
    marginTop: -70,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
  },
  mascotImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 30,
  },
  optionsContainer: {
    backgroundColor: '#FAF9F6',
    borderRadius: 15,
    marginBottom: 30,
    paddingVertical: 15,
  },
  scrollContent: {
    paddingHorizontal: 10,
    gap: 15,
  },
  option: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  optionSelected: {
    opacity: 0.7,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  moodImage: {
    width: 70,
    height: 70,
  },
  optionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
});
