# Criar página de checklists em configurações

- **Status**: rascunho
- **Autor**: Diego Pessoa
- **Data**: 2026-09-28

## Objetivo

Permitir que usuários `master` e `admin` configurem checklists para os negócios da instância, incluindo seus itens, ordem, obrigatoriedade e regras de aplicação por funil, produto e etapa.

A checklist configurada nesta página será consumida posteriormente na página do negócio através dos endpoints de checklists aplicáveis e de conclusão de itens.

## Escopo

### Incluído

- Listagem paginada de checklists da instância atual.
- Criação, edição, ativação/desativação e remoção de checklists.
- Inclusão, edição, reordenação e remoção de itens.
- Configuração dos funis associados.
- Configuração de condições por funil, produto e etapa mínima.
- Exibição de mensagens de validação, permissão, autenticação e comunicação.
- Restrição de acesso para `master` e `admin`.

### Não incluído nesta página

- Exibição da checklist na página do negócio.
- Marcação de itens como concluídos pelo usuário final.
- Relatórios de conclusão.
- Histórico administrativo detalhado das alterações.

Esses pontos dependem dos endpoints de execução da checklist e podem ser implementados em uma etapa posterior.

## Requisitos funcionais

- [ ] Exibir o item “Checklists” no menu de configurações para usuários `master` e `admin`.
- [ ] Disponibilizar a rota `/configuracoes/checklists`.
- [ ] Listar checklists da instância atual com título, descrição, status, funis, condições e quantidade de itens.
- [ ] Exibir estado de carregamento, estado vazio e erro de carregamento.
- [ ] Exibir botão para criar um checklist.
- [ ] Exibir botão para editar um checklist existente.
- [ ] Exibir botão para ativar ou desativar um checklist.
- [ ] Exibir confirmação antes de remover um checklist.
- [ ] Exibir botão para adicionar itens.
- [ ] Permitir editar o texto, a obrigatoriedade e a posição dos itens.
- [ ] Permitir reordenar os itens por drag-and-drop ou controles de mover para cima/baixo.
- [ ] Permitir remover itens com confirmação.
- [ ] Permitir selecionar um ou mais funis associados ao checklist.
- [ ] Permitir criar condições de aplicação por funil.
- [ ] Permitir selecionar produtos específicos em uma condição ou deixar a condição sem produtos para abranger todos os produtos do funil.
- [ ] Permitir selecionar uma etapa mínima para a condição.
- [ ] Exibir as condições configuradas de forma legível na listagem e no formulário.
- [ ] Exibir as mensagens retornadas pela API para erros de validação, permissão, autenticação e comunicação.

## Modelo funcional

### Checklist

- `id`
- `title`: obrigatório, máximo de 255 caracteres e único na instância.
- `description`: opcional.
- `active`: define se a checklist pode ser aplicada a novos negócios.
- `funnel_ids`: pelo menos um funil.
- `items`: lista de itens configurados.
- `conditions`: regras de aplicação por funil, produtos e etapa mínima.

### Item

- `id`: informado somente na edição.
- `label`: obrigatório, máximo de 255 caracteres.
- `position`: inteiro positivo e único dentro da checklist.
- `required`: indica se o item é obrigatório.

### Condição

- `funnel_id`: deve estar entre os funis associados ao checklist.
- `product_ids`: opcional; vazio significa todos os produtos daquele funil.
- `min_stage_id`: opcional; deve pertencer ao funil da condição.

## Regras de negócio

- Somente usuários `master` e `admin` podem criar, editar, ativar/desativar ou remover checklists.
- A página deve bloquear acesso direto de usuários não autorizados, além da proteção existente no menu.
- O checklist pertence à instância selecionada no contexto atual.
- O título deve ser único dentro da mesma instância.
- Cada checklist deve estar associado a pelo menos um funil.
- Uma condição só pode usar um funil associado ao checklist.
- Um mesmo funil não pode ter mais de uma condição sem produtos.
- Uma condição sem produtos cobre todos os produtos daquele funil e não pode coexistir com condições específicas para o mesmo funil.
- Um produto pode estar associado a somente um checklist por funil.
- Um produto não pode aparecer em mais de uma condição do mesmo checklist.
- Produtos selecionados devem pertencer ao funil da condição.
- A etapa mínima selecionada deve pertencer ao funil da condição.
- Itens devem ter posições únicas e consecutivas após salvar.
- Ao remover um item, a interface deve atualizar a ordem dos itens restantes.
- Desativar um checklist impede novas aplicações, mas não remove conclusões existentes.
- A remoção de um checklist deve exigir confirmação e remove também seus itens, condições e associações conforme o comportamento da API.

## Permissões

### Frontend

