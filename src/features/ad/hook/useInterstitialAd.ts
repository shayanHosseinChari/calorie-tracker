import { useState, useCallback, useRef } from 'react';
import {
  requestInterstitialAd,
  showInterstitialAd,
  CompletionState,
} from '@react-native-tapsell-mediation/tapsell';

export const useInterstitialAd = (
  zoneId: string,
  onClosed?: (state: CompletionState) => void
) => {
  const [adId, setAdId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // adId را در ref نگه می‌داریم تا از رندرهای اضافی جلوگیری شود
  const adIdRef = useRef<string | null>(null);

  // قفل ضد درخواست تکراری
  const isLoadingRef = useRef(false);

  // قفل ضد نمایش تکراری
  const isShowingRef = useRef(false);

  // ① درخواست تبلیغ
  const loadAd = useCallback(async () => {
    // اگر در حال درخواست است، یا تبلیغ آماده داریم، یا در حال نمایش است، درخواست نده
    if (isLoadingRef.current || adIdRef.current || isShowingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const id = await requestInterstitialAd(zoneId);
      adIdRef.current = id;
      setAdId(id);
    } catch (e) {
      console.error('Interstitial load failed:', e);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [zoneId]);

  // ② نمایش تبلیغ
  const showAd = useCallback(() => {
    if (!adIdRef.current) return;
    if (isShowingRef.current) return;

    isShowingRef.current = true;

    showInterstitialAd(adIdRef.current, {
      onAdImpression: () => console.log('Interstitial impression'),
      onAdClicked: () => console.log('Interstitial clicked'),
      onAdClosed: (state: CompletionState) => {
        console.log('Interstitial closed:', CompletionState[state]);
        adIdRef.current = null;
        setAdId(null);
        isShowingRef.current = false;
        
        onClosed?.(state);
      },
      onAdFailed: (err: string) => {
        console.error('Interstitial show failed:', err);
        adIdRef.current = null;
        setAdId(null);
        isShowingRef.current = false;
      },
    });
  }, [onClosed]);

  return { loadAd, showAd, loading, isReady: !!adId };
};