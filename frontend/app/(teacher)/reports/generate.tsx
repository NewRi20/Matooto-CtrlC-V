import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function GenerateReportScreen() {
  const { title, icon } = useLocalSearchParams();
  const router = useRouter();
  
  const [targetClass, setTargetClass] = useState('Grade 3-A');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate Admin Word Automation
    setTimeout(() => {
      setIsGenerating(false);
      setIsDone(true);
    }, 2500);
  };

  const handleExport = () => {
    Alert.alert(
      "Export Successful",
      `${title} has been downloaded to your device as a PDF.`,
      [{ text: "Great!", onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 15 }}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Generator</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.reportHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name={(icon as any) || 'document'} size={40} color="#146C43" />
          </View>
          <Text style={styles.reportTitle}>{title}</Text>
          <Text style={styles.reportSub}>Admin Word Automation</Text>
        </View>

        {!isDone ? (
          <View style={styles.formContainer}>
            <Text style={styles.label}>Select Target Class / Section</Text>
            <View style={styles.buttonGroup}>
              {['Grade 3-A', 'Grade 3-B', 'Grade 4-A'].map((cls) => (
                <TouchableOpacity 
                  key={cls} 
                  style={[styles.toggleBtn, targetClass === cls && styles.toggleBtnActive]}
                  onPress={() => setTargetClass(cls)}
                >
                  <Text style={[styles.toggleBtnText, targetClass === cls && styles.toggleBtnTextActive]}>{cls}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={20} color="#0277BD" />
              <Text style={styles.infoText}>
                This will automatically compile metrics, logs, and records into the official pre-made template format.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleGenerate} 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator color="#FFF" style={{ marginRight: 10 }} />
                  <Text style={styles.primaryButtonText}>Generating Document...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="cog" size={20} color="#FFF" style={{ marginRight: 10 }} />
                  <Text style={styles.primaryButtonText}>Start Automation</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <View style={styles.successCircle}>
              <Ionicons name="checkmark" size={60} color="#FFF" />
            </View>
            <Text style={styles.successTitle}>Generation Complete!</Text>
            <Text style={styles.successSub}>
              The report for {targetClass} has been compiled successfully.
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                <Ionicons name="download-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.exportButtonText}>Download PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareButton} onPress={handleExport}>
                <Ionicons name="share-social-outline" size={20} color="#146C43" style={{ marginRight: 8 }} />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#146C43' },
  content: { padding: 20 },
  reportHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  reportTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  reportSub: { fontSize: 14, color: '#666', marginTop: 5 },
  formContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  buttonGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
  toggleBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#DDD', backgroundColor: '#FFF' },
  toggleBtnActive: { backgroundColor: '#146C43', borderColor: '#146C43' },
  toggleBtnText: { color: '#666', fontWeight: '500' },
  toggleBtnTextActive: { color: '#FFF', fontWeight: 'bold' },
  infoBox: { flexDirection: 'row', backgroundColor: '#E1F5FE', padding: 15, borderRadius: 8, marginBottom: 30 },
  infoText: { flex: 1, marginLeft: 10, color: '#01579B', fontSize: 14, lineHeight: 20 },
  primaryButton: { backgroundColor: '#146C43', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  successContainer: { alignItems: 'center', backgroundColor: '#FFF', padding: 30, borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#28A745', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  successSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30, lineHeight: 22 },
  actionButtons: { width: '100%' },
  exportButton: { backgroundColor: '#146C43', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  exportButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  shareButton: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#146C43' },
  shareButtonText: { color: '#146C43', fontSize: 16, fontWeight: 'bold' },
});
