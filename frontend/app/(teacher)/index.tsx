import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TeacherDashboard() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="happy" size={32} color="#146C43" />
            <View style={{ marginLeft: 5 }}>
              <Text style={styles.logoTitle}>Matooto</Text>
              <Text style={styles.logoSub}>Learn. Grow. Soar.</Text>
            </View>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.bellIcon}>
              <Ionicons name="notifications-outline" size={24} color="#333" />
            </TouchableOpacity>
            <View style={{ position: 'relative', zIndex: 10 }}>
              <TouchableOpacity onPress={() => setShowProfileMenu(!showProfileMenu)}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AJ</Text>
                </View>
              </TouchableOpacity>
              
              {showProfileMenu && (
                <View style={styles.profileMenu}>
                  <TouchableOpacity style={styles.menuItem} onPress={() => { setShowProfileMenu(false); router.replace('/login'); }}>
                    <Ionicons name="log-out-outline" size={20} color="#D32F2F" />
                    <Text style={styles.menuItemText}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Good morning, Teacher AJ!</Text>
          <Text style={styles.dateText}>Wednesday, April 23</Text>
        </View>

        {/* Today's Schedule */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardActive}>
          <View style={styles.cardIndicatorActive} />
          <View style={styles.scheduleContent}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleTitle}>Grade 7-A English</Text>
              <View style={styles.statusBadgeActive}>
                <Text style={styles.statusTextActive}>Active</Text>
              </View>
            </View>
            <View style={styles.scheduleDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.detailText}>10:00 AM - 11:00 AM</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={14} color="#666" />
                <Text style={styles.detailText}>28 students</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startClassButton}>
              <Text style={styles.startClassText}>Start Class</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardUpcoming}>
          <View style={styles.scheduleContent}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleTitle}>Grade 7-B English</Text>
              <View style={styles.statusBadgeUpcoming}>
                <Text style={styles.statusTextUpcoming}>Upcoming</Text>
              </View>
            </View>
            <View style={styles.scheduleDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.detailText}>1:00 PM - 2:00 PM</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="people-outline" size={14} color="#666" />
                <Text style={styles.detailText}>25 students</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Pending Stories */}
        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>PENDING STORIES</Text>
            <View style={styles.badgeRed}>
              <Text style={styles.badgeRedText}>3</Text>
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>
          {/* Story 1 */}
          <View style={styles.listItem}>
            <Ionicons name="document-text-outline" size={24} color="#146C43" />
            <Text style={styles.listTitle}>The Brave Cockatoo</Text>
            <View style={styles.statusBadgeGreen}>
              <Text style={styles.statusTextGreen}>Ready to Post</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.postNowText}>Post Now</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          {/* Story 2 */}
          <View style={styles.listItem}>
            <Ionicons name="document-text-outline" size={24} color="#146C43" />
            <Text style={styles.listTitle}>Ang Mabuting Kaibigan</Text>
            <View style={styles.statusBadgeYellow}>
              <Text style={styles.statusTextYellow}>Scheduled: Apr 25</Text>
            </View>
          </View>
          <View style={styles.divider} />

          {/* Story 3 */}
          <View style={styles.listItem}>
            <Ionicons name="document-text-outline" size={24} color="#146C43" />
            <Text style={styles.listTitle}>Ocean Mystery</Text>
            <View style={styles.statusBadgeGray}>
              <Text style={styles.statusTextGray}>Draft</Text>
            </View>
          </View>
        </View>

        {/* Reports Shortcut */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>REPORTS SHORTCUT</Text>
        <View style={styles.reportsContainer}>
          <TouchableOpacity style={styles.reportCard}>
            <Ionicons name="people" size={32} color="#146C43" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.reportTitle}>Parent Consultation{'\n'}Report</Text>
              <Text style={styles.generateText}>Generate</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportCard}>
            <Ionicons name="stats-chart" size={32} color="#146C43" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.reportTitle}>Reading Comprehension{'\n'}Report</Text>
              <Text style={styles.generateText}>Generate</Text>
            </View>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#146C43',
    lineHeight: 22,
  },
  logoSub: {
    fontSize: 10,
    color: '#666',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 15,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#146C43',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  greetingSection: {
    marginBottom: 25,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4A3424',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#146C43',
    marginBottom: 10,
  },
  viewAllText: {
    color: '#146C43',
    fontWeight: '500',
  },
  cardActive: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardIndicatorActive: {
    width: 6,
    backgroundColor: '#146C43',
  },
  scheduleContent: {
    flex: 1,
    padding: 15,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadgeActive: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  statusTextActive: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeUpcoming: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusTextUpcoming: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleDetails: {
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  startClassButton: {
    backgroundColor: '#146C43',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startClassText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardUpcoming: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 20,
  },
  importContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE082',
    justifyContent: 'space-between',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#146C43',
    flex: 0.48,
  },
  iconBox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  importText: {
    color: '#146C43',
    fontWeight: '600',
    fontSize: 12,
  },
  badgeRed: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 10,
  },
  badgeRedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  listTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  statusBadgeGreen: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    marginRight: 10,
  },
  statusTextGreen: {
    color: '#2E7D32',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadgeYellow: {
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  statusTextYellow: {
    color: '#F57F17',
    fontSize: 10,
    fontWeight: '600',
  },
  statusBadgeGray: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusTextGray: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
  },
  postNowText: {
    color: '#146C43',
    fontWeight: '600',
    fontSize: 12,
  },
  reportsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportCard: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  reportTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A3424',
    marginBottom: 5,
  },
  generateText: {
    color: '#146C43',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileMenu: {
    position: 'absolute',
    top: 45,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 120,
    zIndex: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  menuItemText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});
