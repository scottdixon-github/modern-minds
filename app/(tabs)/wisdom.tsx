import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  Easing
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Collapsible } from '@/components/Collapsible';
import { MascotCharacter } from '@/components/MascotCharacter';

interface Quote {
  id: number;
  text: string;
  author: string;
}

interface Philosophy {
  id: number;
  name: string;
  icon: string;
  description: string;
  quotes: Quote[];
}

// Sample data for philosophers and quotes
const philosophers: Philosophy[] = [
  {
    id: 1,
    name: 'Stoicism',
    icon: '🏛️',
    description: 'Ancient Greek and Roman philosophy emphasizing virtue, reason, and resilience.',
    quotes: [
      { id: 1, text: "The happiness of your life depends upon the quality of your thoughts.", author: "Marcus Aurelius" },
      { id: 2, text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
      { id: 3, text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" }
    ]
  },
  {
    id: 2,
    name: 'Buddhism',
    icon: '☸️',
    description: 'Eastern philosophy focused on mindfulness, compassion, and the end of suffering.',
    quotes: [
      { id: 1, text: "Peace comes from within. Do not seek it without.", author: "Buddha" },
      { id: 2, text: "The mind is everything. What you think you become.", author: "Buddha" },
      { id: 3, text: "Holding on to anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned.", author: "Buddha" }
    ]
  },
  {
    id: 3,
    name: 'Taoism',
    icon: '☯️',
    description: 'Chinese philosophy emphasizing living in harmony with the Tao (the Way).',
    quotes: [
      { id: 1, text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu" },
      { id: 2, text: "A good traveler has no fixed plans and is not intent on arriving.", author: "Lao Tzu" },
      { id: 3, text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" }
    ]
  },
  {
    id: 4,
    name: 'Confucianism',
    icon: '🧠',
    description: 'Chinese ethical and philosophical system focused on proper conduct and social harmony.',
    quotes: [
      { id: 1, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
      { id: 2, text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
      { id: 3, text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius" }
    ]
  }
];

export default function WisdomScreen() {
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<Philosophy | null>(null);
  const [dailyQuote, setDailyQuote] = useState<Quote>({ id: 0, text: '', author: '' });
  const [mascotMood, setMascotMood] = useState<'thinking' | 'meditating'>('thinking');
  
  const cardScale = useSharedValue(1);
  const quoteOpacity = useSharedValue(0);
  const quoteTranslateY = useSharedValue(20);
  
  useEffect(() => {
    // Get a random quote for the day
    const allQuotes = philosophers.flatMap(p => p.quotes);
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    setDailyQuote(randomQuote);
    
    // Animate the quote in
    quoteOpacity.value = withTiming(1, { duration: 1000 });
    quoteTranslateY.value = withTiming(0, { duration: 1000 });
  }, []);
  
  const handlePhilosophyPress = (philosophy: Philosophy) => {
    setSelectedPhilosophy(philosophy);
    setMascotMood('meditating');
    
    // Card press animation
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };
  
  const quoteAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: quoteOpacity.value,
      transform: [{ translateY: quoteTranslateY.value }]
    };
  });
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Ancient Wisdom</ThemedText>
        <IconSymbol size={28} name="lightbulb.fill" color="#A1CEDC" />
      </ThemedView>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.dailyQuoteContainer, quoteAnimatedStyle]}>
          <ThemedView style={styles.quoteHeader}>
            <ThemedText type="subtitle">Wisdom of the Day</ThemedText>
            <MascotCharacter size={60} mood={mascotMood} style={styles.miniMascot} />
          </ThemedView>
          <ThemedView style={styles.quoteBox}>
            <ThemedText style={styles.quoteText}>"{dailyQuote.text}"</ThemedText>
            <ThemedText style={styles.quoteAuthor}>— {dailyQuote.author}</ThemedText>
          </ThemedView>
        </Animated.View>
        
        <ThemedText type="subtitle" style={styles.sectionTitle}>Philosophical Traditions</ThemedText>
        
        {philosophers.map((philosophy) => (
          <TouchableOpacity 
            key={philosophy.id} 
            onPress={() => handlePhilosophyPress(philosophy)}
            activeOpacity={0.7}
          >
            <Animated.View 
              style={[
                styles.philosophyCard, 
                selectedPhilosophy?.id === philosophy.id && styles.selectedCard,
                { transform: [{ scale: cardScale.value }] }
              ]}
            >
              <ThemedView style={styles.philosophyHeader}>
                <ThemedText style={styles.philosophyIcon}>{philosophy.icon}</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.philosophyName}>
                  {philosophy.name}
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.philosophyDescription}>
                {philosophy.description}
              </ThemedText>
            </Animated.View>
          </TouchableOpacity>
        ))}
        
        {selectedPhilosophy && (
          <ThemedView style={styles.quotesContainer}>
            <ThemedView style={styles.quotesHeader}>
              <ThemedText type="subtitle">Key Teachings</ThemedText>
              <MascotCharacter size={50} mood="meditating" style={styles.miniMascot} />
            </ThemedView>
            {selectedPhilosophy.quotes.map((quote) => (
              <ThemedView key={quote.id} style={styles.quoteItem}>
                <ThemedText>"{quote.text}"</ThemedText>
                <ThemedText style={styles.quoteItemAuthor}>— {quote.author}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        )}
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
  dailyQuoteContainer: {
    marginBottom: 24,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  miniMascot: {
    marginRight: -10,
  },
  quoteBox: {
    backgroundColor: 'rgba(161, 206, 220, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAuthor: {
    textAlign: 'right',
    opacity: 0.8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  philosophyCard: {
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#A1CEDC',
  },
  philosophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  philosophyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  philosophyName: {
    fontSize: 18,
  },
  philosophyDescription: {
    opacity: 0.8,
  },
  quotesContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  quotesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteItem: {
    backgroundColor: 'rgba(161, 206, 220, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  quoteItemAuthor: {
    textAlign: 'right',
    opacity: 0.8,
    marginTop: 4,
    fontSize: 12,
  },
});
