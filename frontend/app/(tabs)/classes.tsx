import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { getClassesByStudent, joinClassByCode, type ClassData } from '@/service/classes.repository';

export default function ClassesScreen() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);

  const loadClasses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const studentClasses = await getClassesByStudent(user.uid);
      setClasses(studentClasses);
    } catch (error) {
      Alert.alert('Unable to load classes', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load classes when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      void loadClasses();
    }, [user])
  );

  const handleJoinClass = async () => {
    if (!classCode.trim()) {
      Alert.alert('Class Code Required', 'Please enter a class code.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    setJoinLoading(true);

    try {
      const result = await joinClassByCode(classCode.toUpperCase(), user.uid);
      Alert.alert('Success', `You have joined "${result.className}"!`);
      setClassCode('');
      setJoinModalVisible(false);
      await loadClasses();
    } catch (error: any) {
      Alert.alert('Unable to Join Class', error.message || 'Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Classes</Text>
        </View>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#146C43" />
          <Text style={styles.centerStateText}>Loading your classes...</Text>
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setJoinModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Classes</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {classes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={48} color="#146C43" />
            <Text style={styles.emptyTitle}>No classes yet</Text>
            <Text style={styles.emptyText}>Join a class using a class code.</Text>
            
          </View>
        ) : (
          classes.map((cls) => (
            <View
              key={cls.id}
              style={styles.classCard}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons name="school" size={24} color="#146C43" />
                </View>
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{cls.className}</Text>
                  <Text style={styles.classSubject}>
                    Grade {cls.gradeLevel} • {cls.subject}
                  </Text>
                  <View style={styles.teacherRow}>
                    <Ionicons name="person" size={12} color="#146C43" />
                    <Text style={styles.teacherName}>Class Code: {cls.classCode}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Ionicons name="chevron-forward" size={20} color="#146C43" />
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setJoinModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Join Class Modal */}
      <Modal
        visible={joinModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setJoinModalVisible(false);
          setClassCode('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Join a Class</Text>
              <TouchableOpacity
                onPress={() => {
                  setJoinModalVisible(false);
                  setClassCode('');
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalContent}>
              <Text style={styles.modalLabel}>Enter Class Code</Text>
              <TextInput
                style={styles.codeInput}
                placeholder="e.g., ABC123"
                placeholderTextColor="#A0A0A0"
                value={classCode}
                onChangeText={setClassCode}
                editable={!joinLoading}
                maxLength={6}
              />
              <Text style={styles.helpText}>
                Your teacher will share the 6-character class code with you.
              </Text>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setJoinModalVisible(false);
                  setClassCode('');
                }}
                disabled={joinLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, joinLoading && styles.submitButtonDisabled]}
                onPress={handleJoinClass}
                disabled={joinLoading}
              >
                {joinLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Join Class</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#146C43',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#146C43',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#146C43',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  joinButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  joinButtonLarge: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#146C43',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  joinButtonLargeText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  joinButtonFooter: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#146C43',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
  },
  content: {
    padding: 20,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerStateText: {
    marginTop: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  emptyText: {
    marginTop: 6,
    color: '#666',
    textAlign: 'center',
  },
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  classSubject: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teacherName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#146C43',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardFooter: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  codeInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '700',
    fontSize: 15,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#146C43',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

