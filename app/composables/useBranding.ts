import type { CRMBrandingSettings } from '~/types/crm'

const STORAGE_KEY = 'crm-branding-settings'

const defaultBranding: CRMBrandingSettings = {
  companyName: 'LTM',
  logoDataUrl: null,
  primaryColor: '#625751',
  secondaryColor: '#0f766e',
  accentColor: '#f59e0b',
  primaryTextColor: '#ffffff'
}

const colorPresets = [
  {
    name: 'LTM',
    primaryColor: '#625751',
    secondaryColor: '#0f766e',
    accentColor: '#f59e0b',
    primaryTextColor: '#ffffff'
  },
  {
    name: 'Oceano',
    primaryColor: '#0f766e',
    secondaryColor: '#0369a1',
    accentColor: '#f97316',
    primaryTextColor: '#ffffff'
  },
  {
    name: 'Grafite',
    primaryColor: '#111827',
    secondaryColor: '#475569',
    accentColor: '#22c55e',
    primaryTextColor: '#ffffff'
  },
  {
    name: 'Vinho',
    primaryColor: '#9f1239',
    secondaryColor: '#7c3aed',
    accentColor: '#facc15',
    primaryTextColor: '#ffffff'
  }
]

const isHexColor = (value: string) => /^#[0-9a-f]{6}$/i.test(value)

const sanitizeBranding = (value: Partial<CRMBrandingSettings>): CRMBrandingSettings => {
  return {
    companyName: typeof value.companyName === 'string' && value.companyName.trim()
      ? value.companyName.trim()
      : defaultBranding.companyName,
    logoDataUrl: typeof value.logoDataUrl === 'string' && value.logoDataUrl.startsWith('data:image/')
      ? value.logoDataUrl
      : null,
    primaryColor: typeof value.primaryColor === 'string' && isHexColor(value.primaryColor)
      ? value.primaryColor
      : defaultBranding.primaryColor,
    secondaryColor: typeof value.secondaryColor === 'string' && isHexColor(value.secondaryColor)
      ? value.secondaryColor
      : defaultBranding.secondaryColor,
    accentColor: typeof value.accentColor === 'string' && isHexColor(value.accentColor)
      ? value.accentColor
      : defaultBranding.accentColor,
    primaryTextColor: typeof value.primaryTextColor === 'string' && isHexColor(value.primaryTextColor)
      ? value.primaryTextColor
      : defaultBranding.primaryTextColor
  }
}

export const useBranding = () => {
  const settings = useState<CRMBrandingSettings>('crm-branding-settings', () => ({ ...defaultBranding }))
  const uploadError = useState<string | null>('crm-branding-upload-error', () => null)

  const applyBranding = (nextSettings: CRMBrandingSettings) => {
    if (!import.meta.client) {
      return
    }

    const root = document.documentElement
    root.style.setProperty('--crm-primary', nextSettings.primaryColor)
    root.style.setProperty('--crm-secondary', nextSettings.secondaryColor)
    root.style.setProperty('--crm-accent', nextSettings.accentColor)
    root.style.setProperty('--crm-primary-text', nextSettings.primaryTextColor)
  }

  const persistBranding = (nextSettings: CRMBrandingSettings) => {
    if (!import.meta.client) {
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings))
  }

  const updateBranding = (nextSettings: Partial<CRMBrandingSettings>) => {
    settings.value = sanitizeBranding({
      ...settings.value,
      ...nextSettings
    })
    persistBranding(settings.value)
    applyBranding(settings.value)
  }

  const setLogoFromFile = async (file: File) => {
    uploadError.value = null

    if (!file.type.startsWith('image/')) {
      uploadError.value = 'Envie um arquivo de imagem.'
      return
    }

    if (file.size > 1024 * 1024) {
      uploadError.value = 'A imagem deve ter no máximo 1 MB.'
      return
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Não foi possível carregar a imagem.'))
      reader.readAsDataURL(file)
    })

    updateBranding({ logoDataUrl: dataUrl })
  }

  const removeLogo = () => {
    updateBranding({ logoDataUrl: null })
  }

  const resetBranding = () => {
    uploadError.value = null
    settings.value = { ...defaultBranding }
    persistBranding(settings.value)
    applyBranding(settings.value)
  }

  const apiPayload = computed(() => ({
    companyName: settings.value.companyName,
    logoDataUrl: settings.value.logoDataUrl,
    colors: {
      primary: settings.value.primaryColor,
      secondary: settings.value.secondaryColor,
      accent: settings.value.accentColor,
      primaryText: settings.value.primaryTextColor
    }
  }))

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      applyBranding(settings.value)
      return
    }

    try {
      settings.value = sanitizeBranding(JSON.parse(stored))
    } catch {
      settings.value = { ...defaultBranding }
    }

    applyBranding(settings.value)
  })

  return {
    settings,
    uploadError,
    colorPresets,
    apiPayload,
    updateBranding,
    setLogoFromFile,
    removeLogo,
    resetBranding
  }
}
