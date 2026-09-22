# VerbaLiz

**Quem não fala também tem o que dizer.**

O verbo na ponta do dedo.

Comunicação alternativa em português, gratuita e de uso não comercial, para crianças que não falam.

Dois cards grandes por tela, som, e confirmação Sim ou Não. Funciona offline depois de instalado. Não pede cadastro, não tem anúncio, não envia nada para servidor nenhum. Gravações de voz, fotos e registro de uso ficam no aparelho.

*Nasceu para a Liz. Serve a quem precisar.*

**Vai instalar para uma criança?** Leia primeiro o [guia para famílias](COMO-USAR.md), com aparelhos compatíveis, passo a passo e limitações.

## Para quem isso serve

Perfil de partida:

- criança que alcança e toca a tela, mesmo com toque impreciso
- que já sinaliza aceitação e recusa de forma reconhecível, ainda que sem símbolo
- que se beneficia de poucos alvos grandes, alto contraste e fundo escuro
- que ainda não usa um sistema simbólico de CAA, ou está começando

Para quem usa varredura com acionador ou rastreio ocular, este app **não serve** na versão atual. O acesso é toque direto.

## Como é a navegação

Ao abrir, o adulto escolhe entre duas pranchas.

**Sim e Não.** Dois cards grandes, sem card de pergunta e sem navegação na tela. Quem pergunta é o adulto, em voz alta. É a prancha de varredura assistida pelo parceiro, e com ela dá para chegar a qualquer coisa que não esteja em nenhuma outra prancha.

**Menu principal.** Categorias com até quatro cards por página, escolhas com dois por página, setas de avançar e voltar, e um botão pequeno de home no canto superior esquerdo.

```
Menu ─┬── Quero ──┬── Comer .......... queijo · pão · uva · comida
      │           ├── Beber .......... água · suco · café · leitinho
      │           ├── Mais ........... quero mais · não quero mais
      │           └── Vídeo .......... trocar · parar · desenho · música
      ├── Sinto ..................... dor · cansada · irritada · feliz · com sono · com medo
      │      └── Dor ................ cabeça · barriga
      ├── Fazer ─┬── Sair .......... rede · bicicleta · nadar · sair daqui
      │          ├── Brincar ....... brinquedo · pular · ficar em pé · balançar
      │          ├── Cuidados ...... trocar fralda · vestir roupa · beber remédio · tomar banho · dormir · levantar
      │          └── Lugares ....... escola · terapia · casa · passear
      ├── Chamar .................... papai · mamãe
      └── atalhos ................... mais · dor · trocar fralda
```

Os três atalhos repetem itens que estão mais fundo na árvore. Repetir vocabulário em mais de um lugar é prática normal em CAA, e aqui serve para encurtar o caminho do que é urgente.

Antes de cada mensagem ser falada aparece a confirmação: **Sim** à esquerda, **Não** à direita, sempre nas mesmas posições, para favorecer o planejamento motor.

## Instalar no tablet Android

1. Baixe a voz offline: Configurações, Sistema, Idiomas e entrada, Saída de conversão de texto em voz, engine do Google, ajustes, Instalar dados de voz, português do Brasil.
2. Abra o endereço do app no Chrome.
3. Menu de três pontos, Adicionar à tela inicial.
4. Abra pelo ícone criado, não pelo navegador.
5. Opcional, recomendado: ligue a fixação de tela em Configurações, Segurança, Fixar tela, para a criança não sair do app sem querer.

## Configuração

Na tela Qual prancha, botão **Configuração** no menu do topo. Dentro das pranchas, toque longo de 3 segundos no canto superior direito; ali não existe botão visível, de propósito.

O que dá para ajustar sem mexer no código:

**Toque.** Ativar ao soltar, ao encostar ou por permanência. Tempo de permanência. Intervalo mínimo entre ativações, para ignorar toque repetido. Filtro de toque com a palma, pelo raio do contato.

**Visual.** Card com contorno colorido ou preenchido. Altura do símbolo. Rótulo escrito visível ou não, e seu tamanho. Tempo que a mensagem fica na tela.

**Fluxo.** Exigir ou não a confirmação Sim ou Não. Perguntar em voz alta na confirmação. Modo modelagem, que toca uma pista gravada antes da mensagem, para uso durante o ensino.

**Voz.** Escolha entre as vozes em português instaladas no aparelho, com indicação de quais funcionam offline, e velocidade da fala.

**Áudio gravado.** Cada card aceita duas faixas gravadas pelo próprio aparelho: a mensagem, que é o que a criança diz, e a pista, usada na modelagem. Também aceita uma foto no lugar do desenho.

### Sobre gravar a própria voz

Vale separar duas coisas. A voz da **mensagem** é a voz da criança falando, e o ideal é que corresponda à idade e ao gênero dela, não à do adulto. Já a **pista** e o reforço funcionam melhor na voz de quem convive. Os cards de pessoa, tipo Papai e Mamãe, são exceção útil: gravar a própria voz dizendo o próprio nome costuma ser o melhor desenho, porque ali o card evoca a pessoa, não fala pela criança.

## Registro de uso

Cada ação gera uma linha com data e hora, sessão, tela, card, tipo de evento, latência desde o desenho da tela, duração do toque, nível de ajuda e estado de alerta. Exportação em CSV separado por ponto e vírgula, para abrir em planilha ou em R.

