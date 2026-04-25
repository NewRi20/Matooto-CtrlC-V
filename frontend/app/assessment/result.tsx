import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { SentimentModal } from '../../components/SentimentModal';

export default function ResultScreen() {
  const router = useRouter();
  const { score: scoreParam, assessmentTitle } = useLocalSearchParams<{
    score?: string;
    assessmentTitle?: string;
  }>();
  const [showSentiment, setShowSentiment] = useState(false);

  const score = parseInt(scoreParam || '80', 10);

  let mascotSource;
  if (score <= 20) mascotSource = require('@/assets/images/mascot_score_20.svg');
  else if (score <= 40) mascotSource = require('@/assets/images/mascot_score_40.svg');
  else if (score <= 60) mascotSource = require('@/assets/images/mascot_score_60.svg');
  else if (score <= 80) mascotSource = require('@/assets/images/mascot_score_80.svg');
  else mascotSource = require('@/assets/images/mascot_score_100.svg');

  const handleHomePress = () => {
    setShowSentiment(true);
  };

  const handleSentimentClose = () => {
    setShowSentiment(false);
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Assessment Title */}
        <View style={styles.titleSection}>
          <Text style={styles.assessmentTitle}>
            {assessmentTitle || "Assessment"}
          </Text>
        </View>

        {/* Mascot Header */}
        <View style={styles.mascotArea}>
          <View style={styles.confettiBg}>
            <Image source={mascotSource} style={{ width: 180, height: 180 }} contentFit="contain" />
          </View>
          <Text style={styles.titleText}>🎉 Assessment Complete!</Text>
        </View>

        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.percentageText}>{score}%</Text>
          <Text style={styles.scoreSubText}>4 out of 5 Correct</Text>

          <View style={styles.starsContainer}>
            <Ionicons
              name="star"
              size={40}
              color="#FFD700"
              style={styles.star}
            />
            <Ionicons
              name="star"
              size={40}
              color="#FFD700"
              style={styles.star}
            />
            <Ionicons
              name="star"
              size={40}
              color="#FFD700"
              style={styles.star}
            />
            <Ionicons
              name="star"
              size={40}
              color="#FFD700"
              style={styles.star}
            />
            <Ionicons
              name="star-outline"
              size={40}
              color="#FFD700"
              style={styles.star}
            />
          </View>
          <Text style={styles.starsEarnedText}>4 Stars Earned!</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <Ionicons
              name="time-outline"
              size={24}
              color="#146C43"
              style={styles.statIcon}
            />
            <Text style={styles.statText}>Time taken: 12:34</Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons
              name="book-outline"
              size={24}
              color="#5D4037"
              style={styles.statIcon}
            />
            <Text style={styles.statText}>Unfamiliar words: 3</Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons
              name="trending-up-outline"
              size={24}
              color="#28A745"
              style={styles.statIcon}
            />
            <Text style={styles.statTrendText}>
              ↑ Better than last time! +5%
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryButtonText}>Review Answers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)/assessments')}
          >
            <Text style={styles.primaryButtonText}>Back to Assessments</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeLink} onPress={handleHomePress}>
            <Text style={styles.homeLinkText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SentimentModal
        visible={showSentiment}
        onClose={handleSentimentClose}
        onSelect={handleSentimentClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  titleSection: {
    marginBottom: 20,
    alignItems: "center",
  },
  assessmentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#146C43",
    textAlign: "center",
  },
  mascotArea: {
    alignItems: "center",
    marginVertical: 20,
  },
  confettiBg: {
    marginBottom: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#146C43",
  },
  scoreCard: {
    backgroundColor: "#FAF9F6", // Cream
    width: "100%",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  percentageText: {
    fontSize: 70,
    fontWeight: "900",
    color: "#146C43",
  },
  scoreSubText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5D4037", // Brownish
    marginBottom: 15,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  star: {
    marginHorizontal: 2,
  },
  starsEarnedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5D4037",
  },
  statsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statIcon: {
    marginRight: 15,
    width: 30,
    textAlign: "center",
  },
  statText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  statTrendText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#146C43", // Green
  },
  actionsContainer: {
    width: "100%",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#146C43",
    alignItems: "center",
    marginBottom: 15,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#146C43",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: "#146C43",
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  homeLink: {
    alignItems: "center",
    paddingVertical: 10,
  },
  homeLinkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
});
