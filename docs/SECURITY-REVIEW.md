# Revisão de Segurança — FinTrack

Revisão realizada em fevereiro de 2025. Este documento descreve as vulnerabilidades encontradas, correções aplicadas e recomendações adicionais.

---

## Resumo executivo

- **Crítico:** Isolamento de dados entre usuários no Firestore foi corrigido (regras + código).
- **Alto:** Chave Gemini é embutida no bundle do client quando configurada; CSP permissiva.
- **Médio/Baixo:** Rate limit em memória, validação de env só em dev, Storage negado.

---

## 1. Vulnerabilidades críticas (corrigidas)

### 1.1 Falta de isolamento por usuário no Firestore

**Problema:** As regras de segurança do Firestore permitiam que **qualquer usuário autenticado** lesse e alterasse **todas** as transações e contrapartes (`counterparties`). Não havia campo `userId` nos documentos nem regras que restringissem o acesso ao dono dos dados.

**Impacto:** Um usuário mal-intencionado poderia ver, editar ou apagar transações e estabelecimentos de outros usuários.

**Correção aplicada:**

- **`firestore.rules`**
  - **`transactions`:** `read`/`create`/`update`/`delete` exigem que o documento tenha `userId == request.auth.uid` (e no `create` que `request.resource.data.userId == request.auth.uid`).
  - Subcoleção **`transactions/{id}/items`:** acesso permitido apenas se o documento pai (`transactions/{id}`) tiver `userId == request.auth.uid` (via `get()`).
  - **`counterparties`:** mesmo modelo (leitura/atualização/remoção pelo `userId` do documento; criação com `userId` no payload).

- **Código (app):**
  - **TransactionService:** Todas as escritas (`create`, `createMany`) passam a incluir `userId` (via `getCurrentUserId()`). Todas as leituras que usam `query` passam a usar `where('userId', '==', userId)`.
  - **CounterpartyService:** `create` inclui `userId`; `getAll` e `getByNormalizedName` filtram por `userId`.

**Migração de dados existentes:** Documentos antigos **não** possuem o campo `userId`. Após publicar as novas regras, esses documentos deixarão de ser acessíveis pelas regras atuais. É necessário uma **migração única** para preencher `userId` em todos os documentos existentes (por exemplo, um script Node/Admin SDK que leia cada documento, defina `userId` com o dono correto e faça o update). Até lá, convém manter um backup das regras antigas ou rodar a migração antes de ativar as regras novas.

---

## 2. Vulnerabilidades de risco alto

### 2.1 Chave da API Gemini no bundle do client

**Problema:** A `GEMINI_API_KEY` é injetada em **build time** pelo Vite (`define` em `vite.config.ts`). O valor é embutido no JavaScript do client; qualquer pessoa que inspecionar o bundle (ex.: DevTools → Sources) pode obter a chave.

**Mitigação atual:** O projeto evita o prefixo `VITE_` para não expor a chave via `import.meta.env` de forma óbvia, mas o `define` ainda coloca o valor no bundle. A proteção real deve ser feita no **Google Cloud Console**:

- Restringir a chave da API Gemini por **referrer** (domínios do app) e/ou por **API** (apenas Generative Language API).
- Definir cotas e alertas de uso para detectar abuso.

**Recomendação:** Para evitar qualquer exposição da chave, mover as chamadas ao Gemini para um **backend** (por ex. Cloud Functions) e chamar esse backend a partir do app. O client não teria a chave; o rate limit e a validação seriam feitos no servidor.

### 2.2 Content-Security-Policy permissiva

**Problema:** No `netlify.toml`, a CSP inclui `'unsafe-inline'` e `'unsafe-eval'` em `script-src`, o que enfraquece a proteção contra XSS.

**Recomendação:** Quando possível, migrar para nonces ou hashes para scripts (por ex. suporte do Vite/Netlify) e remover `'unsafe-inline'` e `'unsafe-eval'`.

---

## 3. Pontos de atenção (médio/baixo)

### 3.1 Rate limit do OCR em memória

O rate limit do OCR (`ocr.service.ts`) é por **sessão/aba** (estado em memória). Não protege contra múltiplos usuários ou várias abas. Para produção, considerar rate limit por usuário (ex.: Firestore ou backend).

### 3.2 Validação de variáveis de ambiente só em dev

`validateEnv()` em `env-validation.ts` retorna sem validar em `import.meta.env.PROD`. Em produção, o build pode ser feito sem variáveis obrigatórias e o erro só aparecer em runtime. Considerar falhar o build se variáveis obrigatórias estiverem ausentes (por ex. em script de build).

### 3.3 Firebase Storage

As regras em `storage.rules` negam todo acesso. Se no futuro o app usar Storage (ex.: fotos de cupons), é necessário liberar apenas caminhos por usuário (`userId`) e impor limite de tamanho e tipo de conteúdo, conforme o exemplo comentado nas regras.

---

## 4. Pontos positivos

- **Rotas protegidas:** O app só renderiza o router após autenticação; usuário não logado vê apenas a tela de login.
- **Sem `dangerouslySetInnerHTML` / `eval`:** Nenhum uso encontrado no código, reduzindo superfície de XSS.
- **Headers de segurança (Netlify):** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Strict-Transport-Security`, `Permissions-Policy` e CSP já configurados.
- **`.env` no `.gitignore`:** Evita commit acidental de credenciais.
- **User settings isolados:** A coleção `users/{userId}` já estava restrita ao dono nas regras e no código.

---

## 5. Índices compostos no Firestore

Após as alterações, várias queries usam `where('userId', '==', ...)` junto com outros campos (ex.: `date`, `source`, `category`). O Firestore pode exigir **índices compostos**. Ao rodar o app, verifique o console do navegador ou os logs do Firebase; se aparecer erro com link para criar índice, use-o para criar o índice no Firebase Console.

---

## 6. Checklist pós-revisão

- [x] Regras do Firestore com isolamento por `userId` em `transactions` e `counterparties`
- [x] Código do app escrevendo e consultando com `userId`
- [ ] Migração dos documentos existentes (adicionar `userId`) antes ou logo após ativar as novas regras
- [ ] Restringir API Key do Firebase e da Gemini no Google Cloud Console
- [ ] (Opcional) Ativar Firebase App Check
- [ ] (Opcional) Endurecer CSP (remover `unsafe-inline` / `unsafe-eval` quando possível)
