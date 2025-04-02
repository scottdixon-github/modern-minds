import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

interface Habit {
  id: number;
  name: string;
  description: string;
  philosophy: string;
  streak: number;
  completed: boolean;
  color: string;
}

// Sample habit data
const initialHabits: Habit[] = [
  { 
    id: 1, 
    name: 'Morning Meditation', 
    description: 'Start the day with 10 minutes of mindfulness',
    philosophy: 'Buddhism',
    streak: 3,
    completed: false,
    color: '#A1CEDC'
  },
  { 
    id: 2, 
    name: 'Journaling', 
    description: 'Evening reflection on daily events',
    philosophy: 'Stoicism',
    streak: 5,
    completed: false,
    color: '#D0A1DC'
  },
  { 
    id: 3, 
    name: 'Nature Walk', 
    description: 'Connect with nature for 20 minutes',
    philosophy: 'Taoism',
    streak: 1,
    completed: false,
    color: '#A1DCA5'
  },
  { 
    id: 4, 
    name: 'Gratitude Practice', 
    description: 'List three things you are grateful for',
    philosophy: 'Stoicism',
    streak: 7,
    completed: false,
    color: '#DCA1A1'
  }
];

// Days of the week
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitsScreen() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  
  // Animation values
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(30);
  
  useEffect(() => {
    // Animate the list in
    listOpacity.value = withTiming(1, { duration: 800 });
    listTranslateY.value = withTiming(0, { duration: 800 });
  }, []);
  
  const toggleHabitCompletion = (id: number) => {
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit.id === id 
          ? { 
              ...habit, 
              completed: !habit.completed, 
              streak: !habit.completed ? habit.streak + 1 : habit.streak - 1 
            } 
          : habit
      )
    );
  };
  
  const listAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      transform: [{ translateY: listTranslateY.value }]
    };
  });
  
  const getCompletionPercentage = () => {
    const completedCount = habits.filter(habit => habit.completed).length;
    return (completedCount / habits.length) * 100;
  };
  
  const progressWidth = useSharedValue(0);
  
  useEffect(() => {
    progressWidth.value = withTiming(getCompletionPercentage(), { 
      duration: 500, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
  }, [habits]);
  
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`
    };
  });
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Habit Tracker</ThemedText>
        <IconSymbol size={28} name="chart.bar.fill" color="#A1CEDC" />
      </ThemedView>
      
      <ThemedView style={styles.progressContainer}>
        <ThemedText type="subtitle">Today's Progress</ThemedText>
        <ThemedView style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
        </ThemedView>
        <ThemedText style={styles.progressText}>
          {habits.filter(habit => habit.completed).length} of {habits.length} completed
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.calendarContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarScroll}>
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDay(index)}
              style={[
                styles.dayItem,
                selectedDay === index && styles.selectedDayItem
              ]}
            >
              <ThemedText 
                style={[
                  styles.dayText,
                  selectedDay === index && styles.selectedDayText
                ]}
              >
                {day}
              </ThemedText>
              <ThemedText 
                style={[
                  styles.dateText,
                  selectedDay === index && styles.selectedDayText
                ]}
              >
                {new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + index)).getDate()}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.habitsContainer, listAnimatedStyle]}>
          {habits.map((habit, index) => {
            const checkScale = useSharedValue(1);
            const checkOpacity = useSharedValue(habit.completed ? 1 : 0);
            
            const handlePress = () => {
              toggleHabitCompletion(habit.id);
              
              checkScale.value = withSequence(
                withTiming(1.3, { duration: 200 }),
                withTiming(1, { duration: 200 })
              );
              
              checkOpacity.value = withTiming(habit.completed ? 0 : 1, { duration: 300 });
            };
            
            const checkAnimatedStyle = useAnimatedStyle(() => {
              return {
                opacity: checkOpacity.value,
                transform: [{ scale: checkScale.value }]
              };
            });
            
            const cardAnimatedStyle = useAnimatedStyle(() => {
              return {
                opacity: withDelay(index * 100, withTiming(1, { duration: 500 })),
                transform: [
                  { 
                    translateY: withDelay(
                      index * 100, 
                      withTiming(0, { duration: 500 })
                    ) 
                  }
                ]
              };
            });
            
            return (
              <Animated.View 
                key={habit.id} 
                style={[
                  styles.habitCard,
                  { borderLeftColor: habit.color, borderLeftWidth: 4 },
                  cardAnimatedStyle
                ]}
              >
                <ThemedView style={styles.habitContent}>
                  <ThemedView>
                    <ThemedText type="defaultSemiBold" style={styles.habitName}>
                      {habit.name}
                    </ThemedText>
                    <ThemedText style={styles.habitDescription}>
                      {habit.description}
                    </ThemedText>
                    <ThemedText style={styles.habitPhilosophy}>
                      Inspired by {habit.philosophy}
                    </ThemedText>
                  </ThemedView>
                  
                  <ThemedView style={styles.habitStats}>
                    <ThemedView style={styles.streakContainer}>
                      <IconSymbol size={16} name="flame.fill" color="#FFA500" />
                      <ThemedText style={styles.streakText}>{habit.streak}</ThemedText>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
                
                <TouchableOpacity 
                  style={[
                    styles.checkButton,
                    habit.completed && styles.checkedButton
                  ]} 
                  onPress={handlePress}
                >
                  <Animated.View style={checkAnimatedStyle}>
                    <IconSymbol 
                      size={24} 
                      name="checkmark" 
                      color="#FFFFFF" 
                    />
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      </ScrollView>
      
      <TouchableOpacity style={styles.addButton}>
        <IconSymbol size={24} name="plus" color="#FFFFFF" />
      </TouchableOpacity>
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
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    borderRadius: 4,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A1CEDC',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 4,
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.7,
  },
  calendarContainer: {
    marginBottom: 16,
  },
  calendarScroll: {
    flexDirection: 'row',
  },
  dayItem: {
    width: width / 7 - 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
  },
  selectedDayItem: {
    backgroundColor: '#A1CEDC',
  },
  dayText: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  habitsContainer: {
    marginBottom: 80,
  },
  habitCard: {
    backgroundColor: 'rgba(161, 206, 220, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  habitContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  habitName: {
    fontSize: 16,
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  habitPhilosophy: {
    fontSize: 12,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  habitStats: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkedButton: {
    backgroundColor: '#4CAF50',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
