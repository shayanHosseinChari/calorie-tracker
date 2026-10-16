import { useCallback, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

export interface SummaryLayout {
  y: number;
  height: number;
}

export function useSummaryLayout(initial: SummaryLayout) {
  const [summaryLayout, setSummaryLayout] = useState(initial);

  const onSummaryLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      setSummaryLayout(previous =>
        previous.y === layout.y && previous.height === layout.height
          ? previous
          : { y: layout.y, height: layout.height },
      );
    },
    [],
  );

  return { summaryLayout, onSummaryLayout };
}