import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { createClass } from '@/service/classes.repository';

export default function CreateClassScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [className, setClassName] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [studentUids, setStudentUids] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const parsedStudentUids = useMemo(
    () => studentUids.split(',').map((uid) => uid.trim()).filter(Boolean),
    [studentUids]
  );

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
      await createClass({
        className: className.trim(),
        gradeLevel: parsedGradeLevel,
        subject: subject.trim(),
        teacherUid: user.uid,
        studentUids: parsedStudentUids,
      });

      Alert.alert('Class created', 'Your class has been uploaded successfully.');
      router.back();
    } catch (error) {
      Alert.alert('Unable to create class', 'Please try again.');
    } finally {
      setSubmitting(false);
    }
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

          <Text style={styles.label}>Student UIDs</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="uid1, uid2, uid3"
            value={studentUids}
            onChangeText={setStudentUids}
            multiline
          />
          <Text style={styles.helperText}>
            Optional. Paste Firestore user IDs separated by commas to enroll students right away.
          </Text>

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleCreateClass}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>{submitting ? 'Creating...' : 'Upload Class'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});
