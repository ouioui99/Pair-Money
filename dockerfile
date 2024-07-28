FROM node:20-bullseye

# ワーキングディレクトリを/srcに設定
WORKDIR /src

# 不必要なapt-getファイルを消去
RUN apt-get clean

# ポートを5173に設定
EXPOSE 5173