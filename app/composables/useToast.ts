export type ToastType = 'success' | 'error' | 'confirm'
export type ToastPosition = 'top-right' | 'bottom-right' | 'center'

export interface ToastMessage {
  id: number
  type: ToastType
  title: string
  message: string
  confirmLabel?: string
  position?: ToastPosition
}

interface ToastOptions { title?: string, position?: ToastPosition }
interface ConfirmToastOptions extends ToastOptions { confirmLabel?: string }

let confirmationResolver: ((confirmed: boolean) => void) | null = null

/** Global feedback and confirmation surface. Avoid native alert/confirm dialogs. */
export const useToast = () => {
  const current = useState<ToastMessage | null>('global-toast', () => null)

  const close = (confirmed = false) => {
    confirmationResolver?.(confirmed)
    confirmationResolver = null
    current.value = null
  }

  const show = (type: Exclude<ToastType, 'confirm'>, message: string, options: ToastOptions = {}) => {
    if (confirmationResolver) confirmationResolver(false)
    confirmationResolver = null
    current.value = {
      id: Date.now(), type, message,
      title: options.title || (type === 'success' ? 'Sucesso' : 'Não foi possível concluir'),
      position: options.position || 'bottom-right'
    }
  }

  const success = (message: string, options?: ToastOptions) => show('success', message, options)
  const error = (message: string, options?: ToastOptions) => show('error', message, options)
  const confirm = (message: string, options: ConfirmToastOptions = {}) => new Promise<boolean>((resolve) => {
    if (confirmationResolver) confirmationResolver(false)
    confirmationResolver = resolve
    current.value = {
      id: Date.now(), type: 'confirm', message,
      title: options.title || 'Confirmar ação', confirmLabel: options.confirmLabel || 'Confirmar',
      position: options.position || 'center'
    }
  })

  return { current, success, error, confirm, close }
}
