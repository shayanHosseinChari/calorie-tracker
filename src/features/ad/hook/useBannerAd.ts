import { useState, useCallback, useRef, useEffect } from 'react';
import {
  requestBannerAd,
  showBannerAd,
  destroyBannerAd,
  BannerSize,
  BannerPosition,
} from '@react-native-tapsell-mediation/tapsell';

interface UseBannerAdOptions {
  zoneId: string;
  bannerSize?: BannerSize;
  position?: BannerPosition;
  autoLoad?: boolean; // اگر true باشد، هنگام mount خودکار لود می‌شود
}

export const useBannerAd = ({
  zoneId,
  bannerSize = BannerSize.BANNER_320_50,
  position = BannerPosition.Bottom,
  autoLoad = true,
}: UseBannerAdOptions) => {
  const [adId, setAdId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const adIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const isShowingRef = useRef(false);

  // ① درخواست بنر
  const loadAd = useCallback(async () => {
    if (isLoadingRef.current || adIdRef.current || isShowingRef.current) {
      return;
    }

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const id = await requestBannerAd(zoneId, bannerSize);
      adIdRef.current = id;
      setAdId(id);
    } catch (e) {
      console.error('Banner load failed:', e);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [zoneId, bannerSize]);

  // ② نمایش بنر
  const showAd = useCallback(() => {
    if (!adIdRef.current) return;
    if (isShowingRef.current) return;

    isShowingRef.current = true;

    showBannerAd(adIdRef.current, position, {
      onAdImpression: () => {
        console.log('Banner impression');
        setIsVisible(true);
      },
      onAdClicked: () => console.log('Banner clicked'),
      onAdFailed: (error: string) => {
        console.error('Banner show failed:', error);
        isShowingRef.current = false;
        setIsVisible(false);
      },
    });
  }, [position]);

  // ③ نابودی بنر (باید هنگام unmount یا ترک صفحه صدا زده شود)
  const destroyAd = useCallback(() => {
    if (!adIdRef.current) return;

    destroyBannerAd(adIdRef.current);
    adIdRef.current = null;
    setAdId(null);
    isShowingRef.current = false;
    setIsVisible(false);
  }, []);

  // ④ لود خودکار هنگام mount
  useEffect(() => {
    if (autoLoad) {
      loadAd();
    }
  }, [autoLoad, loadAd]);

  // ⑤ نابودی خودکار هنگام unmount (برای جلوگیری از نشتی حافظه)
  useEffect(() => {
    return () => {
      if (adIdRef.current) {
        destroyBannerAd(adIdRef.current);
        adIdRef.current = null;
      }
    };
  }, []);

  return {
    loadAd,
    showAd,
    destroyAd,
    loading,
    isVisible,
    isReady: !!adId,
  };
};