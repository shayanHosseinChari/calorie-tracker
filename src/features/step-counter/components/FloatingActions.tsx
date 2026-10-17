import React, { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from 'react-native'
import { LinearGradient } from 'react-native-linear-gradient'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from '@/shared/hooks/useTheme'
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons'

type Props = {
  onReset: () => void
  onOpenGoalSheet: () => void
}

export const FloatingActions: React.FC<Props> = ({
  onReset,
  onOpenGoalSheet,
}) => {
  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const t = useTheme()
  const { colors, spacing, typography } = t
  const tabBarHeight = useBottomTabBarHeight()

  const handleConfirmReset = () => {
    setIsAlertVisible(false)
    onReset()
  }

  return (
    <>
      <View
        style={[
          styles.container,
          {
            paddingBottom: tabBarHeight + spacing.xxl,
            gap: spacing.sm,
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onOpenGoalSheet}
          style={({ pressed }) => [
            styles.button,
            styles.primaryShadow,
            { transform: [{ scale: pressed ? 0.98 : 1 }] },
          ]}
        >
          <LinearGradient
            colors={[colors.orange, colors.peachDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <View style={styles.iconBubble}>
              <MaterialDesignIcons name="flag-outline" size={21} color="#FFFFFF" />
            </View>

            <View style={styles.labelGroup}>
              <Text
                style={[
                  styles.title,
                  { fontFamily: typography.family },
                ]}
              >
                تعیین هدف روزانه
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { fontFamily: typography.family },
                ]}
              >
                برای قدم‌های بیشتر برنامه‌ریزی کن
              </Text>
            </View>

            <MaterialDesignIcons
              name="chevron-right"
              size={20}
              color="rgba(255,255,255,0.9)"
            />
          </LinearGradient>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setIsAlertVisible(true)}
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            {
              backgroundColor: colors.white,
              borderColor: colors.peachDeep,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <View style={styles.resetIconBubble}>
            <MaterialDesignIcons name="refresh-circle" size={20} color={colors.peachDeep} />
          </View>

          <View style={styles.labelGroup}>
            <Text
              style={[
                styles.resetTitle,
                {
                  color: colors.neutralIconActive,
                  fontFamily: typography.family,
                },
              ]}
            >
              ریست قدم‌ها
            </Text>
            <Text
              style={[
                styles.resetSubtitle,
                {
                  color: colors.neutralIconActive,
                  fontFamily: typography.family,
                },
              ]}
            >
              شروع دوباره برای امروز
            </Text>
          </View>

          <MaterialDesignIcons
            name="chevron-right"
            size={20}
            color={colors.neutralIconActive}
          />
        </Pressable>
      </View>

      {/* کاستوم الرت */}
      <Modal
        visible={isAlertVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsAlertVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialogContainer, { backgroundColor: colors.white }]}>
            <View style={styles.alertIconWrapper}>
              <MaterialDesignIcons name="alert-circle-outline" size={32} color={colors.peachDeep} />
            </View>

            <Text style={[styles.dialogTitle, { fontFamily: typography.family }]}>
              ریست قدم‌ها
            </Text>
            <Text style={[styles.dialogDescription, { fontFamily: typography.family }]}>
              آیا از ریست کردن قدم‌های امروز اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </Text>

            <View style={styles.dialogActions}>
              <Pressable
                onPress={() => setIsAlertVisible(false)}
                style={({ pressed }) => [
                  styles.dialogButton,
                  styles.cancelButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[styles.cancelButtonText, { fontFamily: typography.family }]}>
                  انصراف
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirmReset}
                style={({ pressed }) => [
                  styles.dialogButton,
                  styles.confirmButton,
                  { backgroundColor: colors.peachDeep, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <Text style={[styles.confirmButtonText, { fontFamily: typography.family }]}>
                  ریست کن
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
},
  button: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  primaryButton: {
    minHeight: 76,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  primaryShadow: {
    shadowColor: '#D96A2B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 7,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelGroup: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'right',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 12,
    textAlign: 'right',
  },
  secondaryButton: {
    minHeight: 70,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    borderWidth: 1,
    shadowColor: '#5B3525',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  resetIconBubble: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(235, 120, 72, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetTitle: {
    fontSize: 15,
    textAlign: 'right',
  },
  resetSubtitle: {
    fontSize: 12,
    opacity: 0.65,
    textAlign: 'right',
  },
  /* استایل‌های الرت کاستوم */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialogContainer: {
    width: '100%',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  alertIconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(235, 120, 72, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  dialogTitle: {
    fontSize: 17,
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  dialogDescription: {
    fontSize: 13.5,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  dialogActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dialogButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    color: '#48484A',
    fontSize: 14.5,
  },
  confirmButton: {},
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14.5,
  },
})
