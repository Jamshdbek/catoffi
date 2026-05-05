const STORAGE_KEY = 'focus-language'

export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'uz', label: 'UZ' },
  { code: 'ja', label: 'JA' },
]

const translations = {
  en: {
    // Sidebar
    mode: 'Mode',
    services: 'Services',
    manageServices: 'Manage Services',
    language: 'Language',
    // Preset labels
    preset1: 'Pomodoro',
    preset2: 'Short Break',
    preset3: 'Long Break',
    preset4: 'Deep Work',
    // SettingsPanel
    theme: 'Theme',
    backgroundImage: 'Background Image',
    clickToChange: 'Click to change',
    dropZoneHint: 'Choose a picture or drop it here',
    removeImage: 'Remove image',
    sizeHint: '{minW}×{minH} — {maxW}×{maxH} px · max 5 MB · JPG / PNG / WebP',
    errOnlyImages: 'Only image files are accepted.',
    errMaxSize: 'File size must not exceed 5 MB (current: {size} MB).',
    errMinDimensions: 'Image must be at least {minW}×{minH}px (current: {w}×{h}).',
    errMaxDimensions: 'Image must not exceed {maxW}×{maxH}px (current: {w}×{h}).',
    errCannotRead: 'Cannot read the image.',
    // ServiceModal
    servicesTitle: 'Services',
    notifications: 'Notifications',
    notificationsDesc: 'Timer completion alerts',
    floatingTimer: 'Floating Timer',
    floatingTimerDesc: 'Draggable mini timer overlay',
    windowHeader: 'Window Header',
    windowHeaderDesc: 'Title bar with window controls',
    // AddTimerModal
    newTimer: 'New Timer',
    addTimer: 'Add Timer',
    newStep: 'New Step',
    addStep: 'Add Step',
    nameLbl: 'Name',
    durationLbl: 'Duration (MM:SS)',
    tagLbl: 'Tag',
    namePlaceholder: 'e.g. Deep Reading',
    errNameRequired: 'Name is required',
    errInvalidTime: 'Enter a valid time',
    // Tags
    tag_Work: 'Work',
    tag_Personal: 'Personal',
    tag_Health: 'Health',
    tag_Mindful: 'Mindful',
    tag_Learning: 'Learning',
    tag_Other: 'Other',
    // TimerList
    timers: 'Timers',
    addNewTimer: 'Add new timer',
    stepSequence: 'Step Sequence',
    loopOn: 'Loop: on',
    loopOff: 'Loop: off',
    stop: 'Stop',
    start: 'Start',
    noStepsYet: 'No steps yet. Add one below.',
    addStepBtn: 'Add Step',
    live: 'LIVE',
  },
  uz: {
    mode: 'Rejim',
    services: 'Xizmatlar',
    manageServices: 'Xizmatlarni boshqarish',
    language: 'Til',
    preset1: 'Pomodoro',
    preset2: 'Qisqa tanaffus',
    preset3: 'Uzoq tanaffus',
    preset4: 'Ish',
    theme: 'Mavzu',
    backgroundImage: 'Fon rasmi',
    clickToChange: "O'zgartirish uchun bosing",
    dropZoneHint: 'Rasm tanlang yoki shu yerga tashlang',
    removeImage: "Rasmni o'chirish",
    sizeHint: '{minW}×{minH} — {maxW}×{maxH} px · maks 5 MB · JPG / PNG / WebP',
    errOnlyImages: 'Faqat rasm fayllari qabul qilinadi.',
    errMaxSize: 'Fayl hajmi 5 MB dan oshmasligi kerak (hozir: {size} MB).',
    errMinDimensions: "Rasm o'lchami kamida {minW}×{minH}px bo'lishi kerak (hozir: {w}×{h}).",
    errMaxDimensions: "Rasm o'lchami {maxW}×{maxH}px dan oshmasligi kerak (hozir: {w}×{h}).",
    errCannotRead: "Rasmni o'qib bo'lmadi.",
    servicesTitle: 'Xizmatlar',
    notifications: 'Bildirishnomalar',
    notificationsDesc: 'Taymer tugashi haqida xabar',
    floatingTimer: 'Suzuvchi taymer',
    floatingTimerDesc: 'Sudraladigan mini taymer',
    windowHeader: 'Oyna sarlavhasi',
    windowHeaderDesc: 'Oyna boshqaruv paneli',
    newTimer: 'Yangi taymer',
    addTimer: "Taymer qo'shish",
    newStep: 'Yangi qadam',
    addStep: "Qadam qo'shish",
    nameLbl: 'Nom',
    durationLbl: 'Davomiylik (MM:SS)',
    tagLbl: 'Yorliq',
    namePlaceholder: "mas. Chuqur o'qish",
    errNameRequired: 'Nom kiritilishi shart',
    errInvalidTime: "To'g'ri vaqt kiriting",
    tag_Work: 'Ish',
    tag_Personal: 'Shaxsiy',
    tag_Health: 'Salomatlik',
    tag_Mindful: 'Ongli',
    tag_Learning: "O'rganish",
    tag_Other: 'Boshqa',
    timers: 'Taymerlar',
    addNewTimer: "Yangi taymer qo'shish",
    stepSequence: 'Qadam ketma-ketligi',
    loopOn: 'Takrorlash: yoqiq',
    loopOff: "Takrorlash: o'chiq",
    stop: "To'xtatish",
    start: 'Boshlash',
    noStepsYet: "Hali qadamlar yo'q. Quyida qo'shing.",
    addStepBtn: "Qadam qo'shish",
    live: 'JONLI',
  },
  ja: {
    mode: 'モード',
    services: 'サービス',
    manageServices: 'サービス管理',
    language: '言語',
    preset1: 'ポモドーロ',
    preset2: '短い休憩',
    preset3: '長い休憩',
    preset4: '集中作業',
    theme: 'テーマ',
    backgroundImage: '背景画像',
    clickToChange: 'クリックして変更',
    dropZoneHint: '画像を選択またはドロップ',
    removeImage: '画像を削除',
    sizeHint: '{minW}×{minH} — {maxW}×{maxH} px · 最大 5 MB · JPG / PNG / WebP',
    errOnlyImages: '画像ファイルのみ受け付けます。',
    errMaxSize: 'ファイルサイズは5MB以下にしてください（現在: {size} MB）。',
    errMinDimensions: '画像は最低{minW}×{minH}px必要です（現在: {w}×{h}）。',
    errMaxDimensions: '画像は{maxW}×{maxH}px以下にしてください（現在: {w}×{h}）。',
    errCannotRead: '画像を読み込めません。',
    servicesTitle: 'サービス',
    notifications: '通知',
    notificationsDesc: 'タイマー完了アラート',
    floatingTimer: 'フローティングタイマー',
    floatingTimerDesc: 'ドラッグ可能なミニタイマー',
    windowHeader: 'ウィンドウヘッダー',
    windowHeaderDesc: 'タイトルバーと操作ボタン',
    newTimer: '新しいタイマー',
    addTimer: 'タイマーを追加',
    newStep: '新しいステップ',
    addStep: 'ステップを追加',
    nameLbl: '名前',
    durationLbl: '時間 (MM:SS)',
    tagLbl: 'タグ',
    namePlaceholder: '例: 集中読書',
    errNameRequired: '名前は必須です',
    errInvalidTime: '有効な時間を入力してください',
    tag_Work: '仕事',
    tag_Personal: '個人',
    tag_Health: '健康',
    tag_Mindful: 'マインドフル',
    tag_Learning: '学習',
    tag_Other: 'その他',
    timers: 'タイマー',
    addNewTimer: '新しいタイマーを追加',
    stepSequence: 'ステップシーケンス',
    loopOn: 'ループ: オン',
    loopOff: 'ループ: オフ',
    stop: '停止',
    start: '開始',
    noStepsYet: 'ステップがありません。下に追加してください。',
    addStepBtn: 'ステップを追加',
    live: '実行中',
  },
}

export function getLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && translations[saved]) return saved
  } catch {}
  return 'en'
}

export function setLang(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {}
}

export function translate(lang, key, vars = {}) {
  const dict = translations[lang] || translations.en
  let str = dict[key] ?? translations.en[key] ?? key
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
  })
  return str
}
