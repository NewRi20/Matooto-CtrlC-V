import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SentimentModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (sentiment: string) => void;
}

export function SentimentModal({ visible, onClose, onSelect }: SentimentModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.mascotContainer}>
            <Ionicons name="happy" size={80} color="#146C43" />
          </View>
          
          <Text style={styles.title}>How are you feeling today?</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={() => onSelect('Happy')}>
              <View style={[styles.iconCircle, { borderColor: '#8BC34A' }]}>
                <Ionicons name="happy-outline" size={40} color="#8BC34A" />
              </View>
              <Text style={styles.optionText}>Happy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option} onPress={() => onSelect('Neutral')}>
              <View style={[styles.iconCircle, { borderColor: '#FF9800' }]}>
                <Ionicons name="sad-outline" size={40} color="#FF9800" />
              </View>
              <Text style={styles.optionText}>Neutral</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option} onPress={() => onSelect('Sad')}>
              <View style={[styles.iconCircle, { borderColor: '#F44336' }]}>
                <Ionicons name="sad-outline" size={40} color="#F44336" />
              </View>
              <Text style={styles.optionText}>Sad</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option} onPress={() => onSelect('Excellent')}>
              <View style={[styles.iconCircle, { borderColor: '#4CAF50' }]}>
                <Ionicons name="star-outline" size={40} color="#4CAF50" />
              </View>
              <Text style={styles.optionText}>Excellent</Text>
            </TouchableOpacity>
          </View>
          
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
    marginTop: -70, // Pull mascot up out of the modal
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 50,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FAF9F6',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
  },
  option: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
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
