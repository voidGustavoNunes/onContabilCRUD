# OnContabil - Desafio prático para Desenvolvedor Node.js
API Restful desenvolvido em razão do desafio de teste práico da OnContabil utilizando Node.js com Express

# Backend (API)

A API foi desenvolvida utilizando Node.js com Express e possui as seguintes rotas:

GET /clientes - Lista todos os clientes.

POST /clientes - Adiciona um novo cliente.

GET /clientes/:id - Busca um cliente pelo ID.

PUT /clientes/:id - Atualiza um cliente pelo ID.

DELETE /clientes/:id - Remove um cliente pelo ID.

POST /clientes/import - Importa clientes em massa a partir de um arquivo Excel.

A API utiliza um array de objetos como banco de dados mockado para armazenar os clientes.

# Camada de Serviço

Foi criada uma camada de serviço separada para gerenciar as operações de CRUD e organizar melhor a lógica de negócio.
Além disso, a API implementa um middleware que registra todas as requisições realizadas.

# Frontend (Tela HTML)

Uma interface HTML simples foi criada para exibir dinamicamente a lista de clientes e permitir a adição de novos clientes.

A tela exibe os seguintes campos:

Nome do cliente

Email do cliente

Além disso, há um formulário para adicionar um novo cliente, contendo os seguintes campos:

Nome

Email

A interface consome a API utilizando a rota GET /clientes para exibir a lista de clientes e POST /clientes para adicionar novos registros.

# Regras de Negócio

Os endpoints retornam mensagens claras em caso de erro, por exemplo: "Cliente não encontrado".

Cada cliente tem um ID único e incremental.

JSON é utilizado para entrada e saída de dados.

A rota de importação permite o envio de um arquivo Excel contendo uma lista de clientes para cadastro em massa.

Critérios de Avaliação

O projeto será avaliado com base nos seguintes critérios:

Estrutura e organização do código.

Implementação correta das rotas e funcionalidades.

Mensagens de erro claras e uso adequado de status HTTP.

Uso correto de funções assíncronas.

Implementação do middleware de logs.

Implementação correta da importação de clientes em massa.

Funcionalidade e interatividade da tela HTML.


# Como Rodar o Projeto

Clone o repositório: git clone https://github.com/voidGustavoNunes/onContabilCRUD

Instale as dependências dentro da pasta backend: npm install

Inicie o servidor: npm start

O servidor rodará por padrão na porta localhost:3000.

Obrigado à todos pela oportunidade!
