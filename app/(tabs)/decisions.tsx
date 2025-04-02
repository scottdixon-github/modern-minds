import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { MascotCharacter } from '@/components/MascotCharacter';

const { width } = Dimensions.get('window');

interface Step {
  id: number;
  text: string;
}

interface Framework {
  id: number;
  name: string;
  description: string;
  philosophy: string;
  steps: string[];
}

// Decision frameworks
const frameworks: Framework[] = [
  {
    id: 1,
    name: 'Stoic Fork',
    description: 'Based on Stoic philosophy, this framework helps you focus on what you can control.',
    philosophy: 'Stoicism',
    steps: [
      'Identify what aspects of the situation are within your control',
      'Recognize what aspects are outside your control',
      'Focus your energy only on what you can influence',
      'Accept with equanimity what you cannot change'
    ]
  },
  {
    id: 2,
    name: 'Middle Way',
    description: 'Inspired by Buddhist philosophy, find balance between extremes.',
    philosophy: 'Buddhism',
    steps: [
      'Identify the extreme positions or choices',
      'Reflect on the potential consequences of each extreme',
      'Find a balanced approach that avoids extremes',
      'Choose the path that minimizes suffering for all involved'
    ]
  },
  {
    id: 3,
    name: 'Wu Wei Decision',
    description: 'Based on Taoist principle of "effortless action" - align with the natural flow.',
    philosophy: 'Taoism',
    steps: [
      'Observe the natural patterns in the situation',
      'Consider which option requires the least force or resistance',
      'Identify which choice aligns with your true nature',
      'Choose the path of least resistance that accomplishes your goal'
    ]
  },
  {
    id: 4,
    name: 'Socratic Method',
    description: 'Use systematic questioning to examine assumptions and reach clarity.',
    philosophy: 'Greek Philosophy',
    steps: [
      'What do I think I know about this situation?',
      'How can I test these assumptions?',
      'What contradictions exist in my thinking?',
      'What is the most logical conclusion based on this examination?'
    ]
  }
];

