# Publicação

Passos para publicação de nova versão do NgTailwind:

* Criar uma conta no NPM;

* Solicitar acesso ao pacote como contribuidor;

* Após a realização destes passos, com o projeto aberto digite o seguinte comando no terminal:

  ``` npm login ```

* Com esse comando você deverá realizar o login na sua conta do NPM;

* O próximo passo é subir a versão do pacote. Para isso, vá até o diretório /project/ng-tailwind e acesse o arquivo package.json. Na chave "version" suba a versão;

* Execute o seguinte comando para realizar o build da nova versão:

  ``` npm run build-ngt ```

* Por fim, navegue até o diretório /dist/ng-tailwind e rode o seguinte comando para finalizar a publicação:

  ``` npm publish ```

# Documentação

A documentação encontra-se atualmente em desenvolvimento e pode ser acessada através do link:

``` https://ng-tailwind.tecnoelo.com.br/docs/installation ```
