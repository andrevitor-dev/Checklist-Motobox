var wrapper = document.querySelector(".painel-oficina");
var backBtn = document.querySelector(".botao-seta-voltar");
var menuBtn = document.querySelector(".botao-menu-oficina");
var addBtn = document.querySelector(".botao-adicionar-checklist");

var categoriasContainer = document.querySelector(".grade-motos");
var tarefasContainer = document.querySelector(".lista-itens-revisao");

var categoriaImg = document.getElementById("categoria-img");
var categoriaMecanico = document.getElementById("categoria-mecanico");
var categoriaTitulo = document.getElementById("categoria-titulo");
var categoriaQtd = document.getElementById("categoria-qtd");

/*Estrutura de dados global.*/
var dadosBlocos = {};
var blocoAtualAberto = null;
var blocoEmEdicao = null; // Guarda a referência do bloco que está sendo editado no modal

/*Janelas*/
var janelaNovoBloco = document.getElementById("janela-novo-bloco");
var inputNomeBloco = document.getElementById("input-nome-bloco");
var inputMecanicoBloco = document.getElementById("input-mecanico-bloco");
var btnCancelarBloco = document.getElementById("btn-cancelar-bloco");
var btnConfirmarBloco = document.getElementById("btn-confirmar-bloco");

/* Janela de Edição */
var janelaEditarBloco = document.getElementById("janela-editar-bloco");
var inputEditarNomeBloco = document.getElementById("input-editar-nome-bloco");
var inputEditarMecanicoBloco = document.getElementById("input-editar-mecanico-bloco");
var btnCancelarEditarBloco = document.getElementById("btn-cancelar-editar-bloco");
var btnConfirmarEditarBloco = document.getElementById("btn-confirmar-editar-bloco");

var janelaConfiguracoes = document.getElementById("alterar-configurações");
var btnFecharConfig = document.getElementById("btn-fechar-config");
var radiosFonte = document.querySelectorAll('input[name="estilo-fonte"]');

/*Navegação e janela de configuração.*/
backBtn.onclick = () => {
    wrapper.classList.remove("exibir-detalhes-moto");
    blocoAtualAberto = null;
};

menuBtn.onclick = (e) => {
    e.stopPropagation();
    janelaConfiguracoes.classList.add("janela-oficina-ativa");
};

btnFecharConfig.onclick = () => janelaConfiguracoes.classList.remove("janela-oficina-ativa");

/*Troca de peso de fontes*/
radiosFonte.forEach(radio => {
    radio.onchange = (e) => {
        var valor = e.target.value;
        wrapper.classList.remove("tipografia-oficina-padrao", "tipografia-oficina-negrito");
        
        if (valor === "arial-normal") {
            wrapper.classList.add("tipografia-oficina-padrao");
        } else if (valor === "arial-negrito") {
            wrapper.classList.add("tipografia-oficina-negrito");
        }
    };
});

/* Função de atualização e renderização*/
function atualizarContadorTarefas() {
    if (!blocoAtualAberto) return;

    var id = blocoAtualAberto.getAttribute("data-id");
    var total = dadosBlocos[id] ? dadosBlocos[id].length : 0;
    var texto = total === 1 ? "1 revisão" : total + " revisões";

    categoriaQtd.textContent = texto;

    var textoDoBloco = blocoAtualAberto.querySelector(".contador-revisoes-pendentes");
    if (textoDoBloco) textoDoBloco.textContent = texto;
}

/*Funçaõ de ação de criação da tela secundária do jeito que ela deve ficar.*/
function renderizarTarefasDoBloco(idBloco) {
    tarefasContainer.innerHTML = "";
    var tarefas = dadosBlocos[idBloco] || [];

    tarefas.forEach((tarefa, index) => {
        var novaDiv = document.createElement("div");
        novaDiv.className = "item-checklist";
        novaDiv.innerHTML = `
            <label style="display: flex; align-items: center; cursor: pointer;">
                <input type="checkbox" ${tarefa.concluida ? "checked" : ""}>
                <span class="caixa-selecao-revisao">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </span>
            </label>
            <p class="descricao-item-revisao" style="${tarefa.concluida ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${tarefa.texto}</p>
            <div class="acoes-item-revisao">
                <div class="botao-editar-item" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                </div>
                <div class="botao-excluir-item" title="Excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </div>
            </div>`;

        tarefasContainer.appendChild(novaDiv);
        configurarTarefa(novaDiv, index, idBloco);
    });

    atualizarContadorTarefas();
}

