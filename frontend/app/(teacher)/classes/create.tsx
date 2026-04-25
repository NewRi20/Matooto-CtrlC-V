import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { createClass, getClassById } from '@/service/classes.repository';

export default function CreateClassScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleCreateClass = async () => {
    if (!user) {
      Alert.alert('Session expired', 'Please sign in again.');
      return;
    }

    if (!className.trim() || !gradeLevel.trim() || !subject.trim()) {
      Alert.alert('Missing information', 'Please fill in the class name, grade level, and subject.');
      return;
    }

    const parsedGradeLevel = Number(gradeLevel);
    if (Number.isNaN(parsedGradeLevel) || parsedGradeLevel <= 0) {
      Alert.alert('Invalid grade level', 'Enter a valid grade level number.');
      return;
    }

    try {
      setSubmitting(true);
      const classId = await createClass({
        className: className.trim(),
        gradeLevel: parsedGradeLevel,
        subject: subject.trim(),
        teacherUid: user.uid,
      });

      // Fetch the created class to get the class code
      const classData = await getClassById(classId);
      if (classData?.classCode) {
        setClassCode(classData.classCode);
        setShowCodeModal(true);
      } else {
        Alert.alert('Class created', 'Your class has been created successfully.');
        router.back();
      }
    } catch (error) {
      Alert.alert('Unable to create class', 'Please try again.');
      console.error('Create class error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShareCode = async () => {
    try {
      await Share.share({
        message: `Join my class using the code: ${classCode}`,
        title: 'Class Code',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleContinue = () => {
    setShowCodeModal(false);
    // Go back to class list which will refresh automatically
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#146C43" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Class</Text>
          <View style={{ width: 42 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Class Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Grade 7-A English"
            value={className}
            onChangeText={setClassName}
          />

          <Text style={styles.label}>Grade Level</Text>
          <TextInput
            style={styles.input}
            placeholder="7"
            keyboardType="number-pad"
            value={gradeLevel}
            onChangeText={setGradeLevel}
          />

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="English"
            value={subject}
            onChangeText={setSubject}
          />

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleCreateClass}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Create Class'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Class Code Modal */}
      <Modal
        visible={showCodeModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCodeModal(false);
          router.back();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Class Created!</Text>
              <Ionicons name="checkmark-circle" size={60} color="#28A745" />
            </View>

            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Share this code with your students</Text>
              <View style={styles.codBox}>
                <Text style={styles.codeText}>{classCode}</Text>
              </View>
              <Text style={styles.codeDescription}>Students can use this code to join your class</Text>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShareCode}>
                <Ionicons name="share-social" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.shareButtonText}>Share Code</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#146C43' },
  card: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E7E7E7' },
  label: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 8, marginTop: 14 },
  input: { borderWidth: 1, borderColor: '#D6D6D6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827', backgroundColor: '#FFF' },
  multilineInput: { minHeight: 90, textAlignVertical: 'top' },
  helperText: { marginTop: 8, fontSize: 12, color: '#6B7280', lineHeight: 18 },
  button: { marginTop: 22, backgroundColor: '#146C43', borderRadius: 14, alignItems: 'center', paddingVertical: 15 },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingTop: 30 },
  modalHeader: { alignItems: 'center', marginBottom: 30 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#146C43', marginBottom: 15 },
  codeContainer: { alignItems: 'center', marginBottom: 30, backgroundColor: '#E8F5E9', borderRadius: 15, padding: 20 },
  codeLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 15 },
  codBox: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#146C43', borderRadius: 12, paddingHorizontal: 30, paddingVertical: 20, marginBottom: 15 },
  codeText: { fontSize: 32, fontWeight: '900', color: '#146C43', letterSpacing: 2, textAlign: 'center' },
  codeDescription: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  modalButtonsContainer: { gap: 12 },
  shareButton: { backgroundColor: '#146C43', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  shareButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  continueButton: { backgroundColor: '#E8F5E9', borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 2, borderColor: '#146C43' },
  continueButtonText: { color: '#146C43', fontSize: 16, fontWeight: '700' },
});
