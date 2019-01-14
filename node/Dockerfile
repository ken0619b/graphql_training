# ベースイメージを指定
# alpine は 軽量の linux OS
FROM node:8.9.4-alpine

# node.js の環境(今回は開発環境)
ENV NODE_ENV=development

# ディレクトリを移動する
WORKDIR /app

# ポート3000番を開放する
EXPOSE 4000

# パッケージ
RUN apk update
RUN apk add vim
RUN apk add --no-cache bash gawk sed grep bc coreutils