- `master` e `admin`: podem acessar a página e executar todas as operações.
- `seller` e demais perfis: não devem visualizar o item de menu nem acessar a rota diretamente.
- A tentativa de acesso direto deve redirecionar ou exibir uma página de acesso negado.

### API

- Usuário não autenticado: `401`.
- Usuário autenticado sem permissão: `403` ao criar, editar ou remover.
- Payload inválido ou conflito de regra: `422`.
- Os erros da API devem ser apresentados sem substituir a mensagem específica por uma mensagem genérica.

## Contrato de API

Todos os endpoints usam o prefixo `/api` e o contexto da instância autenticada.

### Listar checklists

```http
GET /api/checklists?page=1
```

Resposta esperada: coleção paginada contendo `id`, `title`, `description`, `active`, `funnels`, `items`, `conditions`, `created_at` e `updated_at`.

### Consultar checklist

```http
GET /api/checklists/{checklist}
```

### Criar checklist

```http
POST /api/checklists
Content-Type: application/json
```

Payload:

```json
{
  "instance_id": 1,
  "title": "Documentação inicial",
  "description": "Documentos necessários para iniciar a análise.",
  "active": true,
  "funnel_ids": [2],
  "items": [
    { "label": "Documento de identificação", "position": 1, "required": true },
    { "label": "Comprovante de residência", "position": 2, "required": false }
  ],
  "conditions": [
    {
      "funnel_id": 2,
      "product_ids": [4, 5],
      "min_stage_id": 8
    }
  ]
}
```

Resposta: `201` com o recurso completo do checklist.

### Editar checklist e itens

```http
PATCH /api/checklists/{checklist}
Content-Type: application/json
```

O payload deve aceitar os mesmos campos da criação. Itens existentes devem enviar `id`; itens novos não enviam `id`. A lista enviada representa o estado final da checklist: itens omitidos serão removidos e os demais terão seus dados atualizados.

### Remover checklist

```http
DELETE /api/checklists/{checklist}
```

Resposta: `204` em caso de sucesso.

### Consultar checklists aplicáveis a um negócio

```http
GET /api/businesses/{business}/checklists
```

Esse endpoint será utilizado pela futura seção de checklist na página do negócio.

### Atualizar conclusão de item

```http
PATCH /api/businesses/{business}/checklists/{checklist}/items/{item}/completion
Content-Type: application/json
```

Payload:

```json
{ "done": true }
```

Esse endpoint está fora da implementação da página administrativa.

## Estados da interface

- Carregando lista.
- Lista vazia com ação “Criar checklist”.
- Erro ao carregar.
- Formulário de criação.
- Formulário de edição.
- Salvando.
- Erro de validação por campo ou por regra de relacionamento.
- Confirmação de remoção.
- Checklist ativa.
- Checklist inativa.

## Critérios de aceite

- [ ] Usuário `admin` acessa `/configuracoes/checklists` pelo menu de configurações.
- [ ] Usuário `master` acessa `/configuracoes/checklists` pelo menu de configurações.
- [ ] Usuário `seller` não visualiza o menu e não acessa a rota diretamente.
- [ ] A listagem apresenta checklists somente da instância atual.
- [ ] A paginação da API é tratada corretamente.
- [ ] É possível criar checklist com título, funil e itens.
- [ ] É possível criar item obrigatório e opcional.
- [ ] É possível editar título, descrição, status, funis, condições e itens.
- [ ] É possível reordenar itens e salvar posições válidas.
- [ ] É possível remover um item sem remover a checklist inteira.
- [ ] É possível remover uma checklist após confirmação.
- [ ] O frontend exibe erro para título duplicado.
- [ ] O frontend exibe erro para conflito de produto/funil/etapa.
- [ ] O frontend exibe mensagens `401`, `403` e `422` retornadas pela API.
- [ ] Não é possível salvar checklist sem funil.
- [ ] Não é possível criar duas condições abrangentes para o mesmo funil.
- [ ] Não é possível associar produto fora do funil selecionado.
- [ ] Uma checklist inativa permanece visível na administração, mas não deve ser aplicada a novos negócios.
- [ ] A exclusão exibe confirmação e atualiza a listagem após sucesso.

## Notas técnicas

- Utilizar `useApi` para todas as requisições.
- Criar tipos de resposta da API em `app/types/api.ts`.
- Criar tipos de domínio em `app/types/crm.ts`.
- Criar composable específico, por exemplo `useChecklists.ts`, para listagem, formulário e mutations.
- Separar a tela em componentes pequenos: listagem, formulário, editor de itens e editor de condições.
- Reutilizar composables existentes para carregar funis, produtos e etapas.
- Não expor a chave da API no browser.
- O placeholder atual “Checklist do negócio” em `app/pages/negocio/[id].vue` deve ser tratado em uma spec de integração separada.
