import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useEffect, useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExternalLink } from '@/components/ExternalLink';
import { MascotCharacter } from '@/components/MascotCharacter';

export default function HomeScreen() {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const [mascotMood, setMascotMood] = useState<'happy' | 'thinking' | 'excited' | 'meditating'>('happy');

  useEffect(() => {
    // Create a pulsing animation
    scale.value = withRepeat(
      withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite repetitions
      true // Reverse
    );

    // Create a slow rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1, // Infinite repetitions
      false // Don't reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });

  const changeMascotMood = () => {
    const moods: Array<'happy' | 'thinking' | 'excited' | 'meditating'> = ['happy', 'thinking', 'excited', 'meditating'];
    const currentIndex = moods.indexOf(mascotMood);
    const nextIndex = (currentIndex + 1) % moods.length;
    setMascotMood(moods[nextIndex]);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        </Animated.View>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Modern Minds</ThemedText>
        <HelloWave />
      </ThemedView>

      <TouchableOpacity onPress={changeMascotMood} activeOpacity={0.8}>
        <ThemedView style={styles.mascotContainer}>
          <MascotCharacter size={150} mood={mascotMood} />
          <ThemedText style={styles.mascotCaption}>
            Meet Sophia, your philosophical guide
            {mascotMood === 'happy' && " (Tap me!)"}
            {mascotMood === 'thinking' && " (Deep in thought...)"}
            {mascotMood === 'excited' && " (Excited to share wisdom!)"}
            {mascotMood === 'meditating' && " (Finding inner peace...)"}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Ancient Wisdom, Modern Life</ThemedText>
        <ThemedText>
          Welcome to Modern Minds, where ancient philosophies meet modern technology to help you live a more balanced, 
          purposeful, and fulfilling life.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.featureContainer}>
        <ThemedText type="subtitle">Features</ThemedText>
        <ThemedView style={styles.feature}>
          <ThemedText type="defaultSemiBold">🧠 Daily Wisdom</ThemedText>
          <ThemedText>
            Explore teachings from ancient philosophers and apply them to your modern life.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.feature}>
          <ThemedText type="defaultSemiBold">📊 Habit Tracking</ThemedText>
          <ThemedText>
            Build better habits with our engaging tracking system inspired by ancient disciplines.
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.feature}>
          <ThemedText type="defaultSemiBold">🔄 Decision Making</ThemedText>
          <ThemedText>
            Use ancient decision-making frameworks to navigate modern challenges.
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.getStartedContainer}>
        <ThemedText type="subtitle">Get Started</ThemedText>
        <ThemedText>
          Tap on any tab below to begin your journey to a more mindful and purposeful life.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 16,
  },
  mascotCaption: {
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  featureContainer: {
    gap: 12,
    marginBottom: 16,
  },
  feature: {
    gap: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
  },
  getStartedContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logoContainer: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  reactLogo: {
    height: 178,
    width: 290,
  },
});
