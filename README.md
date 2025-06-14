# Subscription Manager

Um aplicativo mobile desenvolvido em React Native para gerenciamento de assinaturas mensais, permitindo ao usuário cadastrar, visualizar e gerenciar suas assinaturas de serviços como streaming, cursos, clubes, etc.

## Equipe

- **Desenvolvedores:** 
Mariana Paiva de Souza Moreira - 2312130137
Othon Flávio Alves de Sales - 2312130178

- **Projeto:** Aplicativo de Gerenciamento de Assinaturas

## Funcionalidades

### ✅ Funcionalidades Implementadas

- **Tela Inicial (Home):** Exibe resumo financeiro com gasto total mensal e próximas renovações
- **Adicionar Assinatura:** Formulário para cadastrar novas assinaturas com validação
- **Lista Completa:** Visualização de todas as assinaturas com busca e filtros
- **Editar Assinatura:** Atualização de dados de assinaturas existentes
- **Excluir Assinatura:** Remoção de assinaturas com confirmação
- **Navegação:** Sistema de navegação entre telas usando React Navigation
- **Persistência:** Dados salvos em tempo real no Firebase Firestore
- **Interface Responsiva:** Design adaptado para dispositivos móveis

### 📱 Telas do Aplicativo

1. **Tela Inicial (Home/Gasto Total)**
   - Resumo financeiro com gasto total estimado
   - Lista das próximas 3-5 assinaturas a vencer
   - Botões para adicionar nova assinatura e ver lista completa

2. **Tela de Adicionar Assinatura**
   - Campos: Nome, Valor Mensal, Data de Renovação, Categoria
   - Validação de dados e formatação automática
   - Categorias: Streaming, Educação, Software, Fitness, Outros

3. **Tela de Lista Completa de Assinaturas**
   - Lista detalhada de todas as assinaturas
   - Busca por nome ou categoria
   - Opções para editar ou excluir cada assinatura

## Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **React Navigation** - Sistema de navegação entre telas
- **JavaScript/ES6+** - Linguagem de programação

## Estrutura do Projeto

```
SubscriptionManager/
├── App.js                          # Componente principal com navegação
├── firebaseConfig.js               # Configuração do Firebase
├── screens/                        # Telas do aplicativo
│   ├── HomeScreen.js               # Tela inicial
│   ├── AddSubscriptionScreen.js    # Tela de adicionar assinatura
│   ├── SubscriptionListScreen.js   # Tela de lista completa
│   └── EditSubscriptionScreen.js   # Tela de editar assinatura
├── package.json                    # Dependências do projeto
└── README.md                       # Este arquivo
```

## Instalação e Execução

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase (para configuração do banco de dados)

### Passos para Execução

1. **Clone o repositório:**
   ```bash
   git https://github.com/oth0n-as/trabalhopt2_pdm.git
   cd subscriptionmanager
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
   - Ative o Firestore Database
   - Copie as credenciais de configuração
   - Substitua as credenciais no arquivo `firebaseConfig.js`

4. **Execute o aplicativo:**
   ```bash
   npm start
   ```

5. **Teste o aplicativo:**
   - Para web: Pressione `w` no terminal
   - Para Android: Pressione `a` no terminal (requer Android Studio)
   - Para iOS: Pressione `i` no terminal (requer Xcode - apenas macOS)
   - Para dispositivo físico: Use o app Expo Go e escaneie o QR code
     
## Configuração do Firebase

### Estrutura do Banco de Dados (Firestore)

**Coleção: `subscriptions`**

Cada documento contém:
```javascript
{
  nome: string,           // Nome da assinatura
  valor: number,          // Valor mensal em reais
  dataRenovacao: timestamp, // Data da próxima renovação
  categoria: string,      // Categoria da assinatura
  dataCriacao: timestamp, // Data de criação do registro
  dataAtualizacao: timestamp // Data da última atualização (opcional)
}
```

## Funcionalidades Detalhadas

### 🏠 Tela Inicial
- **Gasto Total:** Soma automática de todas as assinaturas ativas
- **Próximas Renovações:** Lista ordenada por data de vencimento
- **Navegação Rápida:** Botões para adicionar nova assinatura ou ver lista completa

### ➕ Adicionar Assinatura
- **Validação de Dados:** Campos obrigatórios e formato de data
- **Formatação Automática:** Máscara para data (DD/MM/AAAA)
- **Categorização:** Seleção de categoria predefinida
- **Feedback Visual:** Indicadores de carregamento e mensagens de sucesso/erro

### 📋 Lista de Assinaturas
- **Busca Inteligente:** Filtro por nome ou categoria
- **Ações Rápidas:** Editar com toque, excluir com toque longo
- **Informações Completas:** Nome, categoria, valor e data de renovação
- **Totalizador:** Valor total e quantidade de assinaturas

### ✏️ Editar Assinatura
- **Pré-preenchimento:** Dados atuais carregados automaticamente
- **Validação Consistente:** Mesmas regras da tela de adicionar
- **Atualização em Tempo Real:** Mudanças refletidas imediatamente

## Dependências Principais

```json
{
  "firebase": "^10.x.x",
  "@react-navigation/native": "^6.x.x",
  "@react-navigation/stack": "^6.x.x",
  "@react-native-picker/picker": "^2.x.x",
  "react-native-screens": "^3.x.x",
  "react-native-safe-area-context": "^4.x.x"
}
```

## Próximas Melhorias

- [ ] Notificações push para lembrar das renovações
- [ ] Gráficos de gastos mensais
- [ ] Backup e sincronização entre dispositivos
- [ ] Categorias personalizadas
- [ ] Histórico de pagamentos
- [ ] Modo escuro
- [ ] Suporte a múltiplas moedas

**Desenvolvido com ❤️ usando React Native e Firebase**

