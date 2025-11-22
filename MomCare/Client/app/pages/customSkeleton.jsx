import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

const CustomSkeleton = ({ style }) => {
  const shimmerOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerOpacity]);

  return (
    <Animated.View style={[styles.skeleton, style, { opacity: shimmerOpacity }]} />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default CustomSkeleton;
