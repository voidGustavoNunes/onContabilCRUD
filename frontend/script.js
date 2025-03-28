let clienteParaExcluir = null;
let clientesExistentes = [];

function mostrarNotificacao(mensagem, tipo = 'sucesso') {
  const notificacao = document.getElementById('notificacao');
  notificacao.textContent = mensagem;
  
  notificacao.classList.remove('bg-green-500', 'bg-red-500');
  notificacao.classList.add(tipo === 'sucesso' ? 'bg-green-500' : 'bg-red-500');
  
  notificacao.classList.remove('hidden');
  
  setTimeout(() => {
    notificacao.classList.add('hidden');
  }, 3000);
}

async function carregarClientes() {
  try {
    const resposta = await fetch('/clientes');
    clientesExistentes = await resposta.json();
    const corpoTabela = document.getElementById('corpoTabelaClientes');
    
    corpoTabela.innerHTML = '';
    clientesExistentes.forEach(cliente => {
      const linha = `
        <tr class="hover:bg-gray-50 transition duration-200">
          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${cliente.id}</td>
          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${cliente.nome}</td>
          <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${cliente.email}</td>
          <td class="px-4 py-3 whitespace-nowrap text-center">
            <button onclick="editarCliente(${cliente.id}, '${cliente.nome}', '${cliente.email}')" 
              class="text-blue-500 hover:text-blue-700 mr-2">
              Editar
            </button>
            <button onclick="confirmarExclusao(${cliente.id})" 
              class="text-red-500 hover:text-red-700">
              Excluir
            </button>
          </td>
        </tr>
      `;
      corpoTabela.innerHTML += linha;
    });

    mostrarNotificacao('Lista de clientes atualizada!');
  } catch (erro) {
    mostrarNotificacao('Erro ao carregar clientes', 'erro');
  }
}

function editarCliente(id, nome, email) {
  document.getElementById('clienteId').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;
  
  document.getElementById('formularioTitulo').textContent = 'Editar Cliente';
  document.getElementById('botaoSubmit').textContent = 'Atualizar Cliente';
  document.getElementById('botaoCancelar').classList.remove('hidden');
}

function cancelarEdicao() {
  document.getElementById('clienteId').value = '';
  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';
  
  document.getElementById('formularioTitulo').textContent = 'Adicionar Novo Cliente';
  document.getElementById('botaoSubmit').textContent = 'Adicionar Cliente';
  document.getElementById('botaoCancelar').classList.add('hidden');
}

function confirmarExclusao(id) {
  clienteParaExcluir = id;
  const modal = document.getElementById('modalExclusao');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

document.getElementById('botaoCancelarExclusao').addEventListener('click', () => {
  const modal = document.getElementById('modalExclusao');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  clienteParaExcluir = null;
});

document.getElementById('botaoConfirmarExclusao').addEventListener('click', async () => {
  try {
    const resposta = await fetch(`/clientes/${clienteParaExcluir}`, {
      method: 'DELETE'
    });

    if (resposta.ok) {
      mostrarNotificacao('Cliente excluído com sucesso!');
      carregarClientes();
    } else {
      const erro = await resposta.json();
      mostrarNotificacao(erro.error, 'erro');
    }

    const modal = document.getElementById('modalExclusao');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    clienteParaExcluir = null;
  } catch (erro) {
    mostrarNotificacao('Erro ao excluir cliente', 'erro');
  }
});

document.getElementById('formCliente').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('clienteId').value;
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  //verifica se o email ja existe
  const emailExistente = clientesExistentes.some(
    cliente => cliente.email.toLowerCase() === email.toLowerCase() && 
               (!id || parseInt(id) !== cliente.id)
  );

  if (emailExistente) {
    mostrarNotificacao('Email já cadastrado', 'erro');
    return;
  }

  try {
    let resposta;
    if (id) {
      //tualizaçao
      resposta = await fetch(`/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email })
      });
    } else {
      //adiçao
      resposta = await fetch('/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email })
      });
    }

    if (resposta.ok) {
      mostrarNotificacao(id ? 'Cliente atualizado com sucesso!' : 'Cliente adicionado com sucesso!');
      carregarClientes();
      cancelarEdicao();
    } else {
      const erro = await resposta.json();
      mostrarNotificacao(erro.error, 'erro');
    }
  } catch (erro) {
    mostrarNotificacao('Erro ao processar cliente', 'erro');
  }
});

//funcionalidade de importação de Excel
document.getElementById('arquivoExcel').addEventListener('change', function(e) {
  const arquivo = e.target.files[0];
  if (arquivo) {
    document.getElementById('nomeArquivo').textContent = arquivo.name;
    document.getElementById('botaoImportar').disabled = false;
  }
});

document.getElementById('botaoImportar').addEventListener('click', async () => {
  const arquivoInput = document.getElementById('arquivoExcel');
  const arquivo = arquivoInput.files[0];

  if (!arquivo) {
    mostrarNotificacao('Selecione um arquivo', 'erro');
    return;
  }

  const formData = new FormData();
  formData.append('arquivo', arquivo);

  try {
    const resposta = await fetch('/clientes/import', {
      method: 'POST',
      body: formData
    });

    const resultado = await resposta.json();

    if (resposta.status === 206) {
      //parcial
      mostrarNotificacao(`Importação parcial. ${resultado.importados.length} clientes importados, ${resultado.erros.length} com erros.`, 'erro');
      console.log('Erros de importação:', resultado.erros);
    } else if (resposta.ok) {
      mostrarNotificacao(`${resultado.clientes.length} clientes importados com sucesso!`);
    }

    //limpa o input de arquivo
    arquivoInput.value = '';
    document.getElementById('nomeArquivo').textContent = '';
    document.getElementById('botaoImportar').disabled = true;

    //atualiza a lista de clientes
    carregarClientes();
  } catch (erro) {
    mostrarNotificacao('Erro ao importar clientes', 'erro');
  }
});

// ao iniciar
carregarClientes();
