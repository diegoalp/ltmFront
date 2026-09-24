# Adicionar e remover valores repetíveis

- **Status**: implementada
- **Autor**: Diego Pessoa
- **Data**: 2026-09-23

## Objetivo

Permitir adicionar e remover linhas de campos personalizados do tipo grupo/repetível no detalhe de um negócio, como parcelas, contratos ou garantias. As novas ações estarão disponíveis somente enquanto o negócio estiver aberto.

A edição de uma linha existente já faz parte do formulário de edição do negócio e deve continuar preservada.

## Requisitos funcionais

- [ ] Exibir uma ação “Adicionar” em cada seção que contenha um campo do tipo grupo/repetível.
- [ ] Abrir o formulário com os subcampos configurados para o grupo selecionado.
- [ ] Inicializar uma nova linha com valores vazios compatíveis com os tipos dos subcampos.
- [ ] Validar os subcampos obrigatórios antes de salvar.
- [ ] Adicionar a nova linha sem alterar as demais linhas ou outros campos personalizados do negócio.
- [ ] Exibir uma ação “Remover” em cada linha existente.
- [ ] Solicitar confirmação antes de remover uma linha.
- [ ] Remover somente a linha confirmada e preservar as demais linhas na mesma ordem.
- [ ] Não exibir as ações de adicionar e remover em negócios ganhos ou perdidos.
- [ ] Desabilitar as ações enquanto a requisição estiver em andamento.
- [ ] Atualizar os valores exibidos na seção após uma operação bem-sucedida.
- [ ] Exibir a mensagem retornada pela API para erros de validação, permissão ou comunicação.


## Fora de escopo

- Alterar a definição dos campos, subcampos, tipos, opções ou obrigatoriedade do grupo.
- Alterar o comportamento de negócios ganhos ou perdidos.
- Criar uma nova regra de papéis ou propriedade do negócio; a operação deve usar as permissões existentes para edição de negócios.
- Alterar ou remover o cliente, o negócio, notas, atividades ou documentos relacionados.

## Regras de permissão

- Ações de adicionar e remover valores repetíveis só podem ser executadas para negócios abertos.
- A API deve validar o status do negócio e a permissão de edição do usuário; ocultar a ação no frontend não substitui essa validação.
- Usuários não autorizados devem receber `403` ao tentar alterar os campos diretamente pela API.

### Definição dos status

- **Aberto**: negócio com status `1` (`Open`).
- **Perdido**: negócio com status `2` (`Lost`). O campo `loss_reason` registra o motivo da perda, mas não substitui o código de status.
- **Ganho**: negócio com status `3` (`Winned`).


## Contrato de API

As operações usam o recurso existente de negócio:

```http
PATCH /api/businesses/{business_id}
```

O frontend envia o conjunto atualizado de campos personalizados. O campo do grupo é identificado pela chave do campo configurado e seu valor é sempre uma lista de linhas:

```json
{
  "custom_data": {
    "custom_fields": {
      "campo_repetivel_id": [
        {
          "subcampo_texto": "Parcela 1",
          "subcampo_valor": 1250.5
        }
      ]
    }
  }
}
```

- Para adicionar, enviar a lista existente acrescida da nova linha.
- Para remover, enviar a lista existente sem a linha confirmada.
- O frontend deve preservar os demais campos personalizados no payload.
- Valores numéricos devem ser enviados como números, checkboxes como booleanos e campos vazios como `null` quando aplicável.
- A API deve validar que o campo e seus subcampos pertencem à instância do negócio e respeitam a definição configurada.

Respostas mínimas esperadas:

- `200`: campos atualizados com sucesso.
- `401`: usuário não autenticado.
- `403`: usuário sem permissão ou negócio fechado.
- `404`: negócio inexistente ou indisponível na instância selecionada.
- `422`: linha inválida ou subcampo obrigatório ausente.

## Critérios de aceite

- [ ] Dado um negócio aberto e um usuário autorizado, quando clicar em “Adicionar”, então será exibido o formulário dos subcampos do grupo.
- [ ] Dado um formulário com subcampo obrigatório vazio, quando tentar salvar, então a requisição não será enviada e o campo será sinalizado como inválido.
- [ ] Dado um formulário válido, quando confirmar o cadastro, então a nova linha será persistida e exibida na seção sem alterar as outras linhas.
- [ ] Dado um negócio aberto com linhas existentes, quando clicar em “Remover” em uma linha, então será solicitada confirmação.
- [ ] Dado que a remoção seja cancelada, então nenhuma alteração será enviada.
- [ ] Dado que a remoção seja confirmada, então somente a linha selecionada será removida e a seção será atualizada.
- [ ] Dado um negócio ganho ou perdido, então as ações de adicionar e remover não serão exibidas.
- [ ] Dado um negócio ganho ou perdido, quando houver tentativa direta de alteração, então a API responderá `403`.
- [ ] Dado um usuário não autenticado, quando houver tentativa de alteração, então a API responderá `401`.
- [ ] Dado um negócio inexistente ou indisponível na instância atual, quando houver tentativa de alteração, então a API responderá `404`.
- [ ] Dado um payload inválido, então a API responderá `422` e o frontend exibirá a mensagem correspondente.
- [ ] Durante a requisição, o formulário e as ações não poderão ser acionados novamente.

## Notas técnicas

- Arquivos principais: `app/pages/negocio/[id].vue` e `app/components/business/EditBusinessModal.vue`.
- A chamada deve seguir o fluxo existente `page/component -> composable ou repository -> useApi`.
- A linha deve ser identificada de forma estável durante a interação; se a API não fornecer ID por linha, o frontend pode usar o índice somente dentro do formulário e deve reenviar a lista resultante.
- A resposta deve ser refletida no estado compartilhado do negócio e no detalhe sem exigir recarregamento manual da página.
- O contrato de status está documentado em `server/api/README.md` e usa `1 = Open`, `2 = Lost`, `3 = Winned`.
