type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  // useState shares the theme across header, sidebar, and pages without another store.
  const mode = useState<ThemeMode>('theme-mode', () => 'light')

  /** Sincroniza classe global e preferência persistida somente no navegador. */
  const applyTheme = async (nextMode: ThemeMode) => {
    if (!import.meta.client) {
      return
    }

    const html = document.documentElement
    
    // Tailwind uses the `dark` class on the HTML element to enable dark variants.
    if (nextMode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    
    localStorage.setItem('crm-theme', nextMode)
    
    // Wait for Vue to process the change before the caller continues.
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

  // The saved preference takes priority over the operating-system setting.
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
