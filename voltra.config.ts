import type { VoltraConfig } from 'voltra'

const config: VoltraConfig = {
  android: {
    widgets: [
      {
        id: 'step_widget',
        displayName: 'قدم شمار من',
        description: 'نمایش تعداد قدم‌های امروز',
        targetCellWidth: 2,
        targetCellHeight: 2,
        initialStatePath: './widgets/step-widget.tsx',
      },
    ],
  },
}

export default config