import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, StatusBar } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

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
    // Initial logo fade-in and scale-up
    logoOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    scale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.back(1.5)) });
  }, []);

  useEffect(() => {
    if (!isVisible) {
      // Start exit animation when isVisible becomes false
      opacity.value = withTiming(0, { 
        duration: 800, 
        easing: Easing.inOut(Easing.ease) 
      }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
          runOnJS(setShouldRender)(false);
        }
      });
      
      // Slight scale out on exit for a "zooming into app" effect
      scale.value = withTiming(1.15, { 
        duration: 800, 
        easing: Easing.inOut(Easing.ease) 
      });
    }
  }, [isVisible, onAnimationComplete]);

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
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" translucent />
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
