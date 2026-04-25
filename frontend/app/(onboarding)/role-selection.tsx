import React, { useEffect } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { completeUserOnboarding } from '@/service/onboarding.service';
import { auth } from '@/service/firebaseConfig';

type Role = 'Student' | 'Teacher';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ fullName?: string | string[] }>();

  const fullName = Array.isArray(params.fullName) ? params.fullName[0] : params.fullName;

  useEffect(() => {
    if (!fullName) {
      router.replace('/(onboarding)/welcome' as any);
    }
  }, [fullName, router]);

  const handleSelectRole = async (selectedRole: Role) => {
    const currentUser = auth.currentUser;

    if (!currentUser || !fullName) {
      Alert.alert('Session expired', 'Please sign in again to finish onboarding.');
      router.replace('/(auth)/login');
      return;
    }

    try {
      await completeUserOnboarding(currentUser.uid, selectedRole, fullName);

      if (selectedRole === 'Teacher') {
        router.replace('/(teacher)' as any);
        return;
      }

      router.replace('/(tabs)' as any);
    } catch (error) {
      Alert.alert('Could not finish onboarding', 'Please try again.');
    }
  };

  if (!fullName) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#146C43" />
          </TouchableOpacity>
          <Text style={styles.stepText}>Step 2 of 2</Text>
          <View style={{ width: 42 }} />
        </View>

        <Text style={styles.title}>Nice to meet you, {fullName.split(' ')[0]}.</Text>
        <Text style={styles.subtitle}>Choose the role that best matches how you&apos;ll use Matooto.</Text>

        <View style={styles.roleGrid}>
          <TouchableOpacity style={styles.roleCard} onPress={() => handleSelectRole('Student')}>
            <Ionicons name="school" size={34} color="#146C43" />
            <Text style={styles.roleTitle}>Student</Text>
            <Text style={styles.roleDescription}>Join classes, view assessments, and track progress.</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.roleCard} onPress={() => handleSelectRole('Teacher')}>
            <Ionicons name="people" size={34} color="#146C43" />
            <Text style={styles.roleTitle}>Teacher</Text>
            <Text style={styles.roleDescription}>Create classes, assign work, and manage learners.</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 22,
  },
  roleGrid: {
    gap: 14,
  },
  roleCard: {
    borderWidth: 1,
    borderColor: '#D8E8DD',
    backgroundColor: '#F8FCF9',
    borderRadius: 20,
    padding: 18,
  },
  roleTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#163A27',
  },
  roleDescription: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#5F6F63',
  },
});
