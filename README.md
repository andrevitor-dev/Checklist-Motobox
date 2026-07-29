# Checklist - Manutenção de Motos (Motobox)

### Aluno
- **Nome:** André Vitor da Silva Oliveira Calixto
- **Disciplina:** Linguagem de Script
- **Tema:** Checklist de manutenção de motos (oficina mecânica)

---

## Descrição do projeto

Este projeto consiste em uma aplicação web desenvolvida com **HTML5, CSS3 e JavaScript puro** voltada para o gerenciamento de revisões, checklists e manutenções preventivas/corretivas de motocicletas em uma oficina mecânica.

A aplicação permite organizar as motocicletas registradas na oficina em blocos visuais (cards), possibilitando cadastrar novos veículos, associar o nome do mecânico responsável, editar informações diretamente na interface, criar e marcar itens de revisão como concluídos, excluir tarefas ou veículos e ajustar preferências de tipografia globalmente.

O objetivo principal do projeto é consolidar e aplicar conceitos fundamentais de manipulação dinâmica do DOM, gerenciamento de eventos, layout responsivo *mobile-first* com simulação de mockup e persistência/sincronização em memória e estado da interface utilizando tecnologias fundamentais da Web.

---

## Funcionalidades

- **Gerenciamento de Garagem (Blocos/Cards):** Organização e exibição das motocicletas registradas na oficina em cartões interativos contendo título da moto, nome do mecânico e quantidade de revisões pendentes.
- **Adição de Novas Motos:** Janela modal sobreposta (*overlay*) integrada para cadastrar novos veículos e associar o mecânico responsável.
- **Edição de Blocos/Motos:** Modal de edição dinâmica para alterar o nome da motocicleta e o mecânico encarregado a qualquer momento.
- **Navegação e Transição Fluida:** Alternância visual suave entre a Garagem (visão geral das motos) e a Tela de Detalhes da Revisão da moto selecionada via translações CSS.
- **Gestão Completa de Checklist de Manutenção:**
  - **Adição de novas tarefas:** Criação de itens de checklist para acompanhamento dos serviços (ex.: troca de óleo, regulagem de correntes, checagem de freios).
  - **Edição Inline Direta:** Alteração rápida do texto da tarefa em tempo real convertendo o elemento em um campo de entrada (`<input>`).
  - **Marcação de Conclusão:** Checkbox customizado com destaque visual imediato (fundo verde e texto riscado/opacity reduzida).
  - **Exclusão de Tarefas e Blocos:** Remoção individual de itens do checklist via ícone de lixeira ou exclusão completa do cartão da motocicleta pelo menu suspenso.
- **Contador Dinâmico:** Atualização em tempo real da quantidade total de revisões cadastradas no cabeçalho da moto e no cartão da garagem.
- **Ajuste de Tipografia:** Modal de configurações para alternar o peso da fonte (*Inter Normal* vs. *Inter Negrito*) em toda a aplicação.

---

## Estrutura do projeto

```text
motobox-checklist/

│── index.html
│── style.css
│── script.js
└── img/
    ├── boy.png
    ├── mechanic.png
    ├── motobox logo.png
    └── motorbike.png
```

### index.html
Responsável pela estrutura semântica da aplicação, contendo as duas telas principais de navegação e as janelas modais sobrepostas (*overlays*):
- **Tela Principal (`.tela-garagem`):** Contém o cabeçalho com a logo da Motobox, foto de perfil, ícone do menu de configurações e a grade de motos cadastradas (`.grade-motos`).
- **Tela de Detalhes (`.tela-detalhes-revisao`):** Apresenta o botão de retorno, o cabeçalho da moto selecionada (com nome, mecânico e contador) e a lista de tarefas de checklist (`.lista-itens-revisao`).
- **Janelas Modais (*Overlays*):** Diálogos para criação de novos blocos (`#janela-novo-bloco`), edição de blocos existentes (`#janela-editar-bloco`) e alteração do estilo da fonte da interface (`#alterar-configurações`).

