export const onlyDigits = (value: string) => value.replace(/\D/g, '')

export const maskCpf = (value: string) => onlyDigits(value)
  .slice(0, 11)
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d)/, '$1.$2')
  .replace(/(\d{3})(\d{1,2})$/, '$1-$2')

export const maskCnpj = (value: string) => onlyDigits(value)
  .slice(0, 14)
  .replace(/^(\d{2})(\d)/, '$1.$2')
  .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  .replace(/\.(\d{3})(\d)/, '.$1/$2')
  .replace(/(\d{4})(\d{1,2})$/, '$1-$2')

export const maskDocument = (value: string, type: 'individual' | 'company') => type === 'company' ? maskCnpj(value) : maskCpf(value)

export const maskPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})/, (_, area, prefix, suffix) => [
      area && `(${area}`,
      area.length === 2 ? ') ' : '',
      prefix,
      suffix && `-${suffix}`
    ].join(''))
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
}
