# Checklist - Manutenção de Motos (Motobox)

## Aluno

**Nome:** André Vitor da Silva Oliveira Calixto

**Disciplina:** Linguagem de Script

**Tema:** Checklist de manutenção de motos (oficina mecânica)

---

# Descrição do projeto

Este projeto consiste em uma aplicação web desenvolvida com HTML, CSS e JavaScript puro para o gerenciamento de revisões e manutenções preventivas e corretivas de motocicletas.

A aplicação permite organizar as motocicletas da oficina em blocos visuais, possibilitando cadastrar novas motos, editar informações, marcar itens de revisão como concluídos, excluir tarefas ou veículos e ajustar preferências de tipografia.

O objetivo do projeto é aplicar conceitos de manipulação dinâmica do DOM, gerenciamento de eventos, estilização responsiva *mobile-first* e persistência de dados utilizando apenas tecnologias fundamentais da Web.

---

# Funcionalidades

- **Gerenciamento de Garagem (Blocos):** Organização e exibição das motocicletas registradas na oficina em blocos interativos;
- **Adição de Novas Motos:** Janela modal integrada para cadastrar novos veículos à lista de revisões;
- **Navegação e Transição Fluida:** Alternância visual de telas entre a Garagem (visão geral) e os Detalhes da Revisão da moto selecionada;
- **Gestão de Checklist de Manutenção:**
  - Adição de novos itens de checklist (ex.: troca de óleo, regulagem de correntes, checagem de freios);
  - Edição inline direta do texto das tarefas e dos nomes dos blocos;
  - Marcação de itens como concluídos com destaque visual (texto tachado/riscado);
  - Exclusão individual de tarefas e de blocos de motos;
- **Contador Dinâmico:** Atualização automática da quantidade de revisões pendentes por moto e no painel principal;
- **Ajuste de Tipografia:** Modal de configurações para alterar a variação do peso da fonte (*Inter Normal* vs. *Inter Negrito*) em toda a aplicação.

---

# Estrutura do projeto

```text
motobox-checklist/

│── index.html
│── style.css
│── script.js
└── img/
    ├── mechanic.png
    └── isolated-scooter-cartoon-white-background.png
```

### index.html

Responsável pela estrutura da aplicação, contendo as duas telas principais e os modais sobrepostos (*overlays*):

- **Tela principal:** Exibe o cabeçalho de boas-vindas, o painel da oficina e a grade de motos cadastradas;
- **Tela de Detalhes da Revisão:** Apresenta o cabeçalho da moto selecionada, a lista de tarefas de checklist e o botão de retorno;
- **Janelas Modais:** Diálogos para criação de novos blocos (`#janela-novo-bloco`) e alteração do estilo da fonte (`#alterar-configurações`).

---

### style.css

Responsável por toda a identidade visual e comportamento responsivo do sistema, incluindo:

- Layout simulando uma interface de aplicativo mobile em telas maiores (*mockup* centrado com bordas arredondadas);
- Paleta de cores em tons marcantes de laranja (`#ff7b00`) e azul escuro (`#001336`);
- Efeitos de transição fluida entre telas utilizando translações CSS (`transform: translateX(-100%)`);
- Estilização de botões flutuantes, seletores de checkbox customizados, menus contextuais e modais com fundo escurecido.

---

### script.js

Responsável por toda a inteligência e lógica do sistema.

Entre suas funções estão:

- Alternar visualmente entre a tela inicial e a tela de detalhes;
- Criar dinamicamente novos blocos de motocicletas na grade;
- Renderizar e filtrar dinamicamente a lista de tarefas da moto selecionada (`renderizarTarefasDoBloco`);
- Controlar a edição *inline* ativando campos de entrada (`<input>`) ao editar motos ou tarefas;
- Atualizar dinamicamente os contadores de revisões em tempo real (`atualizarContadorTarefas`);
- Salvar e carregar o estado da aplicação através do armazenamento local no navegador (`localStorage`).

---

# Como a aplicação funciona

Os dados da aplicação são organizados em memória através de um objeto JavaScript global denominado `dadosBlocos`.

