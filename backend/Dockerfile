FROM node:22-slim AS builder

WORKDIR /app
RUN apt update && \
    apt install -y openssl

COPY  package.json yarn.lock /app/
RUN yarn install --frozen-lockfile
COPY . /app/
RUN yarn prisma:generate
RUN yarn build


FROM node:22-slim

WORKDIR /app
RUN apt update && \
    apt install -y openssl

COPY package.json yarn.lock /app/
RUN yarn install --production --frozen-lockfile
COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/prisma/ ./prisma
COPY --from=builder /app/generated/ ./generated

EXPOSE 8000

CMD [ "yarn", "start:prod" ]
