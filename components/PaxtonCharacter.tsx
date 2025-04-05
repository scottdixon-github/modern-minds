/**
 * PaxtonCharacter.tsx
 * 
 * A customizable animated character component representing a young boy
 * with blonde hair and an orange t-shirt. Features various animations
 * including bouncing, blinking, and interactive responses.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
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

// Component props interface with detailed documentation
interface PaxtonCharacterProps {
  /** Size of the character in pixels (default: 120) */
  size?: number;
  /** Character's emotional state (default: 'happy') */
  mood?: 'happy' | 'thinking' | 'excited' | 'shy';
  /** Additional style properties to apply to the container */
  style?: object;
  /** Whether the character faces left instead of right */
  facingLeft?: boolean;
  /** Callback function when the character is pressed */
  onPress?: () => void;
}

/**
 * PaxtonCharacter Component
 * 
 * An animated character component that responds to user interaction
 * and displays different moods through animations.
 */
export function PaxtonCharacter({ 
  size = 120, 
  mood = 'happy',
  style = {},
  facingLeft = false,
  onPress
}: PaxtonCharacterProps) {
  // ===== Animation Shared Values =====
  // Core body animations
  const bodyBounce = useSharedValue(0);      // Controls the up/down bounce of the body
  const bodyRotation = useSharedValue(0);    // Controls slight rotation of the body
  const jumpHeight = useSharedValue(0);      // Controls jump animation height
  const characterRotation = useSharedValue(0); // Controls 360-degree rotation
  
  // Limb animations
  const armWave = useSharedValue(0);         // Controls arm waving motion
  const legSwing = useSharedValue(0);        // Controls leg swinging motion
  
  // Head and face animations
  const headTilt = useSharedValue(0);        // Controls head tilting angle
  const eyeBlink = useSharedValue(1);        // Controls eye blinking (1=open, 0=closed)
  const mouthSmile = useSharedValue(0);      // Controls mouth smile intensity
  const floatY = useSharedValue(0);          // Controls floating effect

  // Reference to track component mount state (prevents memory leaks)
  const isComponentMounted = useRef(true);
  
  // Helper function to safely start an animation and track its handle
  const startAnimation = (animatedValue: Animated.SharedValue<number>, animation: any) => {
    try {
      // Cancel any existing animation on this value
      cancelAnimation(animatedValue);
      // Start new animation and track the handle
      animatedValue.value = animation;
    } catch (error) {
      console.warn('Animation error:', error);
    }
  };

  /**
   * Performs a jump animation with coordinated arm wave and head tilt
   * when the character is pressed.
   */
  const performJump = () => {
    try {
      // Cancel any existing animations first to prevent conflicts
      cancelAnimation(jumpHeight);
      cancelAnimation(armWave);
      cancelAnimation(headTilt);
      cancelAnimation(floatY);
      
      // Physics-based jump animation
      startAnimation(jumpHeight, withSequence(
        // Jump up with ease-out for natural acceleration
        withTiming(-30, { 
          duration: 280, 
          easing: Easing.out(Easing.quad) 
        }),
        // Brief pause at peak
        withDelay(50, withTiming(-30)),
        // Fall down with ease-in for gravity effect
        withTiming(0, { 
          duration: 350, 
          easing: Easing.in(Easing.quad)
        }),
        // Subtle bounce when landing
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 150 })
      ));
      
      // Coordinated hat movement (subtle lag effect)
      startAnimation(floatY, withSequence(
        withDelay(30, withTiming(-8, { duration: 200 })),
        withDelay(50, withTiming(0, { duration: 300 }))
      ));
      
      // Arm wave animation synchronized with jump
      startAnimation(armWave, withSequence(
        // Raise arm quickly
        withTiming(40, { 
          duration: 180, 
          easing: Easing.out(Easing.ease) 
        }),
        // Swing back slightly past neutral
        withTiming(-20, { 
          duration: 220, 
          easing: Easing.inOut(Easing.ease) 
        }),
        // Return to neutral with slight overshoot
        withTiming(5, { 
          duration: 150, 
          easing: Easing.out(Easing.ease) 
        }),
        withTiming(0, { duration: 100 })
      ));
      
      // Subtle head tilt animation (reduced tilt)
      startAnimation(headTilt, withSequence(
        withTiming(5, { duration: 150 }), // Reduced from 10 to 5 degrees
        withTiming(-2, { duration: 200 }), // Reduced from -5 to -2 degrees
        withTiming(0, { duration: 150 })
      ));
      
      // Trigger callback if provided
      if (onPress) {
        onPress();
      }
    } catch (error) {
      console.warn('Jump animation error:', error);
      // Ensure values are reset to prevent stuck animations
      jumpHeight.value = 0;
      armWave.value = 1;
      headTilt.value = 1;
    }
  };
  
  /**
   * Setup and manage all character animations based on the current mood
   */
  useEffect(() => {
    // Safety check - initialize all shared values to prevent undefined errors
    bodyBounce.value = bodyBounce.value || 0;
    armWave.value = armWave.value || 0;
    headTilt.value = headTilt.value || 0;
    floatY.value = floatY.value || 0;
    eyeBlink.value = eyeBlink.value || 1;
    legSwing.value = legSwing.value || 0;
    bodyRotation.value = bodyRotation.value || 0;
    mouthSmile.value = mouthSmile.value || 0;
    characterRotation.value = characterRotation.value || 0;
    jumpHeight.value = jumpHeight.value || 0;
    
    // Mark component as mounted for animation management
    isComponentMounted.current = true;
    
    // Animation handles for cleanup
    const animationHandles = [];
    
    // ===== CORE ANIMATIONS (applied to all moods) =====
    
    /**
     * Subtle body bounce animation for idle state
     * Creates a gentle up and down movement to make character feel alive
     */
    startAnimation(bodyBounce, withRepeat(
      withSequence(
        withTiming(-3, { 
          duration: 1500, 
          easing: Easing.inOut(Easing.sin) 
        }),
        withTiming(0, { 
          duration: 1500, 
          easing: Easing.inOut(Easing.sin) 
        })
      ),
      -1, // Infinite repetitions
      true // Reverse animation
    ));

    /**
     * Keep legs stationary
     * No movement to ensure legs stay in a fixed position
     */
    // Leg animation removed to keep legs stationary
    startAnimation(legSwing, 0); // Set to 0 to ensure no movement

    // Setup idle breathing animation
    const setupIdleBreathing = () => {
      // Main breath cycle (reduced intensity)
      startAnimation(bodyBounce, withRepeat(
        withSequence(
          withTiming(1.2, { // Inhale (smaller movement)
            duration: 2000, // Slower duration
            easing: Easing.inOut(Easing.sin)
          }),
          withTiming(0, { // Exhale
            duration: 2200,
            easing: Easing.inOut(Easing.sin)
          })
        ),
        -1,
        true
      ));
      
      // More subtle shoulder movement
      startAnimation(armWave, withRepeat(
        withSequence(
          withTiming(0.8, { duration: 2100 }), // Reduced range
          withTiming(-0.5, { duration: 2300 })
        ),
        -1,
        true
      ));
    };

    // Setup automatic eye blinking
    const setupEyeBlink = () => {
      let activeAnimation = true;
      
      const blink = (isFullBlink = true) => {
        if (!isComponentMounted.current || !activeAnimation) return;
        
        // Rare blinking with extremely long intervals
        const nextBlink = isFullBlink 
          ? Math.random() * 30000 + 20000 // 20-50s for full blinks (very rare)
          : Math.random() * 0 + 0; // No micro-blinks at all
        
        // More natural blink animation sequence
        eyeBlink.value = withSequence(
          // Quick close (humans close eyes quickly)
          withTiming(isFullBlink ? 0 : 0.4, { 
            duration: isFullBlink ? 70 : 40, 
            easing: Easing.in(Easing.cubic) // Accelerated closing
          }),
          // Brief pause when eyes are closed (for full blinks only)
          ...(isFullBlink ? [withTiming(0, { duration: 30 })] : []),
          // Slower, gradual opening (humans open eyes more gradually)
          withTiming(1, { 
            duration: isFullBlink ? 200 : 120, 
            easing: Easing.out(Easing.cubic) // Decelerated opening
          })
        );
        
        // Schedule next blink (alternate between full and micro)
        setTimeout(() => blink(!isFullBlink), nextBlink);
      };
      
      // Start blink cycle with a full blink
      blink(true);
      
      // Cleanup function
      return () => { activeAnimation = false; };
    };

    // Setup very infrequent hand movements (approximately every 30 seconds)
    const setupHandMovements = () => {
      // Infrequent arm movements approximately every 30 seconds
      const randomizeArmMovements = () => {
        // Cancel any existing animation first
        cancelAnimation(armWave);
        
        // 90% chance to not move arms at all during this cycle
        if (Math.random() < 0.9) {
          armWave.value = 0; // Reset arm position
        } else {
          // Very subtle arm movement when it does occur
          const randomAngle = Math.random() * 8 - 3; // Random angle between -3 and 5 degrees (very subtle)
          const randomDuration = 2000 + Math.random() * 1000; // Random duration between 2-3 seconds
          
          startAnimation(armWave, withSequence(
            withTiming(randomAngle, { duration: randomDuration }),
            withTiming(0, { duration: 1000 }) // Return to neutral position
          ));
        }
        
        // Schedule next check approximately every 30 seconds (25-35 second range)
        const nextInterval = 25000 + Math.random() * 10000;
        setTimeout(randomizeArmMovements, nextInterval);
      };
      
      // Start the infrequent movement cycle
      randomizeArmMovements();
    };

    // Initialize idle breathing, eye blinking, and hand movements
    setupIdleBreathing();
    setupEyeBlink();
    setupHandMovements();

    // ===== MOOD-SPECIFIC ANIMATIONS =====
    
    /**
     * Happy mood animations - bouncy and energetic
     */
    if (mood === 'happy') {
      // Continuous bounce
      startAnimation(bodyBounce, withRepeat(
        withSequence(
          withTiming(-8, { 
            duration: 600, 
            easing: Easing.out(Easing.quad) 
          }),
          withTiming(0, { 
            duration: 800, 
            easing: Easing.inOut(Easing.sin) 
          })
        ),
        -1,
        true
      ));
      
      // Bigger smile animation with eye squint
      startAnimation(mouthSmile, withTiming(1.5, { 
        duration: 400, 
        easing: Easing.out(Easing.back(1.8)) 
      }));
      
      // Extremely rare arm movements in happy mood (approximately every 30 seconds)
      const happyWave = () => {
        // 95% chance to not wave at all during this cycle
        if (Math.random() < 0.95) {
          // Do nothing, just schedule next check
        } else {
          // Very subtle arm movement when it does occur
          const randomAngle = Math.random() * 10 - 3; // Random angle between -3 and 7 degrees (very subtle)
          
          startAnimation(armWave, withSequence(
            withTiming(randomAngle, { duration: 1500 }),
            withTiming(0, { duration: 1000 }) // Return to neutral position
          ));
        }
        
        // Schedule next check approximately every 30 seconds (28-32 second range)
        setTimeout(happyWave, 28000 + Math.random() * 4000);
      };
      
      // Start the random wave cycle
      happyWave();
    }
    
    /**
     * Thinking mood animations - thoughtful and deliberate
     */
    else if (mood === 'thinking') {
      // Subtle chin stroking motion (reduced tilt)
      startAnimation(headTilt, withRepeat(
        withSequence(
          withTiming(7, { duration: 2000 }), // Reduced from 15 to 7 degrees
          withTiming(3, { duration: 1500 }), // Reduced from 5 to 3 degrees
          withTiming(7, { duration: 2500 }) // Reduced from 15 to 7 degrees
        ),
        -1,
        true
      ));
      
      // Slow, deep breathing
      startAnimation(bodyBounce, withRepeat(
        withTiming(1.5, { duration: 3000 }),
        -1,
        true
      ));
      
      // Occasional eye gaze changes
      const changeGaze = () => {
        startAnimation(eyeBlink, withSequence(
          withTiming(0.7, { duration: 300 }),
          withTiming(1, { duration: 400 })
        ));
        setTimeout(changeGaze, 4000 + Math.random() * 6000);
      };
      changeGaze();
    }
    
    /**
     * Excited mood animations - energetic and vibrating
     */
    else if (mood === 'excited') {
      // Fast vibration effect
      startAnimation(bodyBounce, withRepeat(
        withTiming(-5, { duration: 100 }),
        -1,
        true
      ));
      
      // Wider eyes
      startAnimation(eyeBlink, withTiming(1.2, { duration: 200 }));
      
      // Open mouth smile
      startAnimation(mouthSmile, withTiming(1.5, { duration: 300 }));
      
      // Fast arm waving
      startAnimation(armWave, withRepeat(
        withTiming(30, { duration: 3700 }),
        -1,
        true
      ));
    }
    
    /**
     * Shy mood animations - withdrawn and protective
     */
    else if (mood === 'shy') {
      // Shrinking motion
      startAnimation(bodyBounce, withTiming(10, { duration: 800 }));
      
      // Subtle downward head tilt
      startAnimation(headTilt, withTiming(8, { duration: 1000 })); // Reduced from 20 to 8 degrees
      
      // Protective arm position
      startAnimation(armWave, withTiming(25, { duration: 600 }));
      
      // Blush effect (would need additional style implementation)
    }
    
    // Clean up animations when component unmounts
    return () => {
      // Mark component as unmounted
      isComponentMounted.current = false;
      
      // Cancel all active animations to prevent memory leaks
      try {
        cancelAnimation(bodyBounce);
        cancelAnimation(armWave);
        cancelAnimation(headTilt);
        cancelAnimation(floatY);
        cancelAnimation(eyeBlink);
        cancelAnimation(legSwing);
        cancelAnimation(bodyRotation);
        cancelAnimation(mouthSmile);
        cancelAnimation(characterRotation);
        cancelAnimation(jumpHeight);
      } catch (error) {
        console.warn('Error cleaning up animations:', error);
      }
    };
  }, [mood]); // Re-run animations when mood changes

  // ===== ANIMATED STYLES =====
  /**
   * Define all animated styles for the character's body parts
   * Each style connects the shared animation values to visual transformations
   */
  
  /**
   * Body animation style
   * Controls the main body bounce and rotation effects
   */
  const bodyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bodyBounce.value },      // Vertical bouncing movement
      { rotate: `${bodyRotation.value}deg` } // Overall body rotation
    ]
  }));

  /**
   * Head animation style
   * Controls head movement and dynamic shadow effects
   */
  const headAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Head follows body movement but with dampened effect (60%)
      { translateY: bodyBounce.value * 0.1 },
      // Head tilt based on mood and interactions
      { rotate: `${headTilt.value}deg` }
    ],
    // Dynamic shadow that responds to head movement
    shadowOffset: { 
      width: headTilt.value * 0.1, 
      height: 2 + Math.abs(bodyBounce.value) * 0.2 
    },
    shadowOpacity: 0.15 + Math.abs(bodyBounce.value) * 0.03,
    shadowRadius: 4 + Math.abs(bodyBounce.value) * 0.3
  }));
  
  /**
   * Character rotation and jump style
   * Controls the overall character position for jumps and rotations
   */
  const characterRotationStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: jumpHeight.value },         // Vertical jump movement
      { rotate: `${characterRotation.value}deg` } // Full character rotation
    ]
  }));

  /**
   * Right arm animation style
   * Controls waving and movement of the right arm
   */
  const rightArmAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Arm follows body bounce at 50% intensity
      { translateY: bodyBounce.value * 0.5 },
      // Negative rotation for mirroring
      { rotate: `${-armWave.value}deg` }
    ]
  }));

  const rightForearmAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Negative rotation for mirroring with reduced intensity
      { rotate: `${-armWave.value * 0.7}deg` }
    ]
  }));

  const rightHandAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Negative rotation for mirroring with further reduced intensity
      { rotate: `${-armWave.value * 0.5}deg` }
    ]
  }));

  /**
   * Left arm animation style
   * Controls waving and movement of the left arm
   */
  const leftArmAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Arm follows body bounce at 50% intensity
      { translateY: bodyBounce.value * 0.5 },
      // Positive rotation for left arm wave
      { rotate: `${armWave.value}deg` }
    ]
  }));

  const leftForearmAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Reduced rotation for natural joint movement
      { rotate: `${armWave.value * 0.7}deg` }
    ]
  }));

  const leftHandAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Even more reduced rotation for natural wrist movement
      { rotate: `${armWave.value * 0.5}deg` }
    ]
  }));

  /**
   * Left leg animation style
   * Keeps the leg completely stationary
   */
  const leftLegAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // No vertical movement
      { translateY: 0 },
      // No rotation
      { rotate: '0deg' }
    ]
  }));
  
  /**
   * Right leg animation style
   * Keeps the leg completely stationary
   */
  const rightLegAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // No vertical movement
      { translateY: 0 },
      // No rotation
      { rotate: '0deg' }
    ]
  }));

  /**
   * Eye animation style
   * Controls blinking effect
   */
  const eyeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Scale Y axis for blinking (1=open, 0=closed)
      { scaleY: eyeBlink.value }
    ]
  }));

  /**
   * Mouth animation style
   * Controls smile shape and intensity
   */
  const mouthAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      // Horizontal scaling for smile width
      { scaleX: mouthSmile.value * 1.2 }, // Increased horizontal scaling for wider smile
      // Vertical scaling for smile height (90% of width for more pronounced curve)
      { scaleY: mouthSmile.value * 0.9 } // Increased vertical scaling for more pronounced smile
    ],
    // Dynamic border radius for smile curvature
    borderRadius: 12 * mouthSmile.value, // Increased border radius for smoother curve
    // Add slight upward curve for a happier expression
    borderBottomLeftRadius: 15 * mouthSmile.value,
    borderBottomRightRadius: 15 * mouthSmile.value
  }));

  /**
   * Container style with direction control
   * Applies horizontal flip when character should face left
   */
  const containerStyle = {
    width: size,
    height: size * .75, // Taller container to accommodate full character
    marginTop: -size * 0.4, // Move character up on the page by 40% of its size
    transform: facingLeft ? [{ scaleX: -1 }] : [], // Flip horizontally when facing left
    ...style // Apply any custom styles passed as props
  };

  /**
   * Component styles
   * Organized by body part categories for better maintainability
   */
  const styles = StyleSheet.create({
    // ===== LAYOUT =====
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: size,
      height: size * 1.5
    },
    // ===== HEAD & FACE =====
    face: {
      position: 'absolute',
      width: size * 0.42, // More narrow face width (reduced from 0.5)
      height: size * 0.54, // Slightly taller to maintain proportions
      borderRadius: size * 0.21, // Adjusted border radius for oval shape
      backgroundColor: '#FFE4C4', // Peach-like skin tone
      top: size * 0.15,
      alignSelf: 'center',
      zIndex: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3
    },
    // ===== EARS =====
    leftEar: {
      position: 'absolute',
      width: size * 0.08,
      height: size * 0.16,
      borderRadius: size * 0.08,
      backgroundColor: '#FFDBAC', // Skin tone
      left: -size * 0.03,
      top: size * 0.2,
      zIndex: 3,
      borderTopLeftRadius: size * 0.04,
      borderTopRightRadius: size * 0.08,
      borderBottomLeftRadius: size * 0.04,
      borderBottomRightRadius: size * 0.08,
      transform: [{ rotate: '-10deg' }]
    },
    rightEar: {
      position: 'absolute',
      width: size * 0.08,
      height: size * 0.16,
      borderRadius: size * 0.08,
      backgroundColor: '#FFDBAC', // Skin tone
      right: -size * 0.03,
      top: size * 0.2,
      zIndex: 3,
      borderTopLeftRadius: size * 0.08,
      borderTopRightRadius: size * 0.04,
      borderBottomLeftRadius: size * 0.08,
      borderBottomRightRadius: size * 0.04,
      transform: [{ rotate: '10deg' }]
    },
    earInner: {
      position: 'absolute',
      width: size * 0.04,
      height: size * 0.08,
      borderRadius: size * 0.04,
      backgroundColor: '#FFD0A0', // Slightly darker inner ear
      top: size * 0.04,
      left: size * 0.02,
      zIndex: 4
    },
    earlobe: {
      position: 'absolute',
      width: size * 0.05,
      height: size * 0.05,
      borderRadius: size * 0.025,
      backgroundColor: '#FFDBAC', // Skin tone
      bottom: 0,
      alignSelf: 'center',
      zIndex: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1
    },
    
    // ===== HAIR =====
    hair: {
      position: 'absolute',
      width: size * 0.56,
      height: size * 0.18,
      borderTopLeftRadius: size * 0.25,
      borderTopRightRadius: size * 0.25,
      backgroundColor: '#F9F3D3', // Very light blonde hair color (matching photo)
      top: -size * 0.05,
      alignSelf: 'center',
      zIndex: 4
    },
    hairFringe: {
      position: 'absolute',
      width: size * 0.23,
      height: size * 0.08,
      borderTopLeftRadius: size * 0.08,
      borderTopRightRadius: size * 0.08,
      backgroundColor: '#F9F3D3', // Very light blonde hair color (matching photo)
      top: size * 0.02,
      alignSelf: 'center',
      zIndex: 6
    },
    hairDetail1: {
      position: 'absolute',
      width: size * 0.07,
      height: size * 0.12,
      borderRadius: size * 0.05,
      backgroundColor: '#F9F3D3', // Very light blonde hair color (matching photo)
      top: -size * 0.02,
      right: size * 0.08,
      transform: [{ rotate: '10deg' }],
      zIndex: 6
    },
    hairDetail2: {
      position: 'absolute',
      width: size * 0.07,
      height: size * 0.12,
      borderRadius: size * 0.05,
      backgroundColor: '#F9F3D3', // Very light blonde hair color (matching photo)
      top: -size * 0.02,
      left: size * 0.08,
      transform: [{ rotate: '-10deg' }],
      zIndex: 6
    },
    hairSide1: {
      position: 'absolute',
      width: size * 0.05,
      height: size * 0.15,
      borderRadius: size * 0.03,
      backgroundColor: '#F5E3A0', // Very light blonde hair color (matching photo)
      top: size * 0.12,
      right: -size * 0.01,
      transform: [{ rotate: '3deg' }],
      zIndex: 4
    },
    hairSide2: {
      position: 'absolute',
      width: size * 0.07,
      height: size * 0.15,
      borderRadius: size * 0.03,
      backgroundColor: '#F5E3A0', // Very light blonde hair color (matching photo)
      top: size * 0.12,
      left: -size * 0.01,
      transform: [{ rotate: '-0deg' }],
      zIndex: 4
    },
    // ===== FACIAL FEATURES =====
    eyes: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: size * 0.24, // Narrower eye spacing for narrower face
      position: 'absolute',
      top: size * 0.22,
      alignSelf: 'center'
    },
    eye: {
      width: size * 0.075, // Slightly smaller eyes for narrower face
      height: size * 0.08, // Maintain height for expressive eyes
      borderRadius: size * 0.04, // Perfectly round
      backgroundColor: '#FFFFFF', // White eyeball
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 6
    },
    pupil: {
      width: size * 0.045,
      height: size * 0.045,
      borderRadius: size * 0.0225,
      backgroundColor: '#1E90FF', // Blue pupil
      zIndex: 7
    },
    leftEye: {
      marginRight: size * 0.02
    },
    rightEye: {
      marginLeft: size * 0.02
    },
    leftEyebrow: {
      position: 'absolute',
      width: size * 0.1, // Narrower eyebrow for narrower face
      height: size * 0.025,
      borderRadius: size * 0.01,
      backgroundColor: '#E5D5C3', // Slightly darker than hair for contrast
      left: size * 0.09, // Adjusted position for narrower face
      top: size * 0.15,
      transform: [{ rotate: '-8deg' }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1
    },
    rightEyebrow: {
      position: 'absolute',
      width: size * 0.1, // Narrower eyebrow for narrower face
      height: size * 0.025,
      borderRadius: size * 0.01,
      backgroundColor: '#E5D5C3', // Slightly darker than hair for contrast
      right: size * 0.09, // Adjusted position for narrower face
      top: size * 0.15,
      transform: [{ rotate: '8deg' }],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1
    },
    freckle: {
      position: 'absolute',
      width: size * 0.02,
      height: size * 0.01,
      borderRadius: size * 0.01,
      backgroundColor: '#E5B887', // Slightly darker than skin tone
      opacity: 0.6
    },
    nose: {
      position: 'absolute',
      width: size * 0.06, // Narrower nose for narrower face
      height: size * 0.06,
      borderRadius: size * 0.03,
      backgroundColor: '#FFDBAC', // Same as skin tone
      top: size * 0.25,
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      zIndex: 6
    },
    nostril: {
      position: 'absolute',
      width: size * 0.015, // Smaller nostrils for narrower nose
      height: size * 0.01,
      borderRadius: size * 0.01,
      backgroundColor: '#E5B887', // Slightly darker than skin tone
      bottom: size * 0.01,
      opacity: 0.5
    },
    // ===== TORSO =====
    body: {
      position: 'absolute',
      width: size * 0.35, // Wider t-shirt
      height: size * 0.5, // Taller t-shirt
      borderRadius: size * 0.12, // More rounded for natural body shape
      borderBottomLeftRadius: size * 0.08, // Slightly less rounded at bottom
      borderBottomRightRadius: size * 0.08, // Slightly less rounded at bottom
      backgroundColor: '#FF4500', // Bright orange t-shirt color matching photo
      top: size * 0.65,
      alignSelf: 'center',
      zIndex: 3
    },
    tshirtGraphic: {
      position: 'absolute',
      width: size * 0.45,
      height: size * 0.3,
      backgroundColor: 'transparent',
      top: size * 0.7,
      alignSelf: 'center',
      zIndex: 4
    },
    tshirtText: {
      position: 'absolute',
      width: size * 0.4,
      height: size * 0.2,
      backgroundColor: 'transparent',
      top: size * 0.75,
      alignSelf: 'center',
      zIndex: 5
    },
    // ===== ARMS & SHOULDERS =====
    // Shoulders (connection to body)
    leftShoulder: {
      position: 'absolute',
      width: size * 0.15,
      height: size * 0.1,
      borderRadius: size * 0.08, // More rounded for natural shoulder shape
      backgroundColor: '#FF4500', // Match t-shirt color
      top: size * 0.67,
      left: size * 0.12, // Positioned to connect with body
      transform: [{ rotate: '-10deg' }],
      zIndex: 3
    },
    rightShoulder: {
      position: 'absolute',
      width: size * 0.15,
      height: size * 0.1,
      borderRadius: size * 0.08, // More rounded for natural shoulder shape
      backgroundColor: '#FF4500', // Match t-shirt color
      top: size * 0.67,
      right: size * 0.12, // Positioned to connect with body
      transform: [{ rotate: '10deg' }],
      zIndex: 3
    },
    // T-shirt sleeves - positioned at the very top of the shirt
    leftSleeve: {
      position: 'absolute',
      width: size * 0.05,
      height: size * 0.12,
      backgroundColor: '#FF5733', // Orange shirt matching photo
      borderRadius: size * 0.05,
      left: size * 0.05, // Positioned at the edge of the shirt
      top: size * 0.65, // At the very top of the shirt
      zIndex: 2
    },
    rightSleeve: {
      position: 'absolute',
      width: size * 0.12,
      height: size * 0.12,
      backgroundColor: '#FF5733', // Orange shirt matching photo
      borderRadius: size * 0.05,
      right: size * 0.04, // Positioned at the edge of the shirt
      top: size * 0.65, // At the very top of the shirt
      zIndex: 2
    },
    // Complete left arm as a single unit - pivot point at top of arm
    leftCompleteArm: {
      position: 'absolute',
      width: size * 0.09,
      height: size * 0.45, // Tall enough to go from sleeve to hand
      backgroundColor: '#FFD0B0', // Skin color
      borderTopLeftRadius: size * 0.04,
      borderTopRightRadius: size * 0.04,
      borderBottomLeftRadius: size * 0.04,
      borderBottomRightRadius: size * 0.04,
      left: size * 0.18, // Positioned to connect with sleeve
      top: size * 0.69, // Starting at very top of shirt
      transformOrigin: 'top', // Pivot point at top of arm for natural rotation
      zIndex: 3
    },
    // Complete right arm as a single unit - pivot point at top of arm
    rightCompleteArm: {
      position: 'absolute',
      width: size * 0.09,
      height: size * 0.45, // Tall enough to go from sleeve to hand
      backgroundColor: '#FFD0B0', // Skin color
      borderTopLeftRadius: size * 0.04,
      borderTopRightRadius: size * 0.04,
      borderBottomLeftRadius: size * 0.04,
      borderBottomRightRadius: size * 0.04,
      right: size * 0.18, // Positioned to connect with sleeve
      top: size * 0.69, // Starting at very top of shirt
      transformOrigin: 'top', // Pivot point at top of arm for natural rotation
      zIndex: 3
    },
    // Original arms (keeping for backward compatibility)
    leftArm: {
      position: 'absolute',
      width: size * 0.17,
      height: size * 0.10, // Shorter arms for child proportions
      borderRadius: size * 0.04,
      backgroundColor: '#FFE4C4', // Skin color for arms
      top: size * 0.28,
      left: size * 0.65,
      zIndex: 2,
      transformOrigin: 'top'
    },
    rightArm: {
      position: 'absolute',
      width: size * 0.17,
      height: size * 0.10, // Shorter arms for child proportions
      borderRadius: size * 0.04,
      backgroundColor: '#FFE4C4', // Skin color for arms
      top: size * 0.28,
      right: size * 0.65,
      zIndex: 2,
      transformOrigin: 'top'
    },
    // Upper arms (from shoulder to elbow) - hanging down at sides like in photo
    leftUpperArm: {
      position: 'absolute',
      width: size * 0.08, // Thinner width
      height: size * 0.15, // Shorter height
      backgroundColor: '#FFD0B0', // Skin color
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with sleeve arm
      borderTopRightRadius: 0, // Flat top to connect with sleeve arm
      borderBottomLeftRadius: 0, // Flat bottom to connect with forearm
      borderBottomRightRadius: 0, // Flat bottom to connect with forearm
      left: size * 0.17, // Positioned at side of body
      top: size * 0.79, // Positioned to connect perfectly with sleeve arm
      transform: [{ rotate: '0deg' }], // Straight down
      transformOrigin: 'top',
      zIndex: 3 // Behind shirt but in front of body
    },
    rightUpperArm: {
      position: 'absolute',
      width: size * 0.08, // Thinner width
      height: size * 0.15, // Shorter height
      backgroundColor: '#FFD0B0', // Skin color
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with sleeve arm
      borderTopRightRadius: 0, // Flat top to connect with sleeve arm
      borderBottomLeftRadius: 0, // Flat bottom to connect with forearm
      borderBottomRightRadius: 0, // Flat bottom to connect with forearm
      right: size * 0.17, // Positioned at side of body
      top: size * 0.79, // Positioned to connect perfectly with sleeve arm
      transform: [{ rotate: '0deg' }], // Straight down
      transformOrigin: 'top',
      zIndex: 3 // Behind shirt but in front of body
    },
    // Forearms (from elbow to wrist) - hanging down at sides like in photo
    leftForearm: {
      position: 'absolute',
      width: size * 0.08, // Same width as upper arm for seamless connection
      height: size * 0.15, // Normal height
      backgroundColor: '#FFD0B0', // Skin color
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with upper arm
      borderTopRightRadius: 0, // Flat top to connect with upper arm
      borderBottomLeftRadius: 0, // Flat bottom to connect with hand
      borderBottomRightRadius: 0, // Flat bottom to connect with hand
      left: size * 0.17, // Positioned at side of body
      top: size * 0.94, // Connected perfectly to upper arm
      transform: [{ rotate: '0deg' }], // Straight down
      transformOrigin: 'top',
      zIndex: 3 // Same as upper arms
    },
    rightForearm: {
      position: 'absolute',
      width: size * 0.08, // Same width as upper arm for seamless connection
      height: size * 0.15, // Normal height
      backgroundColor: '#FFD0B0', // Skin color
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with upper arm
      borderTopRightRadius: 0, // Flat top to connect with upper arm
      borderBottomLeftRadius: 0, // Flat bottom to connect with hand
      borderBottomRightRadius: 0, // Flat bottom to connect with hand
      right: size * 0.17, // Positioned at side of body
      top: size * 0.94, // Connected perfectly to upper arm
      transform: [{ rotate: '0deg' }], // Straight down
      transformOrigin: 'top',
      zIndex: 3 // Same as upper arms
    },
    // Hands - positioned at the end of forearms at sides like in photo
    leftHand: {
      position: 'absolute',
      width: size * 0.08, // Same width as forearm for seamless connection
      height: size * 0.07,
      backgroundColor: '#FFD0B0', // Skin color
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with forearm
      borderTopRightRadius: 0, // Flat top to connect with forearm
      left: size * 0.17, // Positioned at the end of the forearm
      top: size * 1.09, // Connected perfectly to forearm
      zIndex: 3 // Same as arms
    },
    rightHand: {
      position: 'absolute',
      width: size * 0.08, // Same width as forearm for seamless connection
      height: size * 0.07,
      backgroundColor: '#FFD0B0', // Skin color
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with forearm
      borderTopRightRadius: 0, // Flat top to connect with forearm
      right: size * 0.17, // Positioned at the end of the forearm
      top: size * 1.09, // Connected perfectly to forearm
      zIndex: 3 // Same as arms
    },
    // ===== LOWER BODY =====
    shorts: {
      position: 'absolute',
      width: size * 0.43, // Width to match body
      height: size * 0.37, // Even longer shorts to match photo
      borderRadius: size * 0.08,
      borderTopLeftRadius: size * 0.05, // Less rounded at top to connect with body
      borderTopRightRadius: size * 0.05, // Less rounded at top to connect with body
      borderBottomLeftRadius: size * 0.08, // More rounded at bottom like in photo
      borderBottomRightRadius: size * 0.08, // More rounded at bottom like in photo
      backgroundColor: '#000000', // Pure black color for shorts matching photo
      top: size * 1.0, // Adjusted to connect with body
      alignSelf: 'center',
      zIndex: 2
    },
    // White stripe at bottom of shorts like in photo
    shortsStripe: {
      position: 'absolute',
      width: size * 0.43, // Same width as shorts
      height: size * 0.04, // Thin white stripe
      backgroundColor: '#FFFFFF', // White stripe
      borderBottomLeftRadius: size * 0.08, // Match shorts bottom radius
      borderBottomRightRadius: size * 0.08, // Match shorts bottom radius
      bottom: 0, // At the bottom of shorts
      alignSelf: 'center',
      top: size * 1.33, // Positioned at bottom of shorts
      zIndex: 3
    },
    // Small white detail on right side of shorts
    shortsDetail: {
      position: 'absolute',
      width: size * 0.05,
      height: size * 0.05,
      backgroundColor: '#FFFFFF', // White detail on shorts
      borderRadius: size * 0.025,
      right: size * 0.12,
      top: size * 1.05,
      zIndex: 3
    },
    // Legs with skin color - longer legs that connect with shorts and shoes
    leftLeg: {
      position: 'absolute',
      width: size * 0.09,
      height: size * 0.35, // Original height
      borderRadius: size * 0.045,
      borderTopLeftRadius: 0, // Flat top to connect with shorts
      borderTopRightRadius: 0, // Flat top to connect with shorts
      borderBottomLeftRadius: 0, // Flat bottom to connect with shoes
      borderBottomRightRadius: 0, // Flat bottom to connect with shoes
      backgroundColor: '#FFE4C4', // Skin color for legs
      top: size * 1.33, // Position to connect perfectly with longer shorts and white stripe
      left: size * 0.13,
      zIndex: 1,
      transformOrigin: 'top'
    },
    rightLeg: {
      position: 'absolute',
      width: size * 0.09,
      height: size * 0.35, // Original height
      borderRadius: size * 0.045,
      borderTopLeftRadius: 0, // Flat top to connect with shorts
      borderTopRightRadius: 0, // Flat top to connect with shorts
      borderBottomLeftRadius: 0, // Flat bottom to connect with shoes
      borderBottomRightRadius: 0, // Flat bottom to connect with shoes
      backgroundColor: '#FFE4C4', // Skin color for legs
      top: size * 1.33, // Position to connect perfectly with longer shorts and white stripe
      right: size * 0.13,
      zIndex: 1,
      transformOrigin: 'top'
    },
    // ===== FOOTWEAR =====
    shoes: {
      position: 'absolute',
      width: size * 0.14,
      height: size * 0.07,
      borderRadius: size * 0.04,
      borderTopLeftRadius: 0, // Flat top to connect with legs
      borderTopRightRadius: 0, // Flat top to connect with legs
      backgroundColor: '#FF4500', // Bright orange athletic shoes matching photo
      top: size * 1.68, // Positioned exactly at bottom of legs for seamless connection
      alignSelf: 'center',
      zIndex: 1
    },
    leftShoe: {
      left: size * 0.13 // Perfectly aligned with left leg
    },
    rightShoe: {
      right: size * 0.13 // Perfectly aligned with right leg
    },
    shoeSole: {
      position: 'absolute',
      width: size * 0.14,
      height: size * 0.02,
      backgroundColor: '#FFFFFF', // White sole
      borderRadius: size * 0.01,
      top: size * 1.74, // At the bottom of the repositioned shoe
      zIndex: 2
    },
    shoeStripe: {
      position: 'absolute',
      width: size * 0.08,
      height: size * 0.02,
      backgroundColor: '#FFFFFF', // White stripe
      borderRadius: size * 0.01,
      top: size * 1.71, // On the repositioned shoe
      zIndex: 2
    },
    shoeDetail: {
      position: 'absolute',
      width: size * 0.03,
      height: size * 0.03,
      backgroundColor: '#FFFFFF', // White detail
      borderRadius: size * 0.015,
      top: size * 1.71,
      zIndex: 2
    },
    // Add socks
    socks: {
      position: 'absolute',
      width: size * 0.1,
      height: size * 0.03,
      backgroundColor: '#FFFFFF',
      borderRadius: size * 0.02,
      top: size * 1.65, // Positioned just above shoes at bottom of longer legs
      zIndex: 1
    }
  });

  /**
   * Render the character with all its animated parts
   */
  return (
    <TouchableWithoutFeedback onPress={performJump} accessible={true} accessibilityRole="button" accessibilityLabel="Interactive character">
      <View style={[styles.container, containerStyle]}>
        {/* Main character container with rotation and jump animations */}
        <Animated.View style={characterRotationStyle}>
          {/* Body container with bounce and rotation animations */}
          <Animated.View style={bodyAnimatedStyle}>
            {/* ===== TORSO SECTION ===== */}
            <View style={styles.body} />
            <View style={styles.tshirtGraphic} />
            <View style={styles.tshirtText}>
              <Text style={{
                color: '#000',
                fontSize: size * 0.09, // Slightly larger for the shorter text
                fontWeight: 'bold',
                textAlign: 'center',
                transform: [
                  { scaleX: facingLeft ? -1 : 1 }
                ],
                letterSpacing: size * 0.005
              }}>PAX</Text>
            </View>
            <View style={styles.tshirtGraphic}>
              {/* Simple fire truck and vehicle graphics like in the photo */}
              <View style={{
                position: 'absolute',
                width: size * 0.25,
                height: size * 0.12,
                backgroundColor: '#D22B2B', // Darker red for fire truck
                borderRadius: size * 0.03,
                alignSelf: 'center',
                top: size * 0.05,
                zIndex: 5
              }} />
              {/* Small car on the t-shirt */}
              {/* Car body - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.14, // Reduced from 0.18 to 0.14
                height: size * 0.055, // Reduced from 0.07 to 0.055
                backgroundColor: '#3A86FF', // Blue car body
                borderRadius: size * 0.02,
                alignSelf: 'center',
                top: size * 0.20, // Moved down from 0.13 to 0.20
                zIndex: 6
              }} />
              {/* Car roof - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.09, // Reduced from 0.09 to 0.07
                height: size * 0.04, // Reduced from 0.05 to 0.04
                backgroundColor: '#3A86FF', // Blue car roof
                borderRadius: size * 0.015,
                alignSelf: 'center',
                top: size * 0.17, // Moved down from 0.09 to 0.17
                zIndex: 6
              }} />
              {/* Car windows - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.055, // Reduced from 0.07 to 0.055
                height: size * 0.03, // Reduced from 0.04 to 0.03
                backgroundColor: '#DEEAFF', // Light blue windows
                borderRadius: size * 0.01,
                alignSelf: 'center',
                top: size * 0.175, // Moved down from 0.10 to 0.175
                zIndex: 7
              }} />
              {/* Car wheels - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.05, // Reduced from 0.04 to 0.03
                height: size * 0.03, // Reduced from 0.04 to 0.03
                backgroundColor: '#222', // Black wheel
                borderRadius: size * 0.015,
                left: size * 0.12, // Moved closer to car body (from 0.09 to 0.105)
                top: size * 0.225, // Maintained vertical position
                zIndex: 7
              }} />
              <View style={{
                position: 'absolute',
                width: size * 0.03, // Reduced from 0.04 to 0.03
                height: size * 0.03, // Reduced from 0.04 to 0.03
                backgroundColor: '#222', // Black wheel
                borderRadius: size * 0.015,
                right: size * 0.12, // Moved closer to car body (from 0.09 to 0.105)
                top: size * 0.225, // Maintained vertical position
                zIndex: 7
              }} />
              {/* Wheel hubcaps - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.015, // Reduced from 0.02 to 0.015
                height: size * 0.015, // Reduced from 0.02 to 0.015
                backgroundColor: '#FFFFFF', // White hubcap
                borderRadius: size * 0.0075,
                left: size * 0.125, // Adjusted to match new wheel position
                top: size * 0.233, // Maintained vertical position
                zIndex: 8
              }} />
              <View style={{
                position: 'absolute',
                width: size * 0.015, // Reduced from 0.02 to 0.015
                height: size * 0.015, // Reduced from 0.02 to 0.015
                backgroundColor: '#FFFFFF', // White hubcap
                borderRadius: size * 0.0075,
                right: size * 0.125, // Adjusted to match new wheel position
                top: size * 0.233, // Maintained vertical position
                zIndex: 8
              }} />
              {/* Car headlights - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.015, // Adjusted size
                height: size * 0.015, // Adjusted size
                backgroundColor: '#FFFF00', // Yellow headlight
                borderRadius: size * 0.0075,
                left: size * 0.5, // Adjusted position
                top: size * 0.21, // Moved down to match new car position
                zIndex: 7
              }} />
              <View style={{
                position: 'absolute',
                width: size * 0.015, // Adjusted size
                height: size * 0.015, // Adjusted size
                backgroundColor: '#FFFF00', // Yellow headlight
                borderRadius: size * 0.0075,
                right: size * 0.07, // Adjusted position
                top: size * 0.21, // Moved down to match new car position
                zIndex: 7
              }} />
              {/* Car taillights - smaller and lower */}
              <View style={{
                position: 'absolute',
                width: size * 0.008, // Reduced size
                height: size * 0.008, // Reduced size
                backgroundColor: '#FF0000', // Red taillight
                borderRadius: size * 0.004,
                left: size * 0.065, // Adjusted position
                top: size * 0.23, // Moved down to match new car position
                zIndex: 7
              }} />
              <View style={{
                position: 'absolute',
                width: size * 0.008, // Reduced size
                height: size * 0.008, // Reduced size
                backgroundColor: '#FF0000', // Red taillight
                borderRadius: size * 0.004,
                right: size * 0.065, // Adjusted position
                top: size * 0.23, // Moved down to match new car position
                zIndex: 7
              }} />
            </View>
            
            {/* ===== ARMS SECTION ===== */}
            {/* Shoulders */}
            <View style={styles.leftShoulder} />
            <View style={styles.rightShoulder} />
            
            {/* Shirt sleeves */}
            <View style={styles.leftSleeve} />
            <View style={styles.rightSleeve} />
            
            {/* Complete arms as single units */}
            <Animated.View style={[styles.leftCompleteArm, leftArmAnimatedStyle]} />
            <Animated.View style={[styles.rightCompleteArm, rightArmAnimatedStyle]} />
            
            {/* ===== LOWER BODY SECTION ===== */}
            <View style={styles.shorts} />
            <View style={styles.shortsStripe} />
            <View style={styles.shortsDetail} />
            <Animated.View style={[styles.leftLeg, leftLegAnimatedStyle]} />
            <Animated.View style={[styles.rightLeg, rightLegAnimatedStyle]} />
            
            {/* ===== FOOTWEAR SECTION ===== */}
            <View style={[styles.socks, { left: size * 0.12 }]} />
            <View style={[styles.socks, { right: size * 0.12 }]} />
            <View style={[styles.shoes, styles.leftShoe]} />
            <View style={[styles.shoes, styles.rightShoe]} />
            <View style={[styles.shoeSole, { left: size * 0.13 }]} />
            <View style={[styles.shoeSole, { right: size * 0.13 }]} />
            <View style={[styles.shoeStripe, { left: size * 0.13 }]} />
            <View style={[styles.shoeStripe, { right: size * 0.13 }]} />
            <View style={[styles.shoeDetail, { left: size * 0.17 }]} />
            <View style={[styles.shoeDetail, { right: size * 0.17 }]} />
            
            {/* ===== HEAD SECTION ===== */}
            <Animated.View style={[styles.face, headAnimatedStyle]}>
              
              {/* Hair elements */}
              <View style={styles.hair} />
              <View style={styles.hairFringe} />
              <View style={styles.hairDetail1} />
              <View style={styles.hairDetail2} />
              <View style={styles.hairSide1} />
              <View style={styles.hairSide2} />
              
              {/* Facial features */}
              <View style={styles.leftEyebrow} />
              <View style={styles.rightEyebrow} />
              
              
              {/* Cute nose */}
              <View style={styles.nose}>
                <View style={[styles.nostril, { left: size * 0.015 }]} />
                <View style={[styles.nostril, { right: size * 0.015 }]} />
              </View>
              
              {/* Animated eyes with blinking */}
              <View style={styles.eyes}>
                <Animated.View style={[styles.eye, styles.leftEye, eyeAnimatedStyle]}>
                  <View style={styles.pupil} />
                </Animated.View>
                <Animated.View style={[styles.eye, styles.rightEye, eyeAnimatedStyle]}>
                  <View style={styles.pupil} />
                </Animated.View>
              </View>
              
              {/* Animated mouth with subtle expression matching photo */}
              <Animated.View style={[{ 
                position: 'absolute',
                width: size * 0.08, // Wider mouth for bigger smile
                height: size * 0.03, // Taller mouth for bigger smile
                backgroundColor: '#E5A190', // Subtle lip color
                borderRadius: size * 0.015, // Increased border radius for smoother curve
                bottom: size * 0.12,
                alignSelf: 'center',
              }, mouthAnimatedStyle]} />
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}