Ajuda e estado de alerta são marcados pelo adulto na configuração, no começo da sessão. Sem isso o dado perde valor, porque desempenho com ajuda física e desempenho independente não são a mesma coisa.

## Adaptar o vocabulário

No começo do `<script>` em `public/index.html` existem dois objetos, `CARDS` e `TELAS`. Cada card tem rótulo, frase falada, cor, nome do símbolo e destino. Cada tela lista dois cards e a tela de volta. É só editar ali.

As cores foram escolhidas saturadas e nunca repetidas entre cards irmãos, para a cor funcionar como pista redundante junto com a posição.

## Rodar e publicar

Código: https://github.com/wandersonepidemiologista/VerbaLiz
Endereço publicado: https://verbaliz.epidemiologista.workers.dev

```bash
git clone https://github.com/wandersonepidemiologista/VerbaLiz.git
cd VerbaLiz
```

Localmente, qualquer servidor estático serve. Só não abra o arquivo direto do disco: sem HTTPS ou localhost, o service worker não registra e o microfone não abre.

```bash
cd public && python3 -m http.server 8080
```

Publicação em Cloudflare Workers:

```bash
npx wrangler login
npx wrangler deploy
```

Ao publicar uma versão nova, troque a constante `VERSAO` no `public/sw.js`. Sem isso o aparelho continua servindo a versão antiga do cache.

## Aviso

Esta ferramenta não é dispositivo médico e não substitui avaliação de fonoaudiologia, terapia ocupacional ou oftalmologia. Escolha de vocabulário, método de acesso e posicionamento do aparelho precisam de avaliação presencial. Um aplicativo caseiro complementa um sistema robusto de CAA, definido com a equipe, e não toma o lugar dele.

Qualquer sinal novo de dor, engasgo, piora de tônus, perda de habilidade já adquirida ou crise epiléptica depois de período sem crises pede atendimento, não ajuste de configuração.

## Sobre o nome

VerbaLiz vem de "verbaliza", com Liz dentro. Escreve-se sempre junto e com V e L maiúsculos. Nos endereços, onde não existe maiúscula, a forma é `verbaliz`.

Não confundir com VerbalizApp, aplicativo espanhol voltado a adultos com afasia, sem relação com este projeto.

## Licença

Este é um projeto de **código disponível para uso não comercial**. Não é software livre nem open source no sentido das definições da FSF e da OSI, porque proíbe uso comercial.

**Código** (aplicativo, scripts, firmware de acionadores): [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0), texto integral no arquivo `LICENSE`.

**Conteúdo** (símbolos desenhados, vocabulário padrão, textos, documentação, imagens próprias): [Creative Commons CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.pt), texto integral no arquivo `LICENSE-CONTEUDO.md`, que também lista quais partes do repositório são conteúdo.

### Na prática

**Pode.** Usar com qualquer criança, em casa, na escola, na clínica, no serviço público, em associação sem fins lucrativos. Modificar o código e o vocabulário. Publicar a sua versão adaptada, inclusive com outro vocabulário ou outros símbolos, desde que também sem fins comerciais.

**Precisa.** Manter a linha `Required Notice: Copyright (c) 2026 EPIC95 CAPACITACAO - CONSULTORIA E ASSESSORIA LTDA` em qualquer cópia ou versão do código. Dar crédito ao conteúdo. Publicar adaptações do conteúdo sob a mesma licença CC BY-NC-SA.

**Não pode.** Vender, incluir em produto pago ou usar como parte de serviço comercial.

### Avatar da Liz

A imagem da página inicial, `public/avatar-liz.jpg`, é exceção às licenças acima: direitos da família da Liz, todos reservados, exibição autorizada apenas dentro do VerbaLiz. No VerbaLiz oficial ela aparece sempre, como parte da identidade do app, e cada família pode colocar ao lado a foto da própria criança, como coleguinha, pela configuração. Quem adaptar o código para outro projeto deve remover ou substituir esse arquivo.

### Símbolos de terceiros

Os símbolos padrão são pictogramas oficiais do [ARASAAC](https://arasaac.org), incluídos sem modificação em `public/conteudo/arasaac/`, com a lista completa em `CREDITOS.md` na mesma pasta.

> Autor pictogramas: Sergio Palao. Origen: ARASAAC (http://www.arasaac.org). Licencia: CC (BY-NC-SA). Propiedad: Gobierno de Aragón (España)

No aplicativo eles aparecem sobre uma placa clara, para o contorno preto continuar visível no fundo escuro. A configuração oferece também um conjunto de traço simples, desenho original do projeto, para crianças que respondem melhor a menos detalhe.

### O que é seu

Pranchas, fotos, vozes gravadas e registros de uso que você cria no aparelho são seus. Ficam no aparelho, não são enviados a lugar nenhum e não fazem parte da obra licenciada. A exportação em Open Board Format, quando existir, entrega esse material a você para levar a outro aplicativo.

### Contribuir

Contribuições são bem-vindas, com duas condições: código original, sem trechos copiados ou adaptados de projetos GPL ou de outra licença copyleft, e dependências apenas com licença permissiva (MIT, Apache, BSD), com os avisos exigidos preservados.
