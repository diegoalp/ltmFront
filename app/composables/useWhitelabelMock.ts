import type {
  CRMAutomationRule,
  CRMCustomField,
  CRMFunnel,
  CRMPermissionRole,
  CRMPublicLeadForm,
  CRMTask
} from '~/types/crm'

const INITIAL_FUNNELS: CRMFunnel[] = [
  {
    id: 'comercial',
    name: 'Comercial',
    description: 'Fluxo principal de venda, da entrada do lead ao fechamento.',
    ownerTeam: 'Time Digital',
    colorClass: 'bg-indigo-500',
    active: true,
    stages: [
      { title: 'Lead', expirationLabel: '4 horas' },
      { title: 'Qualificação', expirationLabel: '1 dia' },
      { title: 'Proposta', expirationLabel: '2 dias' },
      { title: 'Fechado', expirationLabel: 'Sem expiração' }
    ]
  },
  {
    id: 'backoffice',
    name: 'Backoffice',
    description: 'Acompanhamento operacional após venda, com pendências e validação documental.',
    ownerTeam: 'Operações',
    colorClass: 'bg-sky-500',
    active: true,
    stages: [
      { title: 'Documentos', expirationLabel: '12 horas' },
      { title: 'Análise', expirationLabel: '1 dia' },
      { title: 'Correção', expirationLabel: '8 horas' },
      { title: 'Finalizado', expirationLabel: 'Sem expiração' }
    ]
  },
  {
    id: 'pos-venda',
    name: 'Pós-venda',
    description: 'Retenção, satisfação e oportunidades de renovação ou recompra.',
    ownerTeam: 'Sucesso do Cliente',
    colorClass: 'bg-emerald-500',
    active: true,
    stages: [
      { title: 'Boas-vindas', expirationLabel: '1 dia' },
      { title: 'Acompanhamento', expirationLabel: '7 dias' },
      { title: 'Renovação', expirationLabel: '30 dias' },
      { title: 'Concluído', expirationLabel: 'Sem expiração' }
    ]
  }
]

const INITIAL_CUSTOM_FIELDS: CRMCustomField[] = [
  { id: 'cpf', label: 'CPF/CNPJ', section: 'Cliente', type: 'document', required: true, visibleWhen: 'Todos os produtos' },
  { id: 'telefone', label: 'Telefone principal', section: 'Cliente', type: 'phone', required: true, visibleWhen: 'Todos os produtos' },
  { id: 'origem', label: 'Origem do lead', section: 'Comercial', type: 'select', required: true, visibleWhen: 'Novo negócio' },
  { id: 'orcamento', label: 'Orçamento estimado', section: 'Comercial', type: 'currency', required: false, visibleWhen: 'Produto exige valor' },
  { id: 'contratos', label: 'Contratos vinculados', section: 'Operação', type: 'group', required: false, visibleWhen: 'Produto = Compra de dívida' },
  { id: 'documentos', label: 'Documentos obrigatórios', section: 'Operação', type: 'file', required: true, visibleWhen: 'Etapa = Documentação' }
]

const INITIAL_AUTOMATIONS: CRMAutomationRule[] = [
  {
    id: 'sla-lead',
    name: 'SLA de primeiro contato',
    trigger: 'Lead criado',
    condition: 'Sem interação em 4 horas',
    action: 'Marcar prioridade alta e avisar responsável',
    active: true
  },
  {
    id: 'docs-required',
    name: 'Checklist de documentação',
    trigger: 'Card movido para Documentação',
    condition: 'Produto exige arquivos',
    action: 'Bloquear avanço até anexar documentos obrigatórios',
    active: true
  },
  {
    id: 'lost-reason',
    name: 'Motivo obrigatório de perda',
    trigger: 'Negócio marcado como perdido',
    condition: 'Motivo vazio',
    action: 'Exigir tabulação antes de arquivar',
    active: true
  },
  {
    id: 'post-sale',
    name: 'Pós-venda automático',
    trigger: 'Negócio ganho',
    condition: 'Funil comercial',
    action: 'Criar tarefa no funil de pós-venda',
    active: false
  }
]

const PERMISSION_KEYS = ['viewOwnDeals', 'viewTeamDeals', 'moveStages', 'editValues', 'exportData', 'manageSettings']

