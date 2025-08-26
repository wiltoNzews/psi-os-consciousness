# Contribuindo para o WiltonOS

Este documento descreve as diretrizes para contribuir com o projeto WiltonOS. Por favor, leia este guia atentamente antes de enviar qualquer contribuição.

## Princípios Fundamentais

1. **Proporção Quântica 3:1**: Mantenha o equilíbrio entre estabilidade (75%) e exploração (25%) em todas as contribuições.
2. **Kaizen Flow**: Siga o processo de melhoria contínua, com pequenas melhorias incrementais.
3. **Longevidade**: Otimize para manutenção a longo prazo, não para ganhos imediatos.

## Fluxo de Contribuição

1. Escolha uma issue do board ou crie uma nova
2. Crie um branch para sua contribuição (ex: `feat/nome-da-funcionalidade`)
3. Desenvolva sua contribuição seguindo as convenções de código
4. Envie um Pull Request para a branch principal
5. Aguarde a revisão por um steward do projeto

## Conventional Commits

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/), que facilita a geração automática de changelogs e versões.

### Formato básico

```
<tipo>(<escopo>): <descrição>

[corpo]

[rodapé]
```

### Tipos de Commit

- **feat**: Uma nova funcionalidade
- **fix**: Correção de bug
- **docs**: Alterações na documentação
- **style**: Alterações de formatação (espaços, indentação, etc.)
- **refactor**: Refatoração de código existente
- **perf**: Melhorias de performance
- **test**: Adicionando ou corrigindo testes
- **build**: Alterações no sistema de build, dependências
- **ci**: Alterações na configuração de CI
- **chore**: Outras alterações que não modificam código ou testes
- **revert**: Reverte um commit anterior

### Escopos

- **core**: Funcionalidades centrais
- **router**: Sistema META-ROUTING
- **qctf**: Quantum Coherence Testing Framework
- **api**: APIs REST/GraphQL
- **websocket**: Servidor WebSocket
- **gauge**: Quantum Gauge
- **recalibration**: Sistema de Auto-Recalibração
- **dashboard**: Interface de visualização
- **docs**: Documentação
- **deps**: Dependências
- **ci**: Integração contínua
- **test**: Testes
- **kaizen**: Melhorias de processo Kaizen
- **longevity**: Melhorias de longevidade

### Exemplos

```
feat(dashboard): adicionar visualização de equilíbrio quântico em tempo real

Adiciona um gráfico em tempo real que mostra a proporção estabilidade/exploração.
O gráfico atualiza via WebSocket a cada 5 segundos e mostra os status:
- Ótimo (verde): 2.9 a 3.1
- Subótimo (amarelo): 2.5 a 3.5 (exceto faixa ótima)
- Crítico (vermelho): abaixo de 2.5 ou acima de 3.5

Ref #123
```

```
fix(recalibration): corrigir bug na detecção de desequilíbrio quântico

Resolve um problema onde o sistema não disparava recalibração automática
quando a proporção caía abaixo de 2.5:1. Adicionados testes para verificar
os limiares corretos.

Closes #456
```

## Ciclo de Release

O projeto utiliza semantic-release para automatizar a geração de changelogs e versões. A versão é determinada automaticamente com base nos commits convencionais:

- **major (1.0.0)**: Breaking changes (indicados por `!` ou `BREAKING CHANGE:` no rodapé)
- **minor (0.1.0)**: Novos recursos (`feat`)
- **patch (0.0.1)**: Correções de bugs e melhorias (`fix`, `perf`, etc.)

## Ferramentas de Qualidade

Antes de enviar seu PR, certifique-se de que:

1. O código passa em todos os linters (pylint, eslint)
2. Os testes estão passando
3. A documentação foi atualizada
4. Seus commits seguem a convenção Conventional Commits

## Manutenção a Longo Prazo

Lembre-se sempre do [Guia de Longevidade](./LONGEVITY_GUIDE.md) ao contribuir. Optimize for deletion — cada linha avaliada por custo de carregar nos próximos 5 anos.