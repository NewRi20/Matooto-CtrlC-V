import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleGoogleLogin = () => {
    // Navigate to dashboard for now
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header / Logo Area */}
      <View style={styles.headerContainer}>
        {/* Placeholder for Mascot Image */}
        <View style={styles.mascotPlaceholder}>
          <Ionicons name="happy" size={80} color="#146C43" />
        </View>
        <Text style={styles.logoTitle}>Matooto</Text>
        <Text style={styles.tagline}>Learn. Grow. Soar.</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.welcomeText}>Welcome Back!</Text>
        <Text style={styles.subtitleText}>Sign in to continue your journey.</Text>

        {/* Google Sign In Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Ionicons name="logo-google" size={24} color="#DB4437" style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#FAF9F6', // Cream background for header
    paddingVertical: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  mascotPlaceholder: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#146C43',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    paddingHorizontal: 30,
    flex: 1,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
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
  googleIcon: {
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  signupText: {
    fontSize: 15,
    color: '#666',
  },
  signupLink: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#146C43',
  },
});