export default function DecisionsScreen() {
  const [decision, setDecision] = useState('');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [inputText, setInputText] = useState('');
  const [mascotMood, setMascotMood] = useState<'thinking' | 'happy' | 'excited' | 'meditating'>('thinking');
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(30);
  const stepOpacity = useSharedValue(0);
  const stepScale = useSharedValue(0.9);
  const resultsOpacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate cards in
    cardOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, { duration: 800 });
  }, []);
  
  useEffect(() => {
    if (selectedFramework) {
      // Animate step in
      stepOpacity.value = withTiming(1, { duration: 500 });
      stepScale.value = withTiming(1, { duration: 500 });
    }
  }, [selectedFramework, currentStep]);
  
  const handleFrameworkSelect = (framework: Framework) => {
    setSelectedFramework(framework);
    setCurrentStep(0);
    setResponses([]);
    setShowResults(false);
    setMascotMood('excited');
    
    // Reset animations
    stepOpacity.value = 0;
    stepScale.value = 0.9;
    resultsOpacity.value = 0;
    
    // Scroll to top
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };
  
  const handleNextStep = (response: string) => {
    const newResponses = [...responses, response];
    setResponses(newResponses);
    setInputText('');
    
    // Animate step out then in
    stepOpacity.value = withSequence(
      withTiming(0, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
    stepScale.value = withSequence(
      withTiming(0.9, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
    
    if (selectedFramework && currentStep < selectedFramework.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Change mascot mood based on progress
      if (currentStep === 0) {
        setMascotMood('thinking');
      } else if (currentStep === selectedFramework.steps.length - 2) {
        setMascotMood('excited');
      }
    } else {
      // Show results
      setShowResults(true);
      setMascotMood('meditating');
      resultsOpacity.value = withDelay(600, withTiming(1, { duration: 800 }));
    }
  };
  
  const resetDecision = () => {
    setDecision('');
    setSelectedFramework(null);
    setCurrentStep(0);
    setResponses([]);
    setShowResults(false);
    setMascotMood('thinking');
    
    // Reset animations
    cardOpacity.value = withTiming(1, { duration: 800 });
    cardTranslateY.value = withTiming(0, { duration: 800 });
    stepOpacity.value = 0;
    stepScale.value = 0.9;
    resultsOpacity.value = 0;
  };
  
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ translateY: cardTranslateY.value }]
    };
  });
  
  const stepAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: stepOpacity.value,
      transform: [{ scale: stepScale.value }]
    };
  });
  
  const resultsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: resultsOpacity.value
    };
  });
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Decision Guide</ThemedText>
        <IconSymbol size={28} name="arrow.left.arrow.right" color="#A1CEDC" />
      </ThemedView>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!selectedFramework ? (
          <>
            <ThemedView style={styles.mascotSection}>
              <MascotCharacter size={100} mood={mascotMood} />
              <ThemedText style={styles.mascotText}>
                I'll help you make better decisions using ancient philosophical frameworks
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.decisionInputContainer}>
              <ThemedText type="subtitle">What decision are you facing?</ThemedText>
              <TextInput
                style={styles.decisionInput}
                placeholder="Enter your decision..."
                placeholderTextColor="rgba(150, 150, 150, 0.8)"
                value={decision}
                onChangeText={setDecision}
                multiline
              />
            </ThemedView>
            
            <ThemedText type="subtitle" style={styles.frameworksTitle}>
              Choose a philosophical framework
            </ThemedText>
            
            <Animated.View style={cardAnimatedStyle}>
              {frameworks.map((framework) => (
                <TouchableOpacity
                  key={framework.id}
                  onPress={() => handleFrameworkSelect(framework)}
                  disabled={!decision.trim()}
                  style={[
                    styles.frameworkCard,
                    !decision.trim() && styles.disabledCard
                  ]}
                >
                  <ThemedText type="defaultSemiBold" style={styles.frameworkName}>
                    {framework.name}
                  </ThemedText>
                  <ThemedText style={styles.frameworkDescription}>
                    {framework.description}
                  </ThemedText>
                  <ThemedText style={styles.frameworkPhilosophy}>
                    Based on {framework.philosophy}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={resetDecision}
            >
              <IconSymbol size={20} name="arrow.left" color="#A1CEDC" />
              <ThemedText style={styles.backButtonText}>Start Over</ThemedText>
            </TouchableOpacity>
            
            <ThemedView style={styles.decisionSummary}>
              <ThemedText type="subtitle">Your Decision</ThemedText>
              <ThemedText style={styles.decisionText}>{decision}</ThemedText>
              <ThemedText style={styles.frameworkSelected}>
                Using {selectedFramework.name} ({selectedFramework.philosophy})
              </ThemedText>
            </ThemedView>
            
            {!showResults ? (
              <Animated.View style={[styles.stepContainer, stepAnimatedStyle]}>
                <ThemedView style={styles.stepHeader}>
                  <ThemedText type="subtitle" style={styles.stepTitle}>
                    Step {currentStep + 1} of {selectedFramework.steps.length}
                  </ThemedText>
                  <MascotCharacter size={60} mood={mascotMood} style={styles.miniMascot} />
                </ThemedView>
                
                <ThemedView style={styles.stepCard}>
                  <ThemedText style={styles.stepQuestion}>
                    {selectedFramework.steps[currentStep]}
                  </ThemedText>
                  <TextInput
                    style={styles.stepInput}
                    placeholder="Enter your response..."
                    placeholderTextColor="rgba(150, 150, 150, 0.8)"
                    multiline
                    value={inputText}
                    onChangeText={setInputText}
                  />
                  <TouchableOpacity 
                    style={styles.nextButton}
                    onPress={() => handleNextStep(inputText)}
                  >
                    <ThemedText style={styles.nextButtonText}>
                      {currentStep < selectedFramework.steps.length - 1 ? 'Next Step' : 'Complete'}
                    </ThemedText>
                    <IconSymbol size={20} name="arrow.right" color="#FFFFFF" />
                  </TouchableOpacity>
                </ThemedView>
              </Animated.View>
            ) : (
              <Animated.View style={[styles.resultsContainer, resultsAnimatedStyle]}>
                <ThemedView style={styles.resultsHeader}>
                  <ThemedText type="subtitle" style={styles.resultsTitle}>
                    Your Decision Path
                  </ThemedText>
                  <MascotCharacter size={60} mood="meditating" style={styles.miniMascot} />
                </ThemedView>
                
                {selectedFramework.steps.map((step, index) => (
                  <ThemedView key={index} style={styles.resultItem}>
                    <ThemedText type="defaultSemiBold" style={styles.resultStep}>
                      {index + 1}. {step}
                    </ThemedText>
                    <ThemedText style={styles.resultResponse}>
                      {responses[index] || "No response provided"}
                    </ThemedText>
                  </ThemedView>
                ))}
                
                <ThemedView style={styles.conclusionCard}>
                  <ThemedText type="subtitle">Philosophical Guidance</ThemedText>
                  <ThemedText style={styles.conclusionText}>
                    Based on your responses using the {selectedFramework.name} framework, 
                    consider what path aligns best with {selectedFramework.philosophy}'s principles. 
                    Remember that the journey of decision-making is as important as the outcome.
                  </ThemedText>
                  <TouchableOpacity 
                    style={styles.newDecisionButton}
                    onPress={resetDecision}
                  >
                    <ThemedText style={styles.newDecisionText}>
                      Make Another Decision
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </Animated.View>
            )}
          </>
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
  scrollContent: {
    paddingBottom: 40,
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  mascotText: {
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  miniMascot: {
    marginRight: -10,
  },
  decisionInputContainer: {
    marginBottom: 24,
  },
  decisionInput: {
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333333',
  },
  frameworksTitle: {
    marginBottom: 12,
  },
  frameworkCard: {
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  disabledCard: {
    opacity: 0.5,
  },
  frameworkName: {
    fontSize: 18,
    marginBottom: 8,
  },
  frameworkDescription: {
    marginBottom: 8,
  },
  frameworkPhilosophy: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#A1CEDC',
  },
  decisionSummary: {
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  decisionText: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
  frameworkSelected: {
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  stepContainer: {
    marginBottom: 24,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    flex: 1,
  },
  stepCard: {
    backgroundColor: 'rgba(161, 206, 220, 0.1)',
    borderRadius: 12,
    padding: 16,
  },
  stepQuestion: {
    fontSize: 16,
    marginBottom: 16,
  },
  stepInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
    color: '#333333',
  },
  nextButton: {
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 8,
  },
  resultsContainer: {
    marginBottom: 24,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: 'rgba(161, 206, 220, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultStep: {
    marginBottom: 8,
  },
  resultResponse: {
    opacity: 0.8,
    fontStyle: 'italic',
  },
  conclusionCard: {
    backgroundColor: 'rgba(161, 206, 220, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  conclusionText: {
    marginTop: 8,
    marginBottom: 16,
    lineHeight: 22,
  },
  newDecisionButton: {
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  newDecisionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
