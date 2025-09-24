function validarFormulario() {
    const formulario = document.getElementById("formCurso");
    const validado = formulario.checkValidity();

    exibirTabelaCursos();
    
    if(!validado){
        formulario.classList.add("was-validated");
    } else {
        formulario.classList.remove("was-validated");
    }

    return validado;
}

function gravarCurso(evento) {
    evento.preventDefault();
    evento.stopPropagation();
    
    if (validarFormulario()) {
        // Coletar e validar os dados
        const nome = document.getElementById("nome").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const cargaHoraria = parseInt(document.getElementById("carga").value);
        const instrutor = document.getElementById("instrutor").value.trim();
        const vagas = parseInt(document.getElementById("vagas").value);
        const nivel = document.getElementById("nivel").value;
        const valor = parseFloat(document.getElementById("valor").value);

        const dadosCurso = {
            "id": 1, 
            "nome": nome,
            "descricao": descricao,
            "cargaHoraria": cargaHoraria,
            "instrutor": instrutor,
            "nivel": nivel,
            "vagas": vagas,
            "valor": valor
        };

        fetch("http://localhost:4000/curso", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCurso)
        })
        .then((resposta) => { 
            return resposta.json(); 
        })
        .then((dados) => {
            if(dados.status){
                formulario.reset();
                exibirTabelaCursos();
            }
            alert(dados.mensagem);
        })
        .catch((erro) => {
            alert("Erro ao cadastrar curso: " + erro.message);
        });
    }
}

function exibirTabelaCursos(){
    const espacoTabela = document.getElementById("tabela");
    if (!espacoTabela) return; 
    espacoTabela.innerHTML = "";

    fetch("http://localhost:4000/curso", { method: "GET" })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
            throw new Error("Erro ao carregar cursos");
        })
        .then((dados) => {
            
            if (dados.status && dados.cursos) {
                const tabela = document.createElement('table'); 
                tabela.className = 'table table-striped table-hover';

                const cabecalho = document.createElement('thead');
                cabecalho.innerHTML = `
                    <tr>
                        <th>NOME</th>
                        <th>Descrição</th>
                        <th>Carga Horária</th>
                        <th>Instrutor</th>
                        <th>Nível</th>
                        <th>Vagas</th>
                        <th>Valor</th>
                        <th>Ações</th>
                    </tr>
                `;
                tabela.appendChild(cabecalho);
                const corpoTabela = document.createElement('tbody');

                for (const curso of dados.cursos) { 
                    const linha = document.createElement('tr');
                    linha.innerHTML = `
                        <td>${curso.nome || ''}</td>
                        <td>${curso.descricao || ''}</td>
                        <td>${curso.cargaHoraria || ''}</td>
                        <td>${curso.instrutor || ''}</td>
                        <td>${curso.nivel || ''}</td>
                        <td>${curso.vagas || ''}</td>
                        <td>${curso.valor || ''}</td>
                        <td>
                            <button type="button" class="btn btn-danger" onclick="excluirCurso('${curso.id}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg></button>

                            <button type="button" class="btn btn-warning" onclick="editarCurso(${curso.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg></button>
                        </td>
                    `;
                    corpoTabela.appendChild(linha);
                }
                tabela.appendChild(corpoTabela);
                espacoTabela.appendChild(tabela);
            } else {
                espacoTabela.innerHTML = "<p>Nenhum curso cadastrado.</p>";
            }
        })
        .catch((erro) => {
            console.error("Erro ao carregar cursos:", erro);
            espacoTabela.innerHTML = "<p>Erro ao carregar cursos.</p>";
        });
}

function excluirCurso(id){
    if(confirm("Deseja realmente excluir esse curso?" + id)){
        fetch("http://localhost:4000/curso/" + id, { method: "DELETE" })
        .then((resposta) => {
            if(resposta.ok){
                return resposta.json();
            }
        })
        .then((dados) => {
            if(dados.status){
                exibirTabelaCursos();
            }
            alert(dados.mensagem);
        })
        .catch((erro) => {
            alert("Não foi possível excluir o curso" + erro.message);
        })
    }
}

function editarCurso(id) {
    fetch(`http://localhost:4000/curso/${id}`, { method: "GET" })
        .then((resposta) => {
            if (resposta.ok) {
                return resposta.json();
            }
            throw new Error("Erro ao carregar curso para edição");
        })
        .then((dados) => {
            if (dados.status && dados.curso) {
                const curso = dados.curso;

                document.getElementById("nome").value = curso.nome || '';
                document.getElementById("descricao").value = curso.descricao || '';
                document.getElementById("carga").value = curso.cargaHoraria || '';
                document.getElementById("instrutor").value = curso.instrutor || '';
                document.getElementById("vagas").value = curso.vagas || '';
                document.getElementById("nivel").value = curso.nivel || '';
                document.getElementById("valor").value = curso.valor || '';
                
                const formulario = document.getElementById("formCurso");
                formulario.onsubmit = function(evento) {
                    atualizarCurso(evento, id);
                };
                
                document.getElementById("btnCadastrar").textContent = "Atualizar Curso";
                
            }
        })
        .catch((erro) => {
            alert("Erro ao carregar curso para edição: " + erro.message);
        });
}

function atualizarCurso(evento, id) {
    evento.preventDefault();
    evento.stopPropagation();
    
    if (validarFormulario()) {
        const nome = document.getElementById("nome").value.trim();
        const descricao = document.getElementById("descricao").value.trim();
        const cargaHoraria = parseInt(document.getElementById("carga").value);
        const instrutor = document.getElementById("instrutor").value.trim();
        const vagas = parseInt(document.getElementById("vagas").value);
        const nivel = document.getElementById("nivel").value;
        const valor = parseFloat(document.getElementById("valor").value);

        const dadosCurso = {
            "id": id,
            "nome": nome,
            "descricao": descricao,
            "cargaHoraria": cargaHoraria,
            "instrutor": instrutor,
            "nivel": nivel,
            "vagas": vagas,
            "valor": valor
        };

        fetch(`http://localhost:4000/curso/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosCurso)
        })
        .then((resposta) => { 
            return resposta.json(); 
        })
        .then((dados) => {
            if(dados.status){
                const formulario = document.getElementById("formCurso");
                formulario.reset();
                formulario.onsubmit = gravarCurso;
                document.getElementById("btnCadastrar").textContent = "Cadastrar";
                exibirTabelaCursos();
            }
            alert(dados.mensagem);
        })
        .catch((erro) => {
            alert("Erro ao atualizar curso: " + erro.message);
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formCurso");
    if (formulario) {
        formulario.onsubmit = gravarCurso;
    }
    exibirTabelaCursos();

});