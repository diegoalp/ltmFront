import type { CRMBrandingSettings } from '~/types/crm'

const defaultBranding: CRMBrandingSettings = {
  companyName: 'CRM',
  logoDataUrl: null,
  primaryColor: '#0550ac',
  secondaryColor: '#0f766e',
  accentColor: '#0ae43a',
  primaryTextColor: '#ffffff'
}

// Presets are visual shortcuts; the selected configuration still comes from the API.
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
const isLogoUrl = (value: unknown): value is string => typeof value === 'string'
  && (/^https?:\/\//i.test(value) || value.startsWith('/storage/'))

const resolveApiAssetUrl = (value: string | null): string | null => {
  if (!value || /^https?:\/\//i.test(value)) return value
  const config = useRuntimeConfig()
  return `${String(config.public.apiBase).replace(/\/$/, '')}${value.startsWith('/') ? value : `/${value}`}`
}

/** Prevents incomplete or invalid API data from breaking the theme. */
const sanitizeBranding = (value: Partial<CRMBrandingSettings>): CRMBrandingSettings => {
  return {
    companyName: typeof value.companyName === 'string' && value.companyName.trim()
      ? value.companyName.trim()
      : defaultBranding.companyName,
    logoDataUrl: isLogoUrl(value.logoDataUrl)
      ? resolveApiAssetUrl(value.logoDataUrl)
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
  const { request, token, instanceId } = useApi()
  const settings = useState<CRMBrandingSettings>('crm-branding-settings', () => ({ ...defaultBranding }))
  const uploadError = useState<string | null>('crm-branding-upload-error', () => null)
  const loadedInstanceId = useState<string | null>('crm-branding-instance-id', () => null)
  const brandingLoading = useState('crm-branding-loading', () => false)

  /** Applies colors as CSS variables shared by components. */
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

  /** Persists in the active instance, then applies the confirmed settings. */
  const updateBranding = async (nextSettings: Partial<CRMBrandingSettings>) => {
    const sanitized = sanitizeBranding({
      ...settings.value,
      ...nextSettings
    })
    if (token.value && instanceId.value) {
      const { logoDataUrl: _logoDataUrl, ...brandingPayload } = sanitized
      const response = await request<{ data: { branding: CRMBrandingSettings } }>('/branding', { method: 'PUT', body: brandingPayload })
      settings.value = sanitizeBranding(response.data.branding)
      loadedInstanceId.value = String(instanceId.value)
    } else {
      settings.value = sanitized
    }
    applyBranding(settings.value)
  }

  /** Validates the image and uploads the binary file to the active instance folder. */
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

    const body = new FormData()
    body.append('logo', file)
    const response = await request<{ data: { branding: CRMBrandingSettings } }>('/branding/logo', { method: 'POST', body })
    settings.value = sanitizeBranding(response.data.branding)
    loadedInstanceId.value = String(instanceId.value)
    applyBranding(settings.value)
  }

  const removeLogo = async () => {
    if (!token.value || !instanceId.value) return
    const response = await request<{ data: { branding: CRMBrandingSettings } }>('/branding/logo', { method: 'DELETE' })
    settings.value = sanitizeBranding(response.data.branding)
    loadedInstanceId.value = String(instanceId.value)
    applyBranding(settings.value)
  }

  const resetBranding = async () => {
    uploadError.value = null
    settings.value = { ...defaultBranding }
    applyBranding(settings.value)
    if (token.value && instanceId.value) {
      await request('/branding/logo', { method: 'DELETE' })
      const { logoDataUrl: _logoDataUrl, ...brandingPayload } = settings.value
      await request('/branding', { method: 'PUT', body: brandingPayload })
      loadedInstanceId.value = String(instanceId.value)
    }
  }

  const apiPayload = computed(() => ({ ...settings.value }))

  /** Reloads branding for the authenticated instance. */
  const refreshBranding = async () => {
    if (!token.value || !instanceId.value || brandingLoading.value) return
    brandingLoading.value = true
    try {
      const response = await request<{ data: { branding: CRMBrandingSettings } }>('/branding')
      settings.value = sanitizeBranding(response.data.branding)
      loadedInstanceId.value = String(instanceId.value)
      applyBranding(settings.value)
    } catch (cause) {
      uploadError.value = cause instanceof Error ? cause.message : 'Não foi possível carregar a identidade visual.'
    } finally {
      brandingLoading.value = false
    }
  }

  onMounted(() => {
    applyBranding(settings.value)
    if (token.value && instanceId.value && loadedInstanceId.value !== String(instanceId.value)) void refreshBranding()
  })

  watch(instanceId, (nextId, previousId) => {
    if (!import.meta.client || String(nextId || '') === String(previousId || '')) return
    settings.value = { ...defaultBranding }
    loadedInstanceId.value = null
    applyBranding(settings.value)
    if (nextId && token.value) void refreshBranding()
  }, { flush: 'post' })

  return {
    settings,
    uploadError,
    colorPresets,
    apiPayload,
    updateBranding,
    setLogoFromFile,
    removeLogo,
    resetBranding,
    refreshBranding
  }
}
