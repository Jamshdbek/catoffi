# CatOffi

<img src="https://i.ibb.co/FbBTQF9B/2026-04-30-16-58-18.png" alt="404"/>
**Texnologiyalar:** Electron + Vite + React + Tailwind CSS + Framer Motion

## ✨ Xususiyatlar

- 🎯 **Pomodoro va boshqa rejimlar** — Pomodoro (25m), Short Break (5m), Long Break (15m), Deep Work (90m)
- ⏱️ **Maxsus timerlar** — istalgan vaqt va tag bilan o'zingiznikini qo'shing
- 🎨 **6 xil tema** — Mono Dark, Mono Light, Ocean, Sunset, Forest, Midnight
- 🔔 **Fullscreen notification** — vaqt tugaganda butun ekranni qoplaydigan animatsiyali xabar
- ⌨️ **Klaviatura yorliqlari** — `Space` (start/pause), `R` (reset), `Ctrl/Cmd+N` (new timer)

## 🚀 O'rnatish

```bash
# Paketlarni o'rnatish
npm install
```

## 🛠️ Development rejimida ishga tushirish

```bash
npm run dev
```

Bu komanda Vite dev server (`http://localhost:5173`) va Electron oynani birga ishga tushiradi.

## 📦 Build qilish (macOS va Windows uchun)

### Faqat macOS uchun

```bash
npm run electron:build:mac
```

Source: `release/` papkasida `.dmg` va `.zip` fayllari (x64 va arm64 uchun) bo'ladi.

### Faqat Windows uchun

```bash
npm run electron:build:win
```

Source: `release/` papkasida `.exe` (NSIS installer va portable) fayllar bo'ladi.

### Ikkala platforma uchun birga (faqat Mac yoki Linuxda ishlaydi)

```bash
npm run electron:build:all
```

## 📁 Loyiha tuzilmasi

```
timer-app/
├── electron/
│   ├── main.cjs           # Electron main process (oyna, IPC, notification)
│   └── preload.cjs        # Renderer ↔ Main bridge
├── src/
│   ├── components/        # React komponentlar
│   │   ├── CircularTimer.jsx     # SVG ring + drag handle
│   │   ├── TimerDisplay.jsx      # Markaziy taymer + tugmalar
│   │   ├── Sidebar.jsx           # Chap panel: rejimlar, statistika
│   │   ├── TimerList.jsx         # O'ng panel: timer ro'yxati
│   │   ├── AddTimerModal.jsx     # Yangi timer qo'shish modali
│   │   ├── ThemeToggle.jsx       # Dark/Light tezkor o'zgartiruvchi
│   │   ├── SettingsPanel.jsx     # Tema tanlash paneli
│   │   └── NotificationScreen.jsx # Fullscreen notification
│   ├── contexts/
│   │   └── ThemeContext.jsx      # Tema boshqaruvi
│   ├── hooks/
│   │   └── useTimer.js           # Timer logic (start/pause/reset)
│   ├── utils/
│   │   ├── time.js               # fmt, parseInput
│   │   └── constants.js          # PRESETS, INITIAL_TIMERS, THEMES
│   ├── styles/
│   │   └── index.css             # Tailwind + CSS variables (6 tema)
│   ├── App.jsx                   # Root komponent
│   └── main.jsx                  # Vite kirish nuqtasi
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎮 Ishlatish

### Asosiy ishlatish
1. Yon paneldan rejim tanlang yoki o'ng paneldan tayyor timerni tanlang
2. Markaziy o'rta tugmani bosib timerni ishga tushiring
3. Vaqt tugaganda fullscreen notification ochiladi va tovush chalinadi

### Vaqtni qo'lda o'zgartirish
- Timer **to'xtatilgan** (paused yoki ready) holatida ringdagi oq nuqtani sudrab kerakli vaqtga o'tkazing

### Yangi timer qo'shish
- O'ng paneldagi `+` tugmasini bosing yoki `Ctrl/Cmd+N` bosing
- Nom, vaqt (masalan `25:00` yoki shunchaki `25`), va tag kiriting

### Tema o'zgartirish
- Yon paneldagi sozlamalar (⚙️) tugmasini bosing
- 6 ta temadan birini tanlang

## ⌨️ Klaviatura yorliqlari

| Yorliq | Vazifa |
|--------|--------|
| `Space` | Start / Pause |
| `R` | Reset |
| `Ctrl/Cmd + N` | Yangi timer |
| `Esc` | Modalni yopish |

## 📝 Eslatma

Birinchi marta ishga tushirishda Windows da SmartScreen ogohlantirish berishi mumkin (sertifikat yo'qligi sababli). macOS da Gatekeeper "verifikatsiya qilinmagan dasturchi" deyishi mumkin — System Settings > Privacy & Security > "Open Anyway" orqali ochish mumkin.

