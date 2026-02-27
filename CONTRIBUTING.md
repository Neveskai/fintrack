# Contribuindo para o FinTrack

Obrigado por considerar contribuir com o FinTrack! Este guia explica como participar.

## 🚀 Como começar

1. **Fork** o repositório
2. **Clone** seu fork: `git clone https://github.com/SEU_USUARIO/personal-assistant.git`
3. **Instale** as dependências: `yarn install`
4. **Configure** o ambiente: `cp .env.example .env` (preencha com suas credenciais Firebase)
5. **Rode** o projeto: `yarn dev`

## 📝 Workflow de Contribuição

1. Crie uma branch a partir de `main`:
   ```bash
   git checkout -b feat/minha-feature
   ```

2. Faça suas alterações seguindo as [convenções de código](#convenções-de-código)

3. Verifique tipos e lint:
   ```bash
   yarn lint        # TypeScript type-check
   npx eslint .     # ESLint
   ```

4. Faça commit seguindo [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: adiciona filtro por data no painel
   fix: corrige cálculo de total de despesas
   docs: atualiza instruções de deploy
   refactor: extrai hook useTransactionFilters
   ```

5. Abra um **Pull Request** com:
   - Descrição clara do que foi feito
   - Screenshots/vídeos se houver mudança visual
   - Referência a issues relacionadas

## 📐 Convenções de Código

- **TypeScript** — tipagem estrita, evite `any`
- **React** — componentes funcionais, hooks customizados
- **Naming** — `kebab-case` para arquivos, `PascalCase` para componentes, `camelCase` para funções
- **Estrutura** — cada feature em sua pasta com `index.ts` para re-export
- **UI** — use os componentes do design system em `src/common/ui/`
- **Idioma** — UI em português (pt-BR), código e comentários em português ou inglês

## 🐛 Reportando Bugs

Abra uma [issue](../../issues/new) com:
- Descrição do problema
- Passos para reproduzir
- Comportamento esperado vs. atual
- Screenshots (se aplicável)
- Versão do navegador/SO

## 💡 Sugerindo Features

Abra uma [issue](../../issues/new) com a tag `enhancement` descrevendo:
- O problema que a feature resolve
- Como você imagina a solução
- Alternativas consideradas

## ⚠️ Segurança

Se encontrar uma vulnerabilidade de segurança, **NÃO** abra uma issue pública. Envie um email para o maintainer ou use o recurso de "Security Advisories" do GitHub.

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma [MIT License](LICENSE) do projeto.
