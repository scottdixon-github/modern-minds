import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Collapsible } from '@/components/Collapsible';

interface ProfileData {
  name: string;
  joinDate: string;
  streak: number;
  favoritePhilosophy: string;
  completedHabits: number;
  decisionsGuided: number;
}

interface PhilosophicalPreference {
  id: number;
  name: string;
  selected: boolean;
}

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  dailyReminders: boolean;
  weeklyReports: boolean;
  dataSync: boolean;
}

// Sample profile data
const profileData: ProfileData = {
  name: 'Alex Johnson',
  joinDate: 'April 2025',
  streak: 12,
  favoritePhilosophy: 'Stoicism',
  completedHabits: 42,
  decisionsGuided: 15
};

// Sample philosophical preferences
const philosophicalPreferences: PhilosophicalPreference[] = [
  { id: 1, name: 'Stoicism', selected: true },
  { id: 2, name: 'Buddhism', selected: true },
  { id: 3, name: 'Taoism', selected: true },
  { id: 4, name: 'Confucianism', selected: false },
  { id: 5, name: 'Epicureanism', selected: false },
  { id: 6, name: 'Existentialism', selected: false }
];

// Sample app settings
const initialSettings: AppSettings = {
  darkMode: false,
  notifications: true,
  dailyReminders: true,
  weeklyReports: true,
  dataSync: false
};

