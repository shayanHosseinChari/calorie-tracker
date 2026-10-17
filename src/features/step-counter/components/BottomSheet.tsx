import React, { useEffect, useRef } from 'react'
import {
  Modal,
  View,
  Pressable,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useTheme } from '@/shared/hooks/useTheme'

type Props = {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  height?: number
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export const BottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  children,
  height = SCREEN_HEIGHT * 0.5,
}) => {
  const t = useTheme()
  const { colors, radius, spacing } = t
  const translateY = useRef(new Animated.Value(height)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, height, translateY, backdropOpacity])

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* بک‌دراپ */}
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* محتوا */}
        <Animated.View
          style={[
            styles.sheet,
            {
              height,
              backgroundColor: colors.white,
              borderTopLeftRadius: radius.xl ?? 24,
              borderTopRightRadius: radius.xl ?? 24,
              paddingTop: spacing.md,
              transform: [{ translateY }],
            },
          ]}
        >
          {/* دستگیره */}
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.macroTrack, marginBottom: spacing.md },
            ]}
          />
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: {
    position:'absolute',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
})