/* Função rsponsável pelas ações dos botões das categorias dos blocos*/
function configurarBloco(bloco) {
    var toggleBtn = bloco.querySelector(".botao-tres-pontos");
    var menuDiv = bloco.querySelector(".menu-pontos-flutuante");
    var btnEditar = bloco.querySelector(".acao-editar-moto");
    var btnExcluir = bloco.querySelector(".acao-excluir-moto");

    if (toggleBtn) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            menuDiv.classList.toggle("menu-flutuante-ativo");
        };
    }

    if (btnEditar) {
        btnEditar.onclick = (e) => {
            e.stopPropagation();
            menuDiv.classList.remove("menu-flutuante-ativo");

            blocoEmEdicao = bloco;
            var h1 = bloco.querySelector("h1");
            var pMecanico = bloco.querySelector(".nome-mecanico-bloco");

            /*Preenche a area de edição com os textos atuais*/
            inputEditarNomeBloco.value = h1 ? h1.textContent : "";
            inputEditarMecanicoBloco.value = pMecanico ? pMecanico.textContent.replace(/^Mecânico:\s*/, "") : "";

            /* Abre a area de edição estilizada do app*/
            janelaEditarBloco.classList.add("janela-oficina-ativa");
            inputEditarNomeBloco.focus();
        };
    }

    if (btnExcluir) {
        btnExcluir.onclick = (e) => {
            e.stopPropagation();
            var id = bloco.getAttribute("data-id");
            delete dadosBlocos[id];
            bloco.remove();
        };
    }

    bloco.onclick = () => {
        blocoAtualAberto = bloco;
        var id = bloco.getAttribute("data-id");

        categoriaTitulo.textContent = bloco.querySelector("h1").textContent;

        var elemMecanico = bloco.querySelector(".nome-mecanico-bloco");
        if (elemMecanico && categoriaMecanico) {
            categoriaMecanico.textContent = elemMecanico.textContent;
        }

        var imgElemento = bloco.querySelector("img");
        if (imgElemento && categoriaImg.tagName === "img") {
            categoriaImg.src = imgElemento.src;
        }

        renderizarTarefasDoBloco(id);
        wrapper.classList.add("exibir-detalhes-moto");
    };
}

/* Modal de Edição de Bloco */
btnCancelarEditarBloco.onclick = () => {
    janelaEditarBloco.classList.remove("janela-oficina-ativa");
    blocoEmEdicao = null;
};

btnConfirmarEditarBloco.onclick = () => {
    if (!blocoEmEdicao) return;

    var novoNome = inputEditarNomeBloco.value.trim() || "Novo Bloco";
    var novoMecanico = inputEditarMecanicoBloco.value.trim() || "Mecânico não informado";

    var h1 = blocoEmEdicao.querySelector("h1");
    var pMecanico = blocoEmEdicao.querySelector(".nome-mecanico-bloco");

    if (h1) h1.textContent = novoNome;
    
    var textoMecanico = "Mecânico: " + novoMecanico;
    if (pMecanico) {
        pMecanico.textContent = textoMecanico;
    } else {

        /*Se não existia a tag do mecânico, ela é inserida*/
        var divDados = blocoEmEdicao.querySelector(".dados-revisoes-moto");
        var novoP = document.createElement("p");
        novoP.className = "nome-mecanico-bloco";
        novoP.textContent = textoMecanico;
        divDados.insertBefore(novoP, divDados.querySelector(".contador-revisoes-pendentes"));
    }

    /* Se estiver no checklist aberto, atualiza também o cabeçalho*/
    if (blocoAtualAberto === blocoEmEdicao) {
        if (categoriaTitulo) categoriaTitulo.textContent = novoNome;
        if (categoriaMecanico) categoriaMecanico.textContent = textoMecanico;
    }

    janelaEditarBloco.classList.remove("janela-oficina-ativa");
    blocoEmEdicao = null;
};

/*Lógica da criação de tarefas*/
function ativarEdicaoTarefa(item, index, idBloco) {
    var texto = item.querySelector(".descricao-item-revisao");
    if (!texto) return;

    var input = document.createElement("input");
    input.type = "text";
    input.value = dadosBlocos[idBloco][index].texto;
    input.className = "campo-edicao-rapida-moto";

    texto.replaceWith(input);
    input.focus();

    var salvou = false;
    var salvar = () => {
        if (salvou) return;
        salvou = true;
        dadosBlocos[idBloco][index].texto = input.value.trim() || "Nova Revisão";
        renderizarTarefasDoBloco(idBloco);
    };

    input.onblur = salvar;
    input.onkeydown = (e) => {
        if (e.key === "Enter") {
            salvar();
        }
    };
}

