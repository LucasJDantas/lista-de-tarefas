const tituloDaLista = document.querySelector(".card__titulo__titulo-da-lista");
const btnEditarTituloDaLista = document.getElementById("editar-titulo");

const tituloRecuperado = localStorage.getItem('tituloDaSuaLista');

const btnAdicionarNovoItem = document.querySelector(".card__adicionar-item");
const divCampoDinamico = document.querySelector(".card__campo-dinamico");

const descricaoInput = document.querySelector(".card__input-novo-item");

const btnAdicionarItemALista = document.querySelector(".card__botao-adicionar");
const btnCancelar = document.querySelector(".card__botao-cancelar");

const listaRecuperada = localStorage.getItem('suaListaDeTarefas');

const ulItens = document.querySelector(".card__lista-de-itens");
const ulItensConcluidos = document.querySelector(".card__lista-de-itens-concluidos");
const mensagemDeListaVazia = document.querySelector(".card__lista-vazia");

const btnRemoverTarefasConcluidas = document.querySelector(".itens-concluidos__botao-remover-concluidas");
const btnRemoverTodasAsTarefas = document.querySelector(".itens-concluidos__botao-remover-todas");

let titulo = [];
let listaDeItens = [];
let contador = 1;

//Botão Editar título da lista --------------------------------------------------------------------------
function tituloNaLocalStorage() {
    localStorage.setItem('tituloDaSuaLista', JSON.stringify(titulo));
}

function renderizarTitulo() {
    const tituloFinal = titulo[titulo.length - 1];
    tituloDaLista.textContent = tituloFinal;
}

btnEditarTituloDaLista.addEventListener("click", () => {
    const novoTitulo = prompt("Qual o título da sua lista?");

    if(novoTitulo) {
        titulo.push(novoTitulo);
        renderizarTitulo();
        tituloNaLocalStorage();
    } else {
        return
    }
    
    renderizarTitulo()
})

if(tituloRecuperado) {
    titulo = JSON.parse(tituloRecuperado);
} else {
    titulo = [];
}

function checarSeTemTitulo() {    
    if (titulo.length === 0) {
        tituloDaLista.textContent = "Título da sua lista"
        console.log(`A lista está com o título padrão.`);
    } else {
        console.log(`A lista está com o título que você escolheu: "${titulo[titulo.length - 1]}".`);
    }
}

//Lista de itens ----------------------------------------------------------------------------------------
function atualizaLocalStorage() {
    localStorage.setItem('suaListaDeTarefas', JSON.stringify(listaDeItens));
}

if(listaRecuperada) {
    listaDeItens = JSON.parse(listaRecuperada);
    renderizarItens();
} else {
    listaDeItens = [];
}

function checarInputCheckbox() {
    const checarCheckbox = listaDeItens.some((elemento) => elemento.checar === false)
    if (checarCheckbox) {
        mensagemDeListaVazia.classList.add("hidden");
    } else {
        mensagemDeListaVazia.classList.remove("hidden");
    }
}

//Botão Adicionar Novo Item -----------------------------------------------------------------------------
btnAdicionarNovoItem.addEventListener("click", () => {    
    divCampoDinamico.classList.remove("hidden");
});


//Botão Adicionar Item à Lista --------------------------------------------------------------------------
btnAdicionarItemALista.addEventListener("click", () => {
    //Verificação de tamanho do item
    if (descricaoInput.value === "") {
        alert("O item da lista não pode ficar vazio!")
        return
    }
    if (descricaoInput.value.length <= 3) {
        alert("O item da lista tem que ser um pouquinho maior!")
        return
    }
    
    //Verificação de repetição do item -----------------------------------------------------------------
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === descricaoInput.value.toUpperCase());

    if (checarDuplicado) {
        alert("Item já está na lista!");
        return
    } else {
        listaDeItens.push({
            id: contador++,
            valor: descricaoInput.value,
            checar: false
        })
    }

    atualizaLocalStorage();
    renderizarItens();
    checarInputCheckbox();

    //Retorno ao estado normal --------------------------------------------------------------------------
    divCampoDinamico.classList.add("hidden");
    mensagemDeListaVazia.classList.add("hidden");
    //console.log(`O novo item da lista é: ${descricaoInput.value}`);
    descricaoInput.value = "";
});


//Botão Cancelar (do input) -----------------------------------------------------------------------------
btnCancelar.addEventListener("click", () => {
    descricaoInput.value = "";
    divCampoDinamico.classList.add("hidden");
})

