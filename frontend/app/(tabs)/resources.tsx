import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '@/service/firebaseConfig';
import { getClassesByStudent } from '@/service/classes.repository';
import { ClassData } from '@/service/classes.repository';

export default function ResourcesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('classes');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes when component mounts
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError('User not logged in');
        console.log('No current user');
        return;
      }

      console.log('Current user UID:', currentUser.uid);

      // Fetch classes for the current student
      const studentClasses = await getClassesByStudent(currentUser.uid);
      console.log('Fetched classes:', studentClasses);
      setClasses(studentClasses);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const getStudentCount = (studentIds: any) => {
    if (Array.isArray(studentIds)) {
      return studentIds.length;
    }
    return 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CLASSES & RESOURCES</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'classes' && styles.activeTab]}
          onPress={() => setActiveTab('classes')}
        >
          <Text style={[styles.tabText, activeTab === 'classes' && styles.activeTabText]}>Classes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => setActiveTab('resources')}
        >
          <Text style={[styles.tabText, activeTab === 'resources' && styles.activeTabText]}>Resources</Text>
        </TouchableOpacity>
      </View>

      {/* Classes Tab */}
      {activeTab === 'classes' && (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>MY CLASSES</Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#146C43" />
              <Text style={styles.loadingText}>Loading classes...</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={40} color="#D32F2F" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchClasses}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && classes.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="layers-outline" size={40} color="#888" />
              <Text style={styles.emptyText}>No classes yet</Text>
            </View>
          )}

          {!loading && !error && classes.length > 0 && (
            <View style={styles.classesList}>
              {classes.map((classItem) => (
                <TouchableOpacity
                  key={classItem.id}
                  style={styles.classCard}
                  onPress={() =>
                    router.push({
                      pathname: '/assessment/class-assessments',
                      params: {
                        classId: classItem.id,
                        className: classItem.className,
                      },
                    })
                  }
                >
                  <View style={styles.classCardHeader}>
                    <Text style={styles.className}>{classItem.className}</Text>
                    <Text style={styles.classTeacher}>Grade {classItem.gradeLevel}</Text>
                  </View>
                  <View style={styles.classCardFooter}>
                    <View style={styles.classInfo}>
                      <Ionicons name="book-outline" size={16} color="#146C43" />
                      <Text style={styles.classInfoText}>{classItem.subject}</Text>
                    </View>
                    <View style={styles.classInfo}>
                      <Ionicons name="people-outline" size={16} color="#146C43" />
                      <Text style={styles.classInfoText}>{getStudentCount(classItem.studentIds)} students</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              placeholderTextColor="#888"
            />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>SUBJECTS</Text>

        <View style={styles.gridContainer}>
          {/* Science Card */}
          <TouchableOpacity style={[styles.subjectCard, { backgroundColor: '#8D5524' }]}>
            <Ionicons name="flask-outline" size={40} color="#FFF" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>Science</Text>
            <Text style={styles.cardSubtitle}>10 resources</Text>
          </TouchableOpacity>

          {/* Math Card */}
          <TouchableOpacity style={[styles.subjectCard, { backgroundColor: '#FFB300' }]}>
            <Ionicons name="calculator-outline" size={40} color="#333" style={styles.cardIcon} />
            <Text style={[styles.cardTitle, { color: '#333' }]}>Math</Text>
            <Text style={[styles.cardSubtitle, { color: '#333' }]}>8 resources</Text>
          </TouchableOpacity>

          {/* English Card */}
          <TouchableOpacity style={[styles.subjectCard, { backgroundColor: '#146C43' }]}>
            <Ionicons name="book-outline" size={40} color="#FFF" style={styles.cardIcon} />
            <Text style={styles.cardTitle}>English</Text>
            <Text style={styles.cardSubtitle}>12 resources</Text>
          </TouchableOpacity>

          {/* Filipino Card */}
          <TouchableOpacity style={[styles.subjectCard, { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#146C43' }]}>
            <Ionicons name="language-outline" size={40} color="#146C43" style={styles.cardIcon} />
            <Text style={[styles.cardTitle, { color: '#146C43' }]}>Filipino</Text>
            <Text style={[styles.cardSubtitle, { color: '#146C43' }]}>6 resources</Text>
          </TouchableOpacity>
        </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Cream background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAF9F6',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#146C43', // Forest green
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#146C43',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeTabText: {
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 15,
  },
  classesList: {
    gap: 12,
  },
  classCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  classCardHeader: {
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 4,
  },
  classTeacher: {
    fontSize: 14,
    color: '#888',
  },
  classCardFooter: {
    flexDirection: 'row',
    gap: 20,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classInfoText: {
    fontSize: 13,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#146C43',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15, // Use gap if supported, otherwise rely on margins
  },
  subjectCard: {
    width: '47%', // Slightly less than 50% to account for spacing
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
});
