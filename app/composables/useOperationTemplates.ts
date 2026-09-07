import type { InstalledOperationTemplate, OperationTemplate } from '~/types/crm'

const OPERATION_TEMPLATES: OperationTemplate[] = [
  {
    id: 'credito-consignado',
    name: 'Crédito consignado',
    segment: 'Financeiro',
    description: 'Modelo para operação com convênios, contratos, margem, banco de origem e documentação.',
    accentClass: 'bg-sky-500',
    stages: [
      { title: 'Lead', expirationLabel: '4 horas' },
      { title: 'Simulação', expirationLabel: '12 horas' },
      { title: 'Documentação', expirationLabel: '1 dia' },
      { title: 'Banco', expirationLabel: '2 dias' },
      { title: 'Formalização', expirationLabel: '1 dia' },
      { title: 'Pago', expirationLabel: 'Sem expiração' }
    ],
    fields: [
      { label: 'CPF', type: 'document', required: true },
      { label: 'Convênio', type: 'select', required: true },
      { label: 'Matrícula', type: 'text', required: true },
      { label: 'Banco de origem', type: 'text', required: false },
      { label: 'Contratos ativos', type: 'group', required: false },
      { label: 'Documentos pessoais', type: 'file', required: true }
    ],
    automations: [
      { trigger: 'Lead parado por 4 horas', action: 'Marcar como urgente e avisar responsável' },
      { trigger: 'Mover para Documentação', action: 'Exigir upload de RG, CPF e comprovante' },
      { trigger: 'Negócio perdido', action: 'Exigir motivo de perda' }
    ],
    dashboards: ['Valor em esteira', 'Taxa de aprovação', 'Tempo médio por banco', 'Perdas por motivo'],
    products: ['Novo', 'Refinanciamento', 'Compra de dívida', 'Portabilidade'],
    lossReasons: ['Sem margem', 'Cliente desistiu', 'Banco recusou', 'Concorrência venceu']
  },
  {
    id: 'imobiliaria',
    name: 'Imobiliária',
    segment: 'Vendas consultivas',
    description: 'Modelo para captação, visita, proposta, documentação e fechamento de imóveis.',
    accentClass: 'bg-emerald-500',
    stages: [
      { title: 'Novo interesse', expirationLabel: '2 horas' },
      { title: 'Qualificação', expirationLabel: '1 dia' },
      { title: 'Visita agendada', expirationLabel: '2 dias' },
      { title: 'Proposta', expirationLabel: '2 dias' },
      { title: 'Contrato', expirationLabel: '3 dias' },
      { title: 'Fechado', expirationLabel: 'Sem expiração' }
    ],
    fields: [
      { label: 'Tipo de imóvel', type: 'select', required: true },
      { label: 'Região de interesse', type: 'text', required: true },
      { label: 'Orçamento', type: 'currency', required: true },
      { label: 'Data da visita', type: 'date', required: false },
      { label: 'Documentos do comprador', type: 'file', required: false }
    ],
    automations: [
      { trigger: 'Visita agendada', action: 'Criar lembrete para o corretor' },
      { trigger: 'Proposta enviada', action: 'Agendar follow-up para 24 horas' },
      { trigger: 'Contrato fechado', action: 'Criar tarefa de pós-venda' }
    ],
    dashboards: ['Visitas agendadas', 'Propostas por corretor', 'Ticket médio', 'Conversão por bairro'],
    products: ['Venda', 'Locação', 'Lançamento', 'Captação'],
    lossReasons: ['Preço incompatível', 'Região não atende', 'Crédito recusado', 'Comprou com concorrente']
  },
  {
    id: 'clinica-estetica',
    name: 'Clínica e estética',
    segment: 'Saúde e bem-estar',
    description: 'Modelo para avaliação, orçamento, agendamento, procedimento e retorno.',
    accentClass: 'bg-fuchsia-500',
    stages: [
      { title: 'Novo contato', expirationLabel: '1 hora' },
      { title: 'Avaliação', expirationLabel: '1 dia' },
      { title: 'Orçamento', expirationLabel: '1 dia' },
      { title: 'Agendado', expirationLabel: 'Sem expiração' },
      { title: 'Realizado', expirationLabel: 'Sem expiração' },
      { title: 'Retorno', expirationLabel: '7 dias' }
    ],
    fields: [
      { label: 'Procedimento de interesse', type: 'select', required: true },
      { label: 'Data pretendida', type: 'date', required: false },
      { label: 'Profissional preferido', type: 'select', required: false },
      { label: 'Valor do pacote', type: 'currency', required: false },
      { label: 'Ficha de anamnese', type: 'file', required: false }
    ],
    automations: [
      { trigger: 'Avaliação marcada', action: 'Enviar lembrete no dia anterior' },
      { trigger: 'Procedimento realizado', action: 'Criar retorno automático' },
      { trigger: 'Orçamento parado', action: 'Sugerir contato de recuperação' }
    ],
    dashboards: ['Agendamentos', 'Receita por procedimento', 'Retornos pendentes', 'Conversão de avaliação'],
    products: ['Consulta', 'Procedimento avulso', 'Pacote', 'Retorno'],
    lossReasons: ['Preço', 'Agenda incompatível', 'Sem retorno', 'Procedimento não indicado']
  },
  {
    id: 'b2b-saas',
    name: 'B2B SaaS',
    segment: 'Vendas B2B',
    description: 'Modelo para prospecção, diagnóstico, demonstração, proposta e onboarding.',
    accentClass: 'bg-violet-500',
    stages: [
      { title: 'Prospect', expirationLabel: '2 dias' },
      { title: 'Diagnóstico', expirationLabel: '2 dias' },
      { title: 'Demonstração', expirationLabel: '3 dias' },
      { title: 'Proposta', expirationLabel: '3 dias' },
      { title: 'Contrato', expirationLabel: '5 dias' },
      { title: 'Onboarding', expirationLabel: '7 dias' }
    ],
    fields: [
      { label: 'Empresa', type: 'text', required: true },
      { label: 'Cargo do decisor', type: 'text', required: true },
      { label: 'Tamanho da equipe', type: 'number', required: false },
      { label: 'Plano de interesse', type: 'select', required: true },
      { label: 'MRR estimado', type: 'currency', required: false }
    ],
    automations: [
      { trigger: 'Demo realizada', action: 'Criar tarefa de proposta' },
      { trigger: 'Proposta sem resposta', action: 'Agendar follow-up em 48 horas' },
      { trigger: 'Contrato ganho', action: 'Mover para onboarding' }
    ],
    dashboards: ['MRR em pipeline', 'Win rate', 'Ciclo médio de venda', 'Conversão por origem'],
    products: ['Starter', 'Growth', 'Enterprise', 'Serviços profissionais'],
    lossReasons: ['Sem orçamento', 'Sem fit', 'Projeto adiado', 'Escolheu concorrente']
  }
]

