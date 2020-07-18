function main() {

    const inptNomeAluno = document.querySelector(".nomeAluno");
    const inptNotas = document.querySelectorAll(".notas");
    const btnEnviar = document.querySelector(".btnEnviar");
    const btnRemoveAluno = document.querySelector(".btnRemoveAluno");
    const tabela = document.querySelector(".tabela");
    const inptRemoveNome = document.querySelector(".nomeAlunoRemove")

    function criaTabela(name) {
        const tr = document.createElement('tr');
        tr.setAttribute('class', `trClone${name} trStyle`);
        return tr
    }

    function criaTitulo() {
        const th = document.createElement('th');
        return th
    }

    function criaCelula() {
        const td = document.createElement('td');
        return td
    }

    function recebeNome() {
        const nome = inptNomeAluno.value;
        return nome
    }

    let arrNotas = [];

    function recebeNotas() {
        for (i = 0; i < inptNotas.length; i++) {
            arrNotas.push(inptNotas[i].value);
        }

        if (arrNotas.length > 4) {
            arrNotas.splice(0, 4)
        }

        return arrNotas
    }

    function limpaInputs(){
        inptNomeAluno.value = "";
        inptRemoveNome.value = "";
        for(i = 0; i < inptNotas.length ; i++){
            inptNotas[i].value = "";
        }
    }

    let arrNomes = [];

    function criaNomeAluno(nome) {
        const tr = criaTabela(nome);
        const th = criaTitulo();
        th.setAttribute('id', nome.toLowerCase());
        th.setAttribute('class', 'alunos')
        th.innerText = nome;
        tr.appendChild(th)
        tabela.appendChild(tr)
        arrNomes.push(nome)
    }

    function criaNotas(nome) {
        const tr = document.querySelector(`.trClone${nome}`);

        for (i = 0; i < 4; i++) {
            const celula = criaCelula();
            celula.setAttribute("class", `notas${i}bi notasb`);

            if (inptNotas[i].value !== "") {
                celula.innerText = `${Number(inptNotas[i].value)} PT`;
            } else {
                celula.innerText = `0 PT`;
            }

            tr.appendChild(celula);
        }
    }

    function previneNotaVazia() {
        for (i = 0; i < inptNotas.length; i++) {
            if (!inptNotas[i].value) {
                const conf = confirm(`Nenhum valor de prova foi atribuído à nota do ${i+1}º bimestre e será atribuida a nota zero.`)
                if (!conf) {
                    try {
                        return btnEnviar.preventDefault();
                    } catch (err) {
                        throw (' Nenhum valor atribuído às notas.')
                    }
                }
            }
        }
    }

    function previneNomeRepetido(nome) {
        for (i = 0; i < arrNomes.length; i++) {
            if (nome === arrNomes[i]) {
                alert('Nome já usado.')
                try {
                    btnEnviar.preventDefault();
                } catch (err) {
                    throw (' Nome repetido.')
                }
            }
        }
    }

    function removeAluno(nome) {
        const aluno = document.getElementById(nome.toLowerCase());

        if (!aluno) {
            return alert('Nome inexistente.');
        }

        aluno.parentElement.remove()
    }

    function nomeVazio(nome) {
        if (!nome) {
            alert('Você não digitou um nome.')
            return btnEnviar.preventDefault();
        }
    }

    function salvarNome() {
        const aluno = document.querySelectorAll(".trStyle");
        const listaAlunos = [];

        for (i = 0; i < aluno.length; i++) {
            let nome = aluno[i].firstChild.innerText;
            listaAlunos.push(nome)
        }

        const alunosJSON = JSON.stringify(listaAlunos);
        localStorage.setItem('Alunos', alunosJSON)
    }

    function salvarNotas() {
        const notas = document.querySelectorAll(".notasb");
        const listaNotas = [];

        for (i = 0; i < notas.length; i++) {
            listaNotas.push(notas[i].innerText);
        }

        const notasJSON = JSON.stringify(listaNotas);
        localStorage.setItem('Notas', notasJSON);
    }

    function carregaDadosAlunos() {
        const alunos = localStorage.getItem('Alunos');
        const listaAlunos = JSON.parse(alunos);
        try {
            for (aluno of listaAlunos) {
                criaNomeAluno(aluno)
                criaNotas(aluno)
            }
        } catch (err) {
            throw ('Lista de alunos vazia')
        }
    }

    function carregaDadosNotas() {
        const notas = localStorage.getItem('Notas');
        const listaNotas = JSON.parse(notas);
        const celulas = document.querySelectorAll(".notasb");

        for (i = 0; i < celulas.length; i++) {
            celulas[i].textContent = " ";
            celulas[i].textContent = listaNotas[i];
        }
    }

    function criarTabelaDeAlunos() {
        const nome = recebeNome();
        nomeVazio(nome);
        previneNomeRepetido(nome);
        recebeNotas();
        criaNomeAluno(nome);
        criaNotas(nome)
        salvarNome();
        salvarNotas();
    }

    function removeAlunosMaster() {
        removeAluno(inptRemoveNome.value);
        salvarNome();
        salvarNotas();
    }

    function eNan() {
        for (i = 0; i < inptNotas.length; i++) {
            if (isNaN(inptNotas[i].value) === true) {
                return true
            }
        }
    }

    btnEnviar.addEventListener("click", function (e) {
        eNan();

        if (eNan === true) {
            return e.preventDefault();
        }

        criarTabelaDeAlunos();
        previneNotaVazia(e);
        limpaInputs();
    })

    btnRemoveAluno.addEventListener("click", function () {
        removeAlunosMaster();
        limpaInputs();
    })

    inptNotas[3].addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            for (i = 0; i < inptNotas.length; i++) {
                if (!inptNotas[i].value) return previneNotaVazia();
            }

            eNan();

            if (eNan === true) {
                return e.preventDefault();
            }

            criarTabelaDeAlunos();
            limpaInputs();
        }
    })

    inptRemoveNome.addEventListener("keypress", function (e) {
        if (e.keyCode === 13) {
            if (!inptRemoveNome) return;
            removeAlunosMaster();
            limpaInputs();
        }
    })

    carregaDadosAlunos();
    carregaDadosNotas();
}
main()