FROM node:18

ENV DATABASE_URL="file:/app/keepie/keepie.db"

WORKDIR /app/keepie

COPY . .

RUN yarn install && yarn prisma migrate deploy && npx prisma generate && yarn build

CMD yarn start