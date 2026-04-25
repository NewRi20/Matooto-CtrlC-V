import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/service/auth.service';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, initializing, signInWithEmail } = useAuth();

  const routeByProfile = async (uid: string) => {
    const profile = await getUserProfile(uid);

    if (!profile.onboarding) {
      router.replace('/(onboarding)/welcome' as any);
      return;
    }

    if (profile.role === 'Teacher') {
      router.replace('/(teacher)' as any);
      return;
    }

    router.replace('/(tabs)' as any);
  };

  useEffect(() => {
    if (initializing || !user) {
      return;
    }

    void routeByProfile(user.uid);
  }, [initializing, router, user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing information', 'Enter your email and password to continue.');
      return;
    }

    try {
      const signedInUser = await signInWithEmail(email.trim(), password);
      await routeByProfile(signedInUser.uid);
    } catch (error) {
      Alert.alert('Login failed', 'Check your email/password and try again.');
    }
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
        <Text style={styles.subtitleText}>Sign in with your email and password.</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, initializing && styles.googleButtonDisabled]}
          onPress={handleLogin}
          disabled={initializing}
        >
          <Text style={styles.googleButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
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
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  loginButton: {
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
    marginTop: 8,
  },
  googleButtonDisabled: {
    opacity: 0.6,
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
