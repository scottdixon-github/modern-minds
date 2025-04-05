import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

interface MascotCharacterProps {
  size?: number;
  mood?: 'happy' | 'thinking' | 'excited' | 'meditating';
  style?: object;
}

/**
 * An animated owl mascot character for the Modern Minds app.
 * The owl represents wisdom, which aligns with the app's focus on ancient philosophies.
 */
export function MascotCharacter({ 
  size = 120, 
  mood = 'happy',
  style = {}
}: MascotCharacterProps) {
  // Animation values
  const bodyBounce = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const wingFlap = useSharedValue(0);
  const headTilt = useSharedValue(0);
  const floatY = useSharedValue(0);
  const floatingElement1Y = useSharedValue(0);
  const floatingElement2Y = useSharedValue(0);
  
  // Use refs to track animation state and prevent memory leaks
  const isComponentMounted = useRef(true);
  
  useEffect(() => {
    // Set mounted flag
    isComponentMounted.current = true;
    
    // Body bounce animation
    bodyBounce.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // Infinite repetitions
      true // Reverse
    );
    
    // Eye blink animation - using setTimeout instead of recursive callback
    const blinkEyes = () => {
      if (!isComponentMounted.current) return;
      
      eyeBlink.value = withSequence(
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 }),
        withTiming(0.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      
      // Schedule next blink with random delay
      setTimeout(blinkEyes, 2000 + Math.random() * 2000);
    };
    
    // Start the blinking
    blinkEyes();
    
    // Wing flap animation (based on mood)
    if (mood === 'excited') {
      wingFlap.value = withRepeat(
        withSequence(
          withTiming(-15, { duration: 200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repetitions
        true // Reverse
      );
    } else if (mood === 'thinking') {
      wingFlap.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repetitions
        true // Reverse
      );
    }
    
    // Head tilt animation (based on mood)
    if (mood === 'thinking') {
      headTilt.value = withRepeat(
        withSequence(
          withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repetitions
        true // Reverse
      );
    } else if (mood === 'meditating') {
      headTilt.value = 0;
    }
    
    // Float animation for meditating mood
    if (mood === 'meditating') {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Infinite repetitions
        true // Reverse
      );
      
      // Floating elements animations
      floatingElement1Y.value = withRepeat(
        withSequence(
          withTiming(-10, { duration: 1500 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        true
      );
      
      floatingElement2Y.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 2000 }),
          withTiming(0, { duration: 2000 })
        ),
        -1,
        true
      );
    }
    
    // Cleanup function to cancel animations and prevent memory leaks
    return () => {
      isComponentMounted.current = false;
      cancelAnimation(bodyBounce);
      cancelAnimation(eyeBlink);
      cancelAnimation(wingFlap);
      cancelAnimation(headTilt);
      cancelAnimation(floatY);
      cancelAnimation(floatingElement1Y);
      cancelAnimation(floatingElement2Y);
    };
  }, [mood]);
  
  // Animated styles
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: bodyBounce.value },
        { translateY: floatY.value }
      ]
    };
  });
  
  const leftEyeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleY: eyeBlink.value }
      ]
    };
  });
  
  const rightEyeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleY: eyeBlink.value }
      ]
    };
  });
  
  const leftWingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${wingFlap.value}deg` },
        { translateX: wingFlap.value / 2 }
      ]
    };
  });
  
  const rightWingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${-wingFlap.value}deg` },
        { translateX: -wingFlap.value / 2 }
      ]
    };
  });
  
  const headAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${headTilt.value}deg` }
      ]
    };
  });
  
  const floatingElement1Style = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: size / 120 * 0.8 },
        { translateY: floatingElement1Y.value }
      ]
    };
  });
  
  const floatingElement2Style = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: size / 120 * 0.8 },
        { translateY: floatingElement2Y.value }
      ]
    };
  });
  
  // Scale all dimensions based on the size prop
  const scale = size / 120;
  
  return (
    <View style={[styles.container, style]}>
      {/* Floating elements for meditating mood */}
      {mood === 'meditating' && (
        <>
          <Animated.View 
            style={[
              styles.floatingElement, 
              { 
                top: -size * 0.2, 
                left: -size * 0.2
              },
              floatingElement1Style
            ]}
          >
            <ThemedText style={{ fontSize: 20 * scale }}>✨</ThemedText>
          </Animated.View>
          <Animated.View 
            style={[
              styles.floatingElement, 
              { 
                top: size * 0.1, 
                right: -size * 0.15
              },
              floatingElement2Style
            ]}
          >
            <ThemedText style={{ fontSize: 20 * scale }}>☯️</ThemedText>
          </Animated.View>
        </>
      )}
      
      {/* Main owl body */}
      <Animated.View style={[styles.body, { width: size, height: size }, bodyAnimatedStyle]}>
        {/* Wings */}
        <Animated.View 
          style={[
            styles.wing, 
            styles.leftWing, 
            { 
              width: size * 0.3, 
              height: size * 0.5,
              left: -size * 0.15,
              top: size * 0.25
            }, 
            leftWingAnimatedStyle
          ]}
        />
        <Animated.View 
          style={[
            styles.wing, 
            styles.rightWing, 
            { 
              width: size * 0.3, 
              height: size * 0.5,
              right: -size * 0.15,
              top: size * 0.25
            }, 
            rightWingAnimatedStyle
          ]}
        />
        
        {/* Head */}
        <Animated.View 
          style={[
            styles.head, 
            { 
              width: size * 0.8, 
              height: size * 0.7,
              borderRadius: size * 0.4
            }, 
            headAnimatedStyle
          ]}
        >
          {/* Eyes */}
          <View style={styles.eyes}>
            <Animated.View 
              style={[
                styles.eye, 
                styles.leftEye, 
                { 
                  width: size * 0.15, 
                  height: size * 0.15,
                  borderRadius: size * 0.075
                }, 
                leftEyeAnimatedStyle
              ]}
            >
              <View 
                style={[
                  styles.pupil, 
                  { 
                    width: size * 0.05, 
                    height: size * 0.05,
                    borderRadius: size * 0.025
                  }
                ]}
              />
            </Animated.View>
            <Animated.View 
              style={[
                styles.eye, 
                styles.rightEye, 
                { 
                  width: size * 0.15, 
                  height: size * 0.15,
                  borderRadius: size * 0.075
                }, 
                rightEyeAnimatedStyle
              ]}
            >
              <View 
                style={[
                  styles.pupil, 
                  { 
                    width: size * 0.05, 
                    height: size * 0.05,
                    borderRadius: size * 0.025
                  }
                ]}
              />
            </Animated.View>
          </View>
          
          {/* Beak */}
          <View 
            style={[
              styles.beak, 
              { 
                width: size * 0.15, 
                height: size * 0.1,
                borderBottomLeftRadius: size * 0.075,
                borderBottomRightRadius: size * 0.075
              }
            ]}
          />
          
          {/* Tusks and Mouth */}
          <View style={styles.expressionContainer}>
            <View style={styles.mouthContainer}>
              {/* Left Tusk */}
              <View 
                style={[
                  styles.tusk, 
                  styles.leftTusk, 
                  { 
                    width: size * 0.05, 
                    height: size * 0.08,
                  }
                ]}
              />
              
              {/* Mouth */}
              <View 
                style={[
                  styles.mouth, 
                  { 
                    width: size * 0.1, 
                    height: size * 0.05,
                  }
                ]}
              />
              
              {/* Right Tusk */}
              <View 
                style={[
                  styles.tusk, 
                  styles.rightTusk, 
                  { 
                    width: size * 0.05, 
                    height: size * 0.08,
                  }
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  head: {
    backgroundColor: '#8E6E53', // Brown color for owl
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#6D5746',
  },
  eyes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    position: 'absolute',
    top: '25%',
  },
  eye: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6D5746',
  },
  leftEye: {
    transform: [{ rotate: '-5deg' }],
  },
  rightEye: {
    transform: [{ rotate: '5deg' }],
  },
  pupil: {
    backgroundColor: '#000000',
    position: 'relative',
  },
  beak: {
    backgroundColor: '#E8B730', // Yellow beak
    position: 'absolute',
    top: '55%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 1,
    borderColor: '#D4A628',
  },
  wing: {
    backgroundColor: '#A68267', // Lighter brown for wings
    position: 'absolute',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#6D5746',
  },
  leftWing: {
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  rightWing: {
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  expressionContainer: {
    position: 'absolute',
    top: '70%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 10,
  },
  mouthContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mouth: {
    backgroundColor: '#5D4037',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 5,
    marginBottom: 2,
  },
  tusk: {
    backgroundColor: '#F5F5F5',
    width: 5,
    borderRadius: 3,
    transform: [{ rotate: '10deg' }],
  },
  leftTusk: {
    transform: [{ rotate: '-20deg' }],
    marginRight: -2,
  },
  rightTusk: {
    transform: [{ rotate: '20deg' }],
    marginLeft: -2,
  },
});
