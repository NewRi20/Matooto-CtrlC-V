import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResourcesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RESOURCES</Text>
        <Ionicons name="search" size={24} color="#146C43" />
      </View>

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
