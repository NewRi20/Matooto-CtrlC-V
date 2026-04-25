import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { Image } from 'expo-image';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { initializing, signUpWithEmail } = useAuth();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Enter your email and password to continue.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Make sure both password fields match.');
      return;
    }

    try {
      await signUpWithEmail(email.trim(), password);
      router.replace('/(onboarding)/welcome' as any);
    } catch (error) {
      Alert.alert('Signup failed', 'Check your details and try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header / Logo Area */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 24 }} /> {/* Spacer */}
        </View>

        <View style={styles.logoContainer}>
          <Image source={require('@/assets/images/mascot_like.svg')} style={{ width: 100, height: 100 }} contentFit="contain" />
          <View style={{ marginLeft: 15 }}>
            <Image source={require('@/assets/images/Logo.svg')} style={{ width: 180, height: 60 }} contentFit="contain" />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelRow}>
            <Ionicons name="mail" size={20} color="#146C43" />
            <Text style={styles.inputLabel}>Email</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelRow}>
            <Ionicons name="lock-closed" size={20} color="#146C43" />
            <Text style={styles.inputLabel}>Password</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="Create a password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.inputLabelRow}>
            <Ionicons name="lock-closed" size={20} color="#146C43" />
            <Text style={styles.inputLabel}>Confirm Password</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="Repeat your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Terms Checkbox */}
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreedToTerms(!agreedToTerms)}>
          <Ionicons
            name={agreedToTerms ? "checkbox" : "square-outline"}
            size={24}
            color="#146C43"
          />
          <Text style={styles.checkboxText}>
            I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!agreedToTerms || initializing) && styles.buttonDisabled,
          ]}
          onPress={handleSignup}
          disabled={!agreedToTerms || initializing}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#146C43',
  },
  taglineText: {
    fontSize: 12,
    color: '#666',
  },
  roleContainer: {
    backgroundColor: '#FAF9F6',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  roleLabel: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EEE',
    marginHorizontal: 5,
  },
  roleBtnActive: {
    borderColor: '#146C43',
    backgroundColor: '#E8F5E9',
  },
  roleBtnText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  roleBtnTextActive: {
    color: '#146C43',
    fontWeight: 'bold',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    marginLeft: 8,
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    fontSize: 15,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingRight: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  linkText: {
    color: '#146C43',
    fontWeight: 'bold',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#146C43',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#666',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#146C43',
  },
});
