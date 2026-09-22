# VerbaLiz: atualiza public/colaboradores.json a partir das respostas do formulário
# Required Notice: Copyright (c) 2026 Wanderson Kleber de Oliveira
# Licença: PolyForm Noncommercial 1.0.0
#
# Como usar
#   1. Na planilha de respostas, marque S na coluna "Aprovado" de quem deve entrar.
#   2. Baixe a planilha: Arquivo > Fazer download > Valores separados por vírgula (.csv)
#      e salve em privado/respostas.csv (a pasta privado/ nunca vai para o GitHub).
#   3. Na raiz do projeto:  Rscript ferramentas/atualizar_colaboradores.R
#      (ou informe outro caminho: Rscript ferramentas/atualizar_colaboradores.R caminho/arquivo.csv)
#   4. Confira o resumo, depois git add public/colaboradores.json, commit e push.
#
# O que vai para o JSON: nome como a pessoa pediu, cidade (se autorizada),
# tipos de contribuição e o mês da primeira contribuição.
# Nunca vai: e-mail, texto da sugestão, relação com o projeto, aparelho, nome da conta do Pix.
#
# Para retirar alguém: apague a entrada em public/colaboradores.json e desmarque o S
# na planilha, senão a pessoa volta na próxima execução.

suppressPackageStartupMessages(library(jsonlite))

args     <- commandArgs(trailingOnly = TRUE)
ARQ_CSV  <- if (length(args) >= 1) args[1] else "privado/respostas.csv"
ARQ_JSON <- "public/colaboradores.json"

if (!file.exists(ARQ_CSV))  stop("Não achei o CSV em: ", ARQ_CSV)
if (!file.exists(ARQ_JSON)) stop("Rode este script na raiz do projeto VerbaLiz.")

# ---------- leitura ----------
txt <- readLines(ARQ_CSV, encoding = "UTF-8", warn = FALSE)
txt[1] <- sub("^\ufeff", "", txt[1])                 # remove BOM, se houver
r <- read.csv(text = txt, check.names = FALSE, stringsAsFactors = FALSE,
              encoding = "UTF-8", na.strings = "")
names(r) <- trimws(names(r))

# encontra coluna pelo começo do título, tolerando pequenas edições no formulário
col <- function(inicio) {
  i <- which(startsWith(tolower(names(r)), tolower(inicio)))
  if (length(i) == 0) stop("Coluna não encontrada: ", inicio)
  names(r)[i[1]]
}
C_APROV <- col("Aprovado")
C_DATA  <- col("Carimbo de data")
C_TIPO  <- col("Que tipo de contribui")
C_AUT   <- col("Posso publicar")
C_NOME  <- col("Nome como deve")
C_LOCAL <- col("Cidade e estado")

# ---------- rótulos do formulário -> códigos (padrão All Contributors) ----------
# Padrões só com letras sem acento: funcionam em qualquer configuração do R.
TIPOS <- c(
  "^Ideia"              = "ideas",        # Ideia ou sugestão
  "^Relato de uso"      = "userTesting",  # Relato de uso com uma criança
  "^Relato de problema" = "bug",
  "^Oferta de tradu"    = "translation",  # Oferta de tradução
  "^Divulga"            = "promotion",    # Divulgação
  "^Apoiei com Pix"     = "financial",
  "^Figuras"            = "design",       # Figuras ou desenho
  "^C.{1,2}digo$"       = "code"          # Código
)
ORDEM <- unname(TIPOS)
codigo_de <- function(rotulo) {
  hit <- which(vapply(names(TIPOS), function(p) grepl(p, rotulo, perl = TRUE), logical(1)))
  if (length(hit)) unname(TIPOS[hit[1]]) else NA_character_
}

limpa <- function(x) { x <- trimws(gsub("\\s+", " ", ifelse(is.na(x), "", x))); x }
chave <- function(x) tolower(iconv(limpa(x), "UTF-8", "ASCII//TRANSLIT"))

# ---------- filtro: aprovado com S e autorização Sim ----------
aprov <- toupper(limpa(r[[C_APROV]])) %in% c("S", "SIM")
aut   <- limpa(r[[C_AUT]])
ok    <- aprov & grepl("^Sim", aut) & limpa(r[[C_NOME]]) != ""
cat("Respostas no CSV:", nrow(r), "| aprovadas e autorizadas:", sum(ok), "\n")

novos <- lapply(which(ok), function(i) {
  nome  <- limpa(r[[C_NOME]][i])
  local <- limpa(r[[C_LOCAL]][i])
  if (grepl("primeiro nome", aut[i])) {
    nome <- strsplit(nome, " ")[[1]][1]           # garante só o primeiro nome
  }
  rot   <- limpa(strsplit(ifelse(is.na(r[[C_TIPO]][i]), "", r[[C_TIPO]][i]), ",")[[1]])
  rot   <- rot[rot != ""]
  cods  <- vapply(rot, codigo_de, "")
  desc  <- rot[is.na(cods)]
  cods  <- unique(cods[!is.na(cods)])
  if (length(desc)) message("Aviso: tipo desconhecido ignorado para ", nome, ": ", paste(desc, collapse = "; "))
  data  <- as.Date(substr(limpa(r[[C_DATA]][i]), 1, 10), format = "%d/%m/%Y")
  list(nome = nome, local = if (local == "") NULL else local,
       contribuicoes = cods, desde = format(data, "%Y-%m"))
})

# ---------- junção com a lista atual (por nome + local) ----------
atual <- fromJSON(ARQ_JSON, simplifyVector = FALSE)
lista <- atual$colaboradores
id    <- function(p) paste(chave(p$nome), chave(if (is.null(p$local)) "" else p$local), sep = "|")

indice <- setNames(seq_along(lista), vapply(lista, id, ""))
entraram <- 0; atualizados <- 0
for (p in novos) {
  k <- id(p)
  if (k %in% names(indice)) {
    j <- indice[[k]]
    antes <- unlist(lista[[j]]$contribuicoes)
    junto <- ORDEM[ORDEM %in% union(antes, p$contribuicoes)]
    if (!setequal(antes, junto)) atualizados <- atualizados + 1
    lista[[j]]$contribuicoes <- as.list(junto)
    if (!is.na(p$desde) && (is.null(lista[[j]]$desde) || p$desde < lista[[j]]$desde)) lista[[j]]$desde <- p$desde
  } else {
    p$contribuicoes <- as.list(ORDEM[ORDEM %in% p$contribuicoes])
    if (is.na(p$desde)) p$desde <- NULL
    lista[[length(lista) + 1]] <- p
    indice[[k]] <- length(lista)
    entraram <- entraram + 1
  }
}

# ordem alfabética, estável entre execuções
lista <- lista[order(vapply(lista, function(p) chave(p$nome), ""))]

saida <- list(atualizado = format(Sys.Date()), colaboradores = lista)
json  <- toJSON(saida, auto_unbox = TRUE, pretty = TRUE, null = "null")
writeLines(enc2utf8(json), ARQ_JSON, useBytes = TRUE)

cat("Novas pessoas:", entraram, "| com contribuição nova:", atualizados,
    "| total na lista:", length(lista), "\n")
cat("Arquivo gravado:", ARQ_JSON, "\n")
