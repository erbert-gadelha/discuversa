# Discuversa

![wasd](https://github.com/erbert-gadelha/discuversa/assets/48739173/14c3964e-1a26-45c4-83b9-8eb5828c71b7)
Discuversa é um fórum desenvolvido para o interpretador NodeJS, utilizando várias bibliotecas para funcionalidades essenciais.

## Funcionalidades

- Registro de contas
- Login de usuários
- Postagens com título, texto, imagem e tags
- Busca por tags
- Comentários em postagens
- Seguir outros usuários

## Bibliotecas Utilizadas

- Express: Para definição de rotas
- pg: Conexão ao banco de dados Postgres (hospedado na ElephantSQL)
- bcrypt: Para armazenamento seguro de senhas
- passport-local: Gerenciamento de sessões de usuário
- ejs: Interface customizada para cada usuário

## Como Rodar Localmente

1. Certifique-se de ter o Node.js instalado na sua máquina.
2. Clone este repositório: `git clone https://github.com/erbert-gadelha/discuversa`
3. Instale as dependências: `npm install`
4. Configure as variáveis de ambiente para a conexão com o banco de dados Postgres e outras configurações necessárias.
5. Execute o aplicativo: `npm start`
6. Acesse `http://localhost:3000` no seu navegador.

## Acesso à Aplicação

Você pode acessar a versão hospedada do AniForum em [discuversa.onrender.com](https://discuversa.onrender.com/).
