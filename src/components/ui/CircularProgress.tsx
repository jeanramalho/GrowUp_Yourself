import React, { useEffect } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
    size?: number;
    strokeWidth?: number;
    progress: number; // 0 to 100
    color: string;
    backgroundColor?: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    size = 60,
    strokeWidth = 4,
    progress,
    color,
    backgroundColor = '#E2E8F0',
    children,
    style,
}) => {
    // Safety checks for progress value
    const safeProgress = (progress === undefined || progress === null || isNaN(progress) || !isFinite(progress)) 
        ? 0 
        : Math.max(0, Math.min(100, progress));

    // Safety checks for layout dimensions
    const safeSize = (size === undefined || size === null || isNaN(size) || size <= 0) ? 60 : size;
    const safeStrokeWidth = (strokeWidth === undefined || strokeWidth === null || isNaN(strokeWidth) || strokeWidth < 0) ? 4 : strokeWidth;

    const radius = Math.max(0, (safeSize - safeStrokeWidth) / 2);
    const circumference = 2 * Math.PI * radius;
    const progressValue = useSharedValue(0);

    useEffect(() => {
        progressValue.value = withTiming(safeProgress, { duration: 1000 });
    }, [safeProgress]);

    const animatedProps = useAnimatedProps(() => {
        // Ensure progressValue.value is safe during animation
        const currentVal = (isNaN(progressValue.value) || !isFinite(progressValue.value)) ? 0 : progressValue.value;
        const strokeDashoffset = circumference - (circumference * currentVal) / 100;
        return {
            strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: safeSize, height: safeSize }, style]}>
            <Svg width={safeSize} height={safeSize} viewBox={`0 0 ${safeSize} ${safeSize}`}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${size / 2}, ${size / 2}`}
                />
            </Svg>
            {children && <View style={[styles.content]}>{children}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
