import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'Student' | 'Teacher'>('Student');
  const [classCode, setClassCode] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleGoogleSignup = () => {
    if (role === 'Teacher') {
      router.replace('/(teacher)' as any);
    } else {
      router.replace('/(tabs)');
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
          <Ionicons name="happy" size={40} color="#146C43" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.logoText}>Matooto</Text>
            <Text style={styles.taglineText}>Learn. Grow. Soar.</Text>
          </View>
        </View>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>I am a...</Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity 
              style={[styles.roleBtn, role === 'Student' && styles.roleBtnActive]}
              onPress={() => setRole('Student')}
            >
              <Ionicons name="school" size={30} color={role === 'Student' ? '#146C43' : '#888'} />
              <Text style={[styles.roleBtnText, role === 'Student' && styles.roleBtnTextActive]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleBtn, role === 'Teacher' && styles.roleBtnActive]}
              onPress={() => setRole('Teacher')}
            >
              <Ionicons name="people" size={30} color={role === 'Teacher' ? '#146C43' : '#888'} />
              <Text style={[styles.roleBtnText, role === 'Teacher' && styles.roleBtnTextActive]}>Teacher</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Class Code Input (Only for Student) */}
        {role === 'Student' && (
          <View style={styles.inputContainer}>
            <View style={styles.inputLabelRow}>
              <Ionicons name="pricetag" size={20} color="#146C43" />
              <Text style={styles.inputLabel}>Class Code</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="(Ask your teacher for the class code)"
              value={classCode}
              onChangeText={setClassCode}
            />
          </View>
        )}

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

        {/* Google Sign Up Button */}
        <TouchableOpacity 
          style={[styles.googleButton, !agreedToTerms && styles.googleButtonDisabled]} 
          onPress={handleGoogleSignup}
          disabled={!agreedToTerms}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
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
  inputContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabel: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  input: {
    fontSize: 15,
    color: '#333',
    paddingVertical: 5,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  googleButtonDisabled: {
    opacity: 0.5,
  },
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
