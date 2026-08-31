FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./

RUN pnpm install

COPY . .