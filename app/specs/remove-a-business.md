# Exclusão de negócio

- **Status**: implementada
- **Autor**: Diego Pessoa
- **Data**: 2026-09-23

## Objetivo

Adicionar ao detalhe do negócio uma ação de exclusão. A ação deve ser permitida para usuários `master` e `admin` em qualquer negócio, ou para usuários `seller` somente quando forem donos de um negócio aberto. A autorização deve ser validada pelo backend; o frontend apenas controla a visibilidade e o fluxo da ação.

## Requisitos funcionais

- [ ] Adicionar uma ação de excluir negócio em `app/pages/negocio/[id].vue`.
- [ ] Exibir a ação para usuários `master` e `admin` em qualquer status.
- [ ] Exibir a ação para `seller` somente quando o usuário autenticado for o dono do negócio e o negócio estiver aberto.
- [ ] Não exibir a ação para `seller` em negócios ganhos ou perdidos.
- [ ] Solicitar confirmação antes de excluir o negócio.
- [ ] Desabilitar a ação enquanto a requisição estiver em andamento.
- [ ] Após a exclusão, exibir mensagem de sucesso e redirecionar para a listagem de negócios.
- [ ] Atualizar a listagem/kanban para que o negócio excluído não permaneça visível.
- [ ] Exibir a mensagem retornada pela API para erros de permissão, negócio inexistente ou falha de comunicação.


## Fora de escopo

- Implementação da regra de autorização no Laravel; ela deverá ser entregue pelo backend ou estar disponível antes da integração do frontend.
- Exclusão de cliente, produto, funil, etapas, notas, atividades e documentos relacionados.
- Alteração do comportamento de negócios ganhos ou perdidos para usuários `master` e `admin`.

## Regras de permissão

- `master`: pode excluir qualquer negócio da instância selecionada.
- `admin`: pode excluir qualquer negócio da instância selecionada.
- `seller`: pode excluir somente negócio aberto cujo `owner_id` seja o ID do usuário autenticado.
- `seller`: não pode excluir negócios ganhos ou perdidos, mesmo que seja o dono.
- A API deve aplicar as mesmas regras independentemente da visibilidade do botão no frontend.

### Definição dos status

- **Aberto**: negócio com status `1` (`Open`).
- **Perdido**: negócio com status `2` (`Lost`). O campo `loss_reason` registra o motivo da perda, mas não substitui o código de status.
- **Ganho**: negócio com status `3` (`Winned`).

Esses códigos são o contrato atual da API Laravel.


## Contrato de API

```http
DELETE /api/businesses/{business_id}
```

Resposta de sucesso:

```json
{
  "data": {
    "error": null,
    "message": "Negócio removido com sucesso."
  }
}
```

O frontend consumirá a rota por meio de `useApi`:

```ts
request(`/businesses/${businessId}`, { method: 'DELETE' })
```

Respostas mínimas esperadas:

- `200`: negócio removido com sucesso.
- `401`: usuário não autenticado.
- `403`: usuário autenticado sem permissão para excluir o negócio.
- `404`: negócio inexistente ou indisponível na instância selecionada.

A exclusão deve impedir que o negócio continue sendo retornado nas listagens. O comportamento dos registros relacionados deve ser definido pelo backend sem permitir exclusão indevida de dados de outra instância.

## Critérios de aceite

- [ ] Dado um usuário `master`, quando acessar um negócio, então poderá excluí-lo independentemente do status e do dono.
- [ ] Dado um usuário `admin`, quando acessar um negócio, então poderá excluí-lo independentemente do status e do dono.
- [ ] Dado um `seller` que seja dono de um negócio aberto, quando confirmar a exclusão, então o negócio será removido com sucesso.
- [ ] Dado um `seller` que não seja dono de um negócio aberto, então a ação de exclusão não será exibida e a API rejeitará uma tentativa direta com `403`.
- [ ] Dado um `seller` dono de um negócio ganho ou perdido, então a ação de exclusão não será exibida e a API rejeitará uma tentativa direta com `403`.
- [ ] Dado um negócio inexistente ou indisponível na instância atual, quando houver tentativa de exclusão, então a API responderá `404`.
- [ ] Dado um usuário sem autenticação, quando houver tentativa de exclusão, então a API responderá `401`.
- [ ] Após uma exclusão bem-sucedida, o usuário verá a mensagem de sucesso, será redirecionado para a listagem e o negócio não será mais exibido.
- [ ] Durante a requisição, a ação não poderá ser acionada novamente.

## Notas técnicas

- Arquivo principal: `app/pages/negocio/[id].vue`.
- A chamada deve seguir o fluxo existente `page/component -> composable ou repository -> useApi`.
- A regra de visibilidade deve usar o papel normalizado do usuário e o `ownerId` do negócio.
- A visibilidade do botão não substitui a autorização no Laravel.
- O contrato do backend deve ser confirmado antes da implementação; esta spec não autoriza criar uma rota Laravel nesta tarefa.