export default function ProfileScreen() {
  const [preferences, setPreferences] = useState<PhilosophicalPreference[]>(philosophicalPreferences);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  
  // Animation values
  const profileOpacity = useSharedValue(0);
  const profileTranslateY = useSharedValue(30);
  const statsScale = useSharedValue(0.8);
  
  useEffect(() => {
    // Animate profile in
    profileOpacity.value = withTiming(1, { duration: 800 });
    profileTranslateY.value = withTiming(0, { duration: 800 });
    
    // Animate stats in with a bounce effect
    statsScale.value = withSequence(
      withTiming(1.1, { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
      withTiming(1, { duration: 200 })
    );
  }, []);
  
  const togglePreference = (id: number) => {
    setPreferences(prevPreferences => 
      prevPreferences.map(pref => 
        pref.id === id ? { ...pref, selected: !pref.selected } : pref
      )
    );
  };
  
  const toggleSetting = (setting: keyof AppSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [setting]: !prevSettings[setting]
    }));
  };
  
  const profileAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: profileOpacity.value,
      transform: [{ translateY: profileTranslateY.value }]
    };
  });
  
  const statsAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: statsScale.value }]
    };
  });
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
        <IconSymbol size={28} name="person.fill" color="#A1CEDC" />
      </ThemedView>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.profileSection, profileAnimatedStyle]}>
          <ThemedView style={styles.profileHeader}>
            <ThemedView style={styles.profileAvatar}>
              <ThemedText style={styles.avatarText}>
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.profileInfo}>
              <ThemedText type="defaultSemiBold" style={styles.profileName}>
                {profileData.name}
              </ThemedText>
              <ThemedText style={styles.profileJoinDate}>
                Member since {profileData.joinDate}
              </ThemedText>
              <ThemedText style={styles.profileFavorite}>
                Favorite philosophy: {profileData.favoritePhilosophy}
              </ThemedText>
            </ThemedView>
          </ThemedView>
          
          <Animated.View style={[styles.statsContainer, statsAnimatedStyle]}>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>{profileData.streak}</ThemedText>
              <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>{profileData.completedHabits}</ThemedText>
              <ThemedText style={styles.statLabel}>Habits Completed</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statItem}>
              <ThemedText style={styles.statValue}>{profileData.decisionsGuided}</ThemedText>
              <ThemedText style={styles.statLabel}>Decisions Guided</ThemedText>
            </ThemedView>
          </Animated.View>
        </Animated.View>
        
        <Collapsible title="Philosophical Preferences">
          <ThemedText style={styles.sectionDescription}>
            Select the philosophical traditions you're interested in exploring.
          </ThemedText>
          {preferences.map(pref => (
            <TouchableOpacity 
              key={pref.id} 
              style={styles.preferenceItem}
              onPress={() => togglePreference(pref.id)}
            >
              <ThemedText>{pref.name}</ThemedText>
              <ThemedView 
                style={[
                  styles.checkBox,
                  pref.selected && styles.checkBoxSelected
                ]}
              >
                {pref.selected && (
                  <IconSymbol size={16} name="checkmark" color="#FFFFFF" />
                )}
              </ThemedView>
            </TouchableOpacity>
          ))}
        </Collapsible>
        
        <Collapsible title="App Settings">
          <ThemedView style={styles.settingItem}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting('darkMode')}
              trackColor={{ false: '#D9D9D9', true: '#A1CEDC' }}
              thumbColor={settings.darkMode ? '#FFFFFF' : '#F4F4F4'}
            />
          </ThemedView>
          <ThemedView style={styles.settingItem}>
            <ThemedText>Enable Notifications</ThemedText>
            <Switch
              value={settings.notifications}
              onValueChange={() => toggleSetting('notifications')}
              trackColor={{ false: '#D9D9D9', true: '#A1CEDC' }}
              thumbColor={settings.notifications ? '#FFFFFF' : '#F4F4F4'}
            />
          </ThemedView>
          <ThemedView style={styles.settingItem}>
            <ThemedText>Daily Reminders</ThemedText>
            <Switch
              value={settings.dailyReminders}
              onValueChange={() => toggleSetting('dailyReminders')}
              trackColor={{ false: '#D9D9D9', true: '#A1CEDC' }}
              thumbColor={settings.dailyReminders ? '#FFFFFF' : '#F4F4F4'}
            />
          </ThemedView>
          <ThemedView style={styles.settingItem}>
            <ThemedText>Weekly Progress Reports</ThemedText>
            <Switch
              value={settings.weeklyReports}
              onValueChange={() => toggleSetting('weeklyReports')}
              trackColor={{ false: '#D9D9D9', true: '#A1CEDC' }}
              thumbColor={settings.weeklyReports ? '#FFFFFF' : '#F4F4F4'}
            />
          </ThemedView>
          <ThemedView style={styles.settingItem}>
            <ThemedText>Sync Data to Cloud</ThemedText>
            <Switch
              value={settings.dataSync}
              onValueChange={() => toggleSetting('dataSync')}
              trackColor={{ false: '#D9D9D9', true: '#A1CEDC' }}
              thumbColor={settings.dataSync ? '#FFFFFF' : '#F4F4F4'}
            />
          </ThemedView>
        </Collapsible>
        
        <Collapsible title="About Modern Minds">
          <ThemedText style={styles.aboutText}>
            Modern Minds brings ancient philosophical wisdom to your daily life. Our app helps you make better decisions, 
            build meaningful habits, and live more intentionally by applying time-tested philosophical principles to modern challenges.
          </ThemedText>
          <ThemedText style={styles.versionText}>
            Version 1.0.0
          </ThemedText>
          <TouchableOpacity style={styles.feedbackButton}>
            <ThemedText style={styles.feedbackButtonText}>
              Send Feedback
            </ThemedText>
          </TouchableOpacity>
        </Collapsible>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    marginBottom: 4,
  },
  profileJoinDate: {
    opacity: 0.7,
    marginBottom: 4,
  },
  profileFavorite: {
    opacity: 0.7,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A1CEDC',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  sectionDescription: {
    marginBottom: 16,
    opacity: 0.8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(161, 206, 220, 0.1)',
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(161, 206, 220, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxSelected: {
    backgroundColor: '#A1CEDC',
    borderColor: '#A1CEDC',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(161, 206, 220, 0.1)',
  },
  aboutText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  versionText: {
    opacity: 0.6,
    marginBottom: 16,
  },
  feedbackButton: {
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#A1CEDC',
    fontWeight: 'bold',
  },
});
