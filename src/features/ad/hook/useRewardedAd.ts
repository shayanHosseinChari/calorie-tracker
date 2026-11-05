import { useState, useCallback, useRef } from 'react';
import {
  requestRewardedAd,
  showRewardedAd,
  CompletionState,
} from '@react-native-tapsell-mediation/tapsell';

export const useRewardedAd = (zoneId: string, onRewarded?: () => void) => {
  const [adId, setAdId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const adIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const isShowingRef = useRef(false);

  const loadAd = useCallback(async () => {
    if (isLoadingRef.current || adIdRef.current || isShowingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const id = await requestRewardedAd(zoneId);
      adIdRef.current = id;
      setAdId(id);
    } catch (e) {
      console.error('Rewarded load failed:', e);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [zoneId]);

  const showAd = useCallback(() => {
    if (!adIdRef.current) return;
    if (isShowingRef.current) return;
    isShowingRef.current = true;

    showRewardedAd(adIdRef.current, {
      onAdImpression: () => console.log('impression'),
      onAdClicked: () => console.log('clicked'),
      onRewarded: () => {
        console.log('user rewarded');
        onRewarded?.();
      },
      onAdClosed: (state: CompletionState) => {
        console.log('closed:', CompletionState[state]);
        adIdRef.current = null;
        setAdId(null);
        isShowingRef.current = false;
        // ❌ loadAd() حذف شد تا کنترل به صفحه برگردد
      },
      onAdFailed: (err: string) => {
        console.error('show failed:', err);
        adIdRef.current = null;
        setAdId(null);
        isShowingRef.current = false;
        // ❌ loadAd() حذف شد
      },
    });
  }, [onRewarded]);

  return { loadAd, showAd, loading, isReady: !!adId };
};