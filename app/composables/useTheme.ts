type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  const mode = useState<ThemeMode>('theme-mode', () => 'light')

  const applyTheme = async (nextMode: ThemeMode) => {
    if (!import.meta.client) {
      return
    }

    const html = document.documentElement
    
    // Remove e re-adiciona a classe para forçar re-render
    if (nextMode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    localStorage.setItem('crm-theme', nextMode)
    
    // Aguarda Vue processar a mudança
    await nextTick()
  }

  const setTheme = async (nextMode: ThemeMode) => {
    mode.value = nextMode
    await applyTheme(nextMode)
  }

  const toggleTheme = async () => {
    const nextMode = mode.value === 'dark' ? 'light' : 'dark'
    await setTheme(nextMode)
  }

  onMounted(async () => {
    const stored = localStorage.getItem('crm-theme') as ThemeMode | null

    if (stored === 'light' || stored === 'dark') {
      await setTheme(stored)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    await setTheme(prefersDark ? 'dark' : 'light')
  })

  return {
    mode,
    setTheme,
    toggleTheme
  }
}
