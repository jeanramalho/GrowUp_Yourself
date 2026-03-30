import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing,
  runOnJS,
  withSequence
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  isVisible: boolean;
  onAnimationComplete?: () => void;
}

export function SplashScreen({ isVisible, onAnimationComplete }: SplashScreenProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Initial logo fade-in
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    scale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.back(1.5)) });
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Start exit animation
      opacity.value = withTiming(0, { 
        duration: 800, 
        easing: Easing.inOut(Easing.ease) 
      }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
          runOnJS(setShouldRender)(false);
        }
      });
      
      // Slight scale up on exit for a "zooming into app" effect
      scale.value = withTiming(1.2, { 
        duration: 800, 
        easing: Easing.inOut(Easing.ease) 
      });
    }
  }, [isVisible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
  }));

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.Image
        source={require('../../../assets/icon.png')}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
});
