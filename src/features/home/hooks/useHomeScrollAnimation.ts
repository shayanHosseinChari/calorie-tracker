import { useMemo, useRef, useState } from 'react';
import { Animated } from 'react-native';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { TOP_BAR_HEIGHT } from '../constants';
import type { SummaryLayout } from './useSummaryLayout';

interface Options {
  summaryLayout: SummaryLayout;
}

export function useHomeScrollAnimation({ summaryLayout }: Options) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerVisibleRef = useRef(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const {
    collapseStart,
    collapseEnd,
    transitionMiddle,
    summaryOpacity,
    summaryScale,
    topBarOpacity,
    topBarTranslateY,
  } = useMemo(() => {
    const start = Math.max(0, summaryLayout.y - TOP_BAR_HEIGHT);
    const end = start + Math.max(100, summaryLayout.height * 0.65);
    const middle = start + (end - start) * 0.55;

    return {
      collapseStart: start,
      collapseEnd: end,
      transitionMiddle: middle,
      summaryOpacity: scrollY.interpolate({
        inputRange: [start, middle, end],
        outputRange: [1, 0.35, 0],
        extrapolate: 'clamp',
      }),
      summaryScale: scrollY.interpolate({
        inputRange: [start, end],
        outputRange: [1, 0.88],
        extrapolate: 'clamp',
      }),
      topBarOpacity: scrollY.interpolate({
        inputRange: [start, middle, end],
        outputRange: [0, 0.65, 1],
        extrapolate: 'clamp',
      }),
      topBarTranslateY: scrollY.interpolate({
        inputRange: [start, end],
        outputRange: [-18, 0],
        extrapolate: 'clamp',
      }),
    };
  }, [scrollY, summaryLayout]);

  const handleScroll = useMemo(
    () =>
      Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
          useNativeDriver: true,
          listener: (
            event: NativeSyntheticEvent<NativeScrollEvent>,
          ) => {
            const visible =
              event.nativeEvent.contentOffset.y >= transitionMiddle;
            if (headerVisibleRef.current !== visible) {
              headerVisibleRef.current = visible;
              setIsHeaderVisible(visible);
            }
          },
        },
      ),
    [scrollY, transitionMiddle],
  );

  return {
    scrollY,
    isHeaderVisible,
    handleScroll,
    summaryOpacity,
    summaryScale,
    topBarOpacity,
    topBarTranslateY,
  };
}