//Renderizar os itens na tela ---------------------------------------------------------------------------
function renderizarItens() {
    ulItens.innerHTML = '';
    ulItensConcluidos.innerHTML = '';

    listaDeItens.forEach((elemento, index) => {
        if(elemento.checar) {
            ulItensConcluidos.innerHTML += `
            <li class="card__lista-de-itens-item-concluido" data-value="${index}">
                <div class="item__input-e-texto">
                    <input type="checkbox" class="card__item__checkbox" checked>
                    <p class="item__texto">${elemento.valor}</p>
                </div>
                <div class="item-botoes">
                    <button class="item-botoes__deletar" id="item-deletar"><img src="./assets/images/icon-delete.svg" class="botoes-editar-deletar" alt="botão de deletar"></button>                            
                </div>
            </li>
            `
        } else {
            ulItens.innerHTML += `
                <li class="card__lista-de-itens-item" data-value="${index}">
                    <div class="item__input-e-texto">
                        <input type="checkbox" class="card__item__checkbox">
                        <p class="item__texto">${elemento.valor}</p>
                    </div>
                    <div class="item-botoes">
                        <button class="item-botoes__editar" id="item-editar"><img src="./assets/images/icon-edit.svg" class="botoes-editar-deletar" alt="botão de edição"></button>
                        <button class="item-botoes__deletar" id="item-deletar"><img src="./assets/images/icon-delete.svg" class="botoes-editar-deletar" alt="botão de deletar"></button>                            
                    </div>
                </li>
            `
        }        
    })

    //Checkbox ------------------------------------------------------------------------------------------
    const inputsCheckbox = document.querySelectorAll(".card__item__checkbox");
    inputsCheckbox.forEach(i => {
        i.addEventListener("click", (evento) => {
            const valorDoDataValue = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens[valorDoDataValue].checar = evento.target.checked;

            renderizarItens();
            atualizaLocalStorage();
            checarInputCheckbox();
        })    
    })

    //Botão Deletar item --------------------------------------------------------------------------------
    const deletarItemDaLista = document.querySelectorAll("#item-deletar");
    deletarItemDaLista.forEach(i => {
        i.addEventListener("click", (evento) => {
            const valorDoDataValue = evento.target.parentElement.parentElement.parentElement.getAttribute('data-value');
            listaDeItens.splice(valorDoDataValue, 1);

            atualizaLocalStorage();
            renderizarItens();
            checarInputCheckbox();
        })
    })

    //Botão Editar item ---------------------------------------------------------------------------------
    const editarItemDaLista = document.querySelectorAll("#item-editar");

    editarItemDaLista.forEach(i => {
        i.addEventListener("click", (evento) => {
            const valorDoDataValue = evento.target.parentElement.parentElement.parentElement.getAttribute('data-value');
            
            const itemAlterado = prompt("O que você quer mudar?");            

            if (itemAlterado) {
                listaDeItens[valorDoDataValue].valor = itemAlterado;
                atualizaLocalStorage();
                renderizarItens();
                //console.log(`O novo valor do item é "${itemAlterado}".`);                
            } else {
                return
            }            
        })
    })
}

//Botão Remover itens concluídos ------------------------------------------------------------------------
btnRemoverTarefasConcluidas.addEventListener("click", () => {
    if(confirm("Todos os itens concluídos serão removidos. Tem certeza que quer fazer isso?")) {
        const tarefasConcluidas = listaDeItens.filter(elemento => elemento.checar === true);
        
        if(tarefasConcluidas.length >= 1) {
            listaDeItens.forEach((item, index) => {
                if(item.checar === true) {
                    listaDeItens.splice(index, tarefasConcluidas.length);
                    
                    atualizaLocalStorage();
                    renderizarItens();
                }
            })
        } else {
            alert("Você ainda não tem itens concluídos");        
            console.log("Não existe uma lista de itens concluídos");     
        }
    }
})

//Botão Remover todos os itens -------------------------------------------------------------------------
btnRemoverTodasAsTarefas.addEventListener("click", () => {
    if (confirm("Todos os itens da lista serão removidos. Tem certeza que quer fazer isso?")) {
        localStorage.removeItem('suaListaDeTarefas');
        listaDeItens = [];
        mensagemDeListaVazia.classList.remove("hidden");
        atualizaLocalStorage();
        renderizarItens();
    } else {
        return
    }
})

//Execuções gerais -------------------------------------------------------------------------------------
renderizarTitulo();
checarSeTemTitulo();
checarInputCheckbox();
