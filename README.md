# 🎞️ Rent-a-Film-API

A nossa solução inhouse para os serviços Rent-a-Film™

## 💿 Features

* Gestão de usuários e filmes em catálogo
* Autenticação com senha e nome de usuário, e autorização com token jwt
* Avalie seus filmes favoritos com nosso sistema de avaliação de filmes favoritos ( ™ )
* Alugue vários filmes de uma vez, e cheque se seu aluguel ainda é válido e até quando
* Com workspace postman incluída para testar até onde seu coração mandar. [Vamos lá!](https://www.postman.com/jlvlg/workspace/rent-a-film-api/)


## ⚙️ Requisitos
```
nodejs ^20.13.1
pnpm ^9.1.2
```
## ⬇️ Instalação
* Clone o repositório git em sua máquina.  
`git clone https://github.com/jlvlg/rent-a-film-api`
* Navegue até o local de instalação.  
`cd rent-a-film-api`
* Instale os pacotes necessários.  
`pnpm install`
* Crie um arquivo .env e inclua uma key chamada JWT_SECRET e dê a ela o valor que a empresa utiliza para assinar os tokens JWT (você sabe qual é, se não lembrar invente um divertido).
* Execute.  
`pnpm dev`
* Acesse a workspace do postman para testar a API.