const INITIAL_ROLES: CRMPermissionRole[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso completo à instância whitelabel.',
    permissions: Object.fromEntries(PERMISSION_KEYS.map((key) => [key, true]))
  },
  {
    id: 'gerente',
    name: 'Gerente',
    description: 'Gerencia equipe, funis e indicadores comerciais.',
    permissions: {
      viewOwnDeals: true,
      viewTeamDeals: true,
      moveStages: true,
      editValues: true,
      exportData: true,
      manageSettings: false
    }
  },
  {
    id: 'vendedor',
    name: 'Vendedor',
    description: 'Atua nos próprios leads e tarefas.',
    permissions: {
      viewOwnDeals: true,
      viewTeamDeals: false,
      moveStages: true,
      editValues: false,
      exportData: false,
      manageSettings: false
    }
  },
  {
    id: 'backoffice',
    name: 'Backoffice',
    description: 'Cuida de documentos e validações operacionais.',
    permissions: {
      viewOwnDeals: true,
      viewTeamDeals: true,
      moveStages: true,
      editValues: false,
      exportData: false,
      manageSettings: false
    }
  }
]

const INITIAL_TASKS: CRMTask[] = [
  { id: 1, title: 'Retornar lead parado', dealTitle: 'Antonio Francisco da Silva', ownerName: 'Diego Sales', dueLabel: 'Hoje, 14:00', priority: 'high' },
  { id: 2, title: 'Validar documentação', dealTitle: 'Lucas de Oliveira Martins', ownerName: 'Backoffice', dueLabel: 'Hoje, 16:30', priority: 'medium' },
  { id: 3, title: 'Follow-up de proposta', dealTitle: 'Jozué Pereira dos Santos', ownerName: 'Marina Lopes', dueLabel: 'Amanhã', priority: 'medium' }
]

const INITIAL_PUBLIC_FORMS: CRMPublicLeadForm[] = [
  {
    id: 'landing-consignado',
    name: 'Landing page consignado',
    headline: 'Simule sua proposta em poucos minutos',
    channel: 'Facebook Ads',
    assignedFunnelId: 'comercial',
    fields: ['Nome', 'WhatsApp', 'CPF', 'Convênio', 'Valor desejado'],
    active: true
  },
  {
    id: 'indicacao',
    name: 'Formulário de indicação',
    headline: 'Indique alguém para atendimento',
    channel: 'Indicação',
    assignedFunnelId: 'comercial',
    fields: ['Nome indicado', 'Telefone', 'Quem indicou', 'Observação'],
    active: false
  }
]

export const useWhitelabelMock = () => {
  const funnels = useState<CRMFunnel[]>('crm-funnels', () => INITIAL_FUNNELS)
  const customFields = useState<CRMCustomField[]>('crm-custom-fields', () => INITIAL_CUSTOM_FIELDS)
  const automations = useState<CRMAutomationRule[]>('crm-automations', () => INITIAL_AUTOMATIONS)
  const roles = useState<CRMPermissionRole[]>('crm-permission-roles', () => INITIAL_ROLES)
  const tasks = useState<CRMTask[]>('crm-tasks', () => INITIAL_TASKS)
  const publicForms = useState<CRMPublicLeadForm[]>('crm-public-forms', () => INITIAL_PUBLIC_FORMS)

  const permissionLabels: Record<string, string> = {
    viewOwnDeals: 'Ver próprios negócios',
    viewTeamDeals: 'Ver negócios da equipe',
    moveStages: 'Mover etapas',
    editValues: 'Editar valores',
    exportData: 'Exportar dados',
    manageSettings: 'Gerenciar configurações'
  }

  const addFunnel = (payload: Omit<CRMFunnel, 'id' | 'active'>) => {
    funnels.value.push({ id: String(Date.now()), active: true, ...payload })
  }

  const addCustomField = (payload: Omit<CRMCustomField, 'id'>) => {
    customFields.value.push({ id: String(Date.now()), ...payload })
  }

  const addAutomation = (payload: Omit<CRMAutomationRule, 'id' | 'active'>) => {
    automations.value.push({ id: String(Date.now()), active: true, ...payload })
  }

  const toggleAutomation = (automationId: string) => {
    const automation = automations.value.find((item) => item.id === automationId)
    if (automation) {
      automation.active = !automation.active
    }
  }

  const togglePermission = (roleId: string, permissionKey: string) => {
    const role = roles.value.find((item) => item.id === roleId)
    if (role) {
      role.permissions[permissionKey] = !role.permissions[permissionKey]
    }
  }

  const addPublicForm = (payload: Omit<CRMPublicLeadForm, 'id' | 'active'>) => {
    publicForms.value.push({ id: String(Date.now()), active: true, ...payload })
  }

  return {
    funnels,
    customFields,
    automations,
    roles,
    tasks,
    publicForms,
    permissionLabels,
    addFunnel,
    addCustomField,
    addAutomation,
    toggleAutomation,
    togglePermission,
    addPublicForm
  }
}