Nesse objeto, cada chave corresponde a um identificador único de bloco (`data-id`), e o valor associado é um *array* de objetos contendo as tarefas de revisão (com seus respectivos textos e estados de conclusão).

```javascript
var dadosBlocos = {
    "trabalho": [
        { texto: "Trocar óleo", concluida: false }
    ]
};
```

Sempre que o usuário realiza alguma ação — como cadastrar uma nova moto, adicionar uma tarefa, alterar um texto ou marcar/desmarcar um checklist —, a função de renderização é acionada. O JavaScript limpa a área de conteúdo e constrói dinamicamente os novos elementos no DOM, garantindo sincronização imediata entre os dados em memória e a interface.

---

# Funcionamento dos principais eventos

## Seleção de bloco de moto

Ao clicar no cartão de uma motocicleta na tela principal, a aplicação obtém o atributo `data-id`, altera as informações do cabeçalho da moto ativa, renderiza a lista de tarefas correspondente e aplica a classe CSS que realiza a transição para a tela de detalhes.

---

## Adicionar (Bloco ou Tarefa)

O botão flutuante com o ícone de soma (`+`) possui comportamento duplo de acordo com a tela ativa:
- **Na Garagem:** Abre a janela modal para digitação do nome da nova moto. Ao confirmar, um novo bloco é criado com um ID único gerado via `Date.now()`.
- **Na Tela de Detalhes:** Insere uma nova tarefa padrão (`"Nova Revisão"`) no array da moto ativa, renderiza novamente a lista e ativa automaticamente o foco para digitação da descrição.

---

## Editar (Moto ou Tarefa)

- **Menu do Bloco:** No botão de três pontos do card da moto, ao selecionar "Editar", o cabeçalho `<h1>` da moto é substituído temporariamente por um campo de texto (`<input>`), permitindo alteração rápida.
- **Item do Checklist:** Ao clicar no ícone de lápis de uma tarefa, a descrição `<p>` é substituída por um `<input>`. Ao pressionar `Enter` ou perder o foco (`blur`), o novo texto é gravado no array e a interface é atualizada.

---

## Concluir tarefa

Ao clicar na caixa de seleção customizada de uma tarefa, o evento `onchange` do checkbox é disparado, alterando a propriedade `concluida` para `true` ou `false`. A renderização aplica dinamicamente o estilo riscado (`line-through`) e atualiza o contador.

---

## Excluir (Moto ou Tarefa)

- **Excluir Moto:** No menu flutuante de três pontos do bloco, ao clicar em "Excluir", a chave da moto é removida do objeto `dadosBlocos` e o elemento do card é removido do DOM.
- **Excluir Tarefa:** Ao clicar no ícone da lixeira ao lado de um item de checklist, o elemento é removido do array via `.splice()` e a lista é re-renderizada imediatamente.

---

# Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- GitHub Pages

---

# Dificuldades encontradas

Uma das principais dificuldades foi gerenciar a edição *inline* dos elementos de texto sem gerar múltiplos disparos acidentais de eventos. Ao trocar a tag `<p>` por um `<input>`, a ação de pressionar a tecla `Enter` finalizava a edição e disparava a re-renderização, o que removia o `<input>` do DOM e acionava involuntariamente o evento `onblur` (perda de foco). Isso foi resolvido criando uma variável de controle booleana (`salvou`) que impede a execução duplicada do salvamento.

Outra dificuldade foi implementar o comportamento duplo do botão flutuante de adição (`+`), fazendo com que ele identifique contextualmente se deve abrir a janela modal de criação de motos ou se deve inserir um novo item de checklist no bloco que está aberto. A solução foi verificar programaticamente a presença da classe CSS de transição de telas no contêiner principal da aplicação.

---

# Demonstração

**GitHub Pages**

https://andrevitor-dev.github.io/Checklist-Motobox/

---

# Considerações finais

Este projeto permitiu consolidar na prática os conceitos fundamentais do desenvolvimento web com JavaScript puro, incluindo a manipulação reativa do DOM, tratamento de eventos complexos, persistência de dados local com `localStorage`, criação de interfaces mobile-first com CSS moderno e utilização do Git/GitHub para versionamento e publicação da aplicação.