### style.css
Responsável pela identidade visual, estilização moderna e comportamento responsivo do sistema:
- **Design e Layout Mockup:** Estilização centralizada simulando uma interface de aplicativo *mobile* em telas maiores (largura máxima fixada com bordas arredondadas e moldura escura).
- **Paleta de Cores Temática:** Destaques marcantes em laranja vibrante (`#eb5e28`), escuro metálico (`#001336` e `#000c22`) e detalhes em verde (`#359e61`) para tarefas concluídas.
- **Transições e Efeitos de Tela:** Efeitos suaves de deslocamento entre a garagem e a tela de detalhes através da classe `.exibir-detalhes-moto` aplicada ao contêiner pai.
- **Componentes Customizados:** Checkboxes estilizados com SVG, menu suspenso flutuante de três pontos, botões com efeito *hover*, modais com fundo escurecido e desfocado (`backdrop-filter: blur(3px)`).

### script.js
Responsável pela inteligência, reatividade e manipulação dinâmica do DOM da aplicação:
- **Alternância de Telas:** Controla a exibição da tela de detalhes ou retorno para a garagem ajustando classes no elemento `.painel-oficina`.
- **Criação e Gestão de Blocos:** Gera IDs únicos via `Date.now()`, insere novos elementos HTML na grade e atualiza a estrutura de dados global.
- **Renderização do Checklist (`renderizarTarefasDoBloco`):** Limpa e reconstrói dinamicamente os itens de checklist da moto selecionada.
- **Edição Inline (`ativarEdicaoTarefa`):** Transforma dinamicamente tags `<p>` em elementos `<input type="text">` e salva as alterações ao pressionar Enter ou perder o foco (`blur`).
- **Atualização de Contadores (`atualizarContadorTarefas`):** Recalcula e exibe a quantidade exata de revisões em tempo real.
- **Personalização de Tipografia:** Gerencia a troca de classes no wrapper pai para alterar o peso da fonte Inter (*Normal* ou *Negrito*).

---

## Como a aplicação funciona

Os dados das motos e suas respectivas tarefas são organizados em memória por meio do objeto JavaScript global `dadosBlocos`.

Nesse objeto, cada chave representa o identificador único do bloco/moto (`data-id`), e o valor associado é um *array* de objetos contendo as tarefas de revisão (com seus textos descritivos e estados de conclusão):

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

Ao clicar em qualquer cartão de motocicleta na tela principal, o evento onclick captura o atributo data-id do bloco. A aplicação extrai as informações de título, mecânico e imagem, preenche o cabeçalho da tela de detalhes, invoca a função renderizarTarefasDoBloco(id) e aplica a classe .exibir-detalhes-moto ao painel principal para acionar a transição de tela.

---

## Adicionar (Bloco ou Tarefa)

O botão flutuante com ícone de soma (.botao-adicionar-checklist) identifica contextualmente em qual tela o usuário está através da presença da classe .exibir-detalhes-moto:

Na Garagem: Abre a janela modal #janela-novo-bloco para digitação do nome da moto e do mecânico. Ao confirmar, gera um novo ID único (bloco-Date.now()), inicializa o array de tarefas vazio e cria o novo cartão no DOM.

Na Tela de Detalhes: Adiciona diretamente um novo objeto { texto: "Nova Revisão", concluida: false } no array da moto ativa, re-renderiza a lista e ativa automaticamente o foco para digitação da descrição da nova tarefa.
---

## Editar (Moto ou Tarefa)

Editar Bloco/Moto: Ao clicar no botão "Editar" dentro do menu de três pontos do cartão, a modal #janela-editar-bloco é exibida com os campos preenchidos com os valores atuais. Ao salvar, os textos do h1 e do mecânico são atualizados no cartão e no cabeçalho ativo.

Editar Item do Checklist: Ao clicar no ícone de lápis de uma tarefa, a função ativarEdicaoTarefa substitui temporariamente o elemento <p> por um <input>. Ao pressionar a tecla Enter ou perder o foco (onblur), o texto atualizado é gravado no array dadosBlocos e a lista é re-renderizada.

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

Este projeto permitiu consolidar na prática os conceitos fundamentais do desenvolvimento web com JavaScript puro, incluindo a manipulação reativa do DOM, tratamento de eventos complexos, criação de interfaces mobile-first com CSS moderno e utilização do Git/GitHub para versionamento e publicação da aplicação.