import { updateAndroidWidget, VoltraAndroid } from '@use-voltra/android-client'

const StepWidget = ({ steps, goal }: { steps: number; goal: number }) => (
  <VoltraAndroid.Box
    style={{
      padding: 16,
      backgroundColor: '#F6F5EF',
      borderRadius: 20,
      width: '100%',
      height: '100%',
    }}
  >
    <VoltraAndroid.Column
      style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
    >
      <VoltraAndroid.Text
        style={{ fontSize: 36, fontWeight: 'bold', color: '#252820' }}
      >
        {steps.toLocaleString('fa-IR')}
      </VoltraAndroid.Text>
      <VoltraAndroid.Text
        style={{ fontSize: 12, color: '#8D9086', marginTop: 4 }}
      >
        از {goal.toLocaleString('fa-IR')} قدم
      </VoltraAndroid.Text>
    </VoltraAndroid.Column>
  </VoltraAndroid.Box>
)

export const refreshStepWidget = async (steps: number, goal: number) => {
  try {
    await updateAndroidWidget('step_widget', <StepWidget steps={steps} goal={goal} /> as any)
  } catch {
    // ویجت ممکنه نصب نشده باشه
  }
}