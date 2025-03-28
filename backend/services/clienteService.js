const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

class ClienteService {
  constructor() {
    this.clientes = [];
    this.nextId = 1;
  }

  listarTodos() {
    return this.clientes;
  }

  buscarPorId(id) {
    return this.clientes.find((cliente) => cliente.id === parseInt(id));
  }

  adicionarCliente(dadosCliente) {
    if (!dadosCliente.nome || !dadosCliente.email) {
      throw new Error("Nome e email são obrigatórios");
    }

    const novoCliente = {
      id: this.nextId++,
      nome: dadosCliente.nome,
      email: dadosCliente.email,
    };

    this.clientes.push(novoCliente);
    return novoCliente;
  }

  atualizarCliente(id, dadosAtualizados) {
    const index = this.clientes.findIndex(
      (cliente) => cliente.id === parseInt(id)
    );

    if (index === -1) return null;

    this.clientes[index] = {
      ...this.clientes[index],
      ...dadosAtualizados,
    };

    return this.clientes[index];
  }

  removerCliente(id) {
    const index = this.clientes.findIndex(
      (cliente) => cliente.id === parseInt(id)
    );

    if (index === -1) return false;

    this.clientes.splice(index, 1);
    return true;
  }

  validarClienteImportacao(cliente) {
    // validacoes para importacao
    if (!cliente.nome || !cliente.email) {
      throw new Error("Dados incompletos: nome e email são obrigatórios");
    }

    // validacao de email (regex simples)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      throw new Error(`Email inválido: ${cliente.email}`);
    }

    return true;
  }

  importarClientes(arquivo) {
    try {
      //se o arquivo existe
      if (!arquivo || !arquivo.path) {
        throw new Error("Nenhum arquivo enviado");
      }

      //extensão do arquivo
      const extensao = path.extname(arquivo.originalname).toLowerCase();
      const extensoesPermitidas = [".xlsx", ".xls"];

      if (!extensoesPermitidas.includes(extensao)) {
        throw new Error(
          "Formato de arquivo inválido. Use Excel (.xlsx ou .xls)"
        );
      }

      // Le arquivo
      const workbook = xlsx.readFile(arquivo.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      //converte para JSON
      const dados = xlsx.utils.sheet_to_json(worksheet);

      // valida e importa clientes
      const clientesImportados = [];
      const erros = [];

      dados.forEach((item, index) => {
        try {
          this.validarClienteImportacao(item);

          const novoCliente = {
            id: this.nextId++,
            nome: item.nome,
            email: item.email,
          };

          this.clientes.push(novoCliente);
          clientesImportados.push(novoCliente);
        } catch (error) {
          erros.push({
            linha: index + 2, // +2 porque a primeira linha e o cabeçalho
            erro: error.message,
          });
        }
      });

      //remove arquivo temporário
      fs.unlinkSync(arquivo.path);

      return {
        importados: clientesImportados,
        erros: erros,
      };
    } catch (error) {
      throw new Error(`Erro na importação: ${error.message}`);
    }
  }
}

module.exports = new ClienteService();
