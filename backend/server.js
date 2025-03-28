const express = require("express");
const multer = require("multer");
const path = require("path");
const clienteService = require("./services/clienteService");
const log = require("./middlewares/log");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(log);
app.use(express.static(path.join(__dirname, "../frontend")));

//rotas
app.get("/clientes", (req, res) => {
  try {
    const clientes = clienteService.listarTodos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

app.post("/clientes", (req, res) => {
  try {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ error: "Nome e email são obrigatórios" });
    }

    const novoCliente = clienteService.adicionarCliente({ nome, email });
    res.status(201).json(novoCliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar cliente" });
  }
});

app.get("/clientes/:id", (req, res) => {
  try {
    const cliente = clienteService.buscarPorId(req.params.id);

    if (!cliente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

app.put("/clientes/:id", (req, res) => {
  try {
    const { nome, email } = req.body;

    const clienteAtualizado = clienteService.atualizarCliente(req.params.id, {
      nome,
      email,
    });

    if (!clienteAtualizado) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(clienteAtualizado);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

app.delete("/clientes/:id", (req, res) => {
  try {
    const clienteRemovido = clienteService.removerCliente(req.params.id);

    if (!clienteRemovido) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover cliente" });
  }
});

app.post("/clientes/import", upload.single("arquivo"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado" });
    }

    const resultado = clienteService.importarClientes(req.file);

    if (resultado.erros.length > 0) {
      // se alguns clientes tem erros
      return res.status(206).json({
        mensagem: "Importação parcial",
        importados: resultado.importados,
        erros: resultado.erros,
      });
    }

    res.status(201).json({
      mensagem: "Importação concluída",
      clientes: resultado.importados,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
