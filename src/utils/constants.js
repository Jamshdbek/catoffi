export const PRESETS = [
  { id: 1, label: 'Pomodoro',    duration: 25 * 60 },
  { id: 2, label: 'Short Break', duration:  5 * 60 },
  { id: 3, label: 'Long Break',  duration: 15 * 60 },
  { id: 4, label: 'Deep Work',   duration: 90 * 60 },
]

export const INITIAL_TIMERS = [
  { id: 1, name: 'Morning Focus',  duration: 45 * 60, tag: 'Work' },
  { id: 2, name: 'Read Book',      duration: 30 * 60, tag: 'Personal' },
  { id: 3, name: 'Workout',        duration: 60 * 60, tag: 'Health' },
  { id: 4, name: 'Meditation',     duration: 10 * 60, tag: 'Mindful' },
  { id: 5, name: 'Language Study', duration: 20 * 60, tag: 'Learning' },
  { id: 6, name: 'Evening Walk',   duration: 40 * 60, tag: 'Health' },
]

export const TAGS = ['Work', 'Personal', 'Health', 'Mindful', 'Learning', 'Other']

export const THEMES = [
  { id: 'dark',     label: 'Mono Dark',  preview: '#0a0a0a', accent: '#ffffff' },
  { id: 'light',    label: 'Mono Light', preview: '#efefef', accent: '#111111' },
  { id: 'ocean',    label: 'Ocean',      preview: '#0a1628', accent: '#60a5fa' },
  { id: 'sunset',   label: 'Sunset',     preview: '#1a0f1a', accent: '#fb923c' },
  { id: 'forest',   label: 'Forest',     preview: '#0a1f14', accent: '#34d399' },
  { id: 'midnight', label: 'Midnight',   preview: '#15102a', accent: '#a78bfa' },
]
