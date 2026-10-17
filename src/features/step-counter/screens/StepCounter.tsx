import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from '@/shared/hooks/useTheme'
import { useStepCounter } from '../hooks/useStepCounter'
import { useGoal } from '../hooks/useGoal'
import { StepCircle } from '../components/StepCircle'
import { StatsRow } from '../components/StatRow'
import { FloatingActions } from '../components/FloatingActions'
import { BottomSheet } from '../components/BottomSheet'
import { GoalSheet } from '../components/GoalSheet'

export const StepCounter = () => {
  const t = useTheme()
  const { colors, radius, shadows, spacing, typography } = t
  const tabBarHeight = useBottomTabBarHeight()

  const { goal, setGoal, loading: goalLoading } = useGoal()
  const { data, progress, status, reset } = useStepCounter(goal)
  const [goalSheetVisible, setGoalSheetVisible] = useState(false)

  if (status === 'loading' || goalLoading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.orange} size="large" />
        </View>
      </SafeAreaView>
    )
  }

  if (status === 'denied' || status === 'unsupported') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.center}>
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.base,
              color: colors.muted,
              textAlign: 'center',
              lineHeight: 22,
            }}
          >
            {status === 'denied'
              ? 'برای شمارش قدم‌ها به مجوز دسترسی نیاز داریم.'
              : 'دستگاه شما از شمارش قدم پشتیبانی نمی‌کند.'}
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: spacing.lg,
            paddingBottom: tabBarHeight + 160,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: spacing.md, marginBottom: spacing.lg,justifyContent:'flex-end',alignItems:"flex-end" }}>
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.h1,
              color: colors.text,
            }}
          >
            امروز
          </Text>
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.base,
              color: colors.muted,
              marginTop: 4,
            }}
          >
            بیا به هدفت برسیم 💪
          </Text>
        </View>

        <View style={styles.circleWrapper}>
          <StepCircle steps={data.steps} goal={goal} progress={progress} />
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <StatsRow
            distanceKm={data.distanceKm}
            calories={data.calories}
            activeMinutes={data.activeMinutes}
          />
        </View>

        <View
          style={{
            backgroundColor: colors.greenSurface,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginTop: spacing.lg,
            ...shadows.card,
          }}
        >
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.base,
              color: colors.greenTextDark,
            }}
          >
            پیشرفت امروز
          </Text>
          <Text
            style={{
              fontFamily: typography.family,
              fontSize: typography.size.h1,
              color: colors.greenTextDarker,
              marginTop: spacing.xs,
            }}
          >
            {Math.round(progress * 100).toLocaleString('fa-IR')}٪
          </Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.greenTrack, marginTop: spacing.md },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: colors.greenSurfaceAlt,
                },
              ]}
            />
          </View>
        </View>
         <FloatingActions
        onReset={reset}
        onOpenGoalSheet={() => setGoalSheetVisible(true)}
      />
      </ScrollView>

      <BottomSheet
        visible={goalSheetVisible}
        onClose={() => setGoalSheetVisible(false)}
      >
        <GoalSheet
          goal={goal}
          onSave={setGoal}
          onClose={() => setGoalSheetVisible(false)}
        />
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: { flexGrow: 1 },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
})