/*Dá a vida aos botões do check box da lixeira e de editar, criar novo bloco e criação de tarefas.*/
function configurarTarefa(item, index, idBloco) {
    var checkbox = item.querySelector("input[type='checkbox']");
    var btnEditar = item.querySelector(".botao-editar-item");
    var btnExcluir = item.querySelector(".botao-excluir-item");

    if (checkbox) {
        checkbox.onchange = () => {
            dadosBlocos[idBloco][index].concluida = checkbox.checked;
            renderizarTarefasDoBloco(idBloco);
        };
    }

    if (btnEditar) {
        btnEditar.onclick = (e) => {
            e.stopPropagation();
            ativarEdicaoTarefa(item, index, idBloco);
        };
    }

    if (btnExcluir) {
        btnExcluir.onclick = (e) => {
            e.stopPropagation();
            dadosBlocos[idBloco].splice(index, 1);
            renderizarTarefasDoBloco(idBloco);
        };
    }
}

/* Inicialização dos elementos do HTML*/
document.querySelectorAll(".bloco-moto").forEach(bloco => {
    var id = bloco.getAttribute("data-id");
    dadosBlocos[id] = [{ texto: "Trocar óleo", concluida: false }];
    configurarBloco(bloco);
});

document.addEventListener("click", () => {
    document.querySelectorAll(".menu-pontos-flutuante").forEach(m => {
        m.classList.remove("menu-flutuante-ativo");
    });
});

/*Botão flutuante adicionar (+)*/
addBtn.onclick = () => {
    if (!wrapper.classList.contains("exibir-detalhes-moto")) {

        /*Criar Novo Bloco*/
        inputNomeBloco.value = "";
        if (inputMecanicoBloco) inputMecanicoBloco.value = "";
        janelaNovoBloco.classList.add("janela-oficina-ativa");
        inputNomeBloco.focus();
    } else {

        /*Cria Nova Tarefa no Bloco Aberto*/
        if (!blocoAtualAberto) return;

        var idBloco = blocoAtualAberto.getAttribute("data-id");
        if (!dadosBlocos[idBloco]) dadosBlocos[idBloco] = [];

        var novoIndice = dadosBlocos[idBloco].length;
        dadosBlocos[idBloco].push({ texto: "Nova Revisão", concluida: false });
        
        renderizarTarefasDoBloco(idBloco);

        /*Abre o campo de texto para digitar na tarefa recém criada*/
        var ultimosItens = tarefasContainer.querySelectorAll(".item-checklist");
        var ultimoItem = ultimosItens[ultimosItens.length - 1];
        if (ultimoItem) {
            ativarEdicaoTarefa(ultimoItem, novoIndice, idBloco);
        }
    }
};

/*Janela de criar novo bloco*/
btnCancelarBloco.onclick = () => janelaNovoBloco.classList.remove("janela-oficina-ativa");

btnConfirmarBloco.onclick = () => {
    var nomeMoto = inputNomeBloco.value.trim() || "Novo Bloco";
    var nomeMecanico = inputMecanicoBloco ? (inputMecanicoBloco.value.trim() || "") : "";

    var idUnico = "bloco-" + Date.now();
    dadosBlocos[idUnico] = [];

    var novoBloco = document.createElement("div");
    novoBloco.className = "bloco-moto";
    novoBloco.setAttribute("data-id", idUnico);
    novoBloco.innerHTML = `
        <div class="icone-moto-lateral">
            <img src="img/motorbike.png" alt="">
            <div class="dados-revisoes-moto">
                <h1>${nomeMoto}</h1>
                <p class="nome-mecanico-bloco">Mecânico: ${nomeMecanico}</p>
                <p class="contador-revisoes-pendentes">0 revisões</p>
            </div>
        </div>
        <div class="opcoes-gerenciamento-moto">
            <div class="botao-tres-pontos">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000c22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ellipsis-vertical-icon lucide-ellipsis-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </div>
            <div class="menu-pontos-flutuante">
                <button class="acao-editar-moto">Editar</button>
                <button class="acao-excluir-moto">Excluir</button>
            </div>
        </div>`;

    categoriasContainer.appendChild(novoBloco);
    configurarBloco(novoBloco);

    inputNomeBloco.value = "";
    if (inputMecanicoBloco) inputMecanicoBloco.value = "";

    janelaNovoBloco.classList.remove("janela-oficina-ativa");
}