/** Manages the local template catalog and the installation persisted in Laravel. */
export const useOperationTemplates = () => {
  const { request } = useApi()
  const templates = useState<OperationTemplate[]>('operation-templates', () => OPERATION_TEMPLATES)
  const installedTemplate = useState<InstalledOperationTemplate | null>('installed-operation-template', () => null)

  // The API stores only the key; full details come from the local catalog above.
  const activeTemplate = computed(() => {
    if (!installedTemplate.value) {
      return null
    }

    return templates.value.find((template) => template.id === installedTemplate.value?.templateId) ?? null
  })

  const installTemplate = async (templateId: string) => {
    const response = await request<{ data: InstalledOperationTemplate }>('/operation-template', {
      method: 'PUT', body: { templateId }
    })
    installedTemplate.value = response.data
  }

  /** Normalizes snake_case response names into the UI model. */
  const refreshInstalledTemplate = async () => {
    const response = await request<{ data: { template_key: string, installed_at: string } | null }>('/operation-template')
    installedTemplate.value = response.data ? { templateId: response.data.template_key, installedAt: response.data.installed_at } : null
  }

  const templateById = (templateId: string) => {
    return templates.value.find((template) => template.id === templateId)
  }

  if (import.meta.client) void refreshInstalledTemplate()

  return {
    templates,
    installedTemplate,
    activeTemplate,
    installTemplate,
    templateById,
    refreshInstalledTemplate
  }
}
