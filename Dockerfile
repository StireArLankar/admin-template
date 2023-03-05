FROM endeveit/docker-jq AS deps

WORKDIR /tmp

COPY package.json temp.json
RUN jq '{ dependencies, devDependencies, resolutions, scripts, private }' < /tmp/temp.json > /tmp/package.json
RUN rm /tmp/temp.json

FROM node:lts-alpine as builder
WORKDIR /src

COPY pnpm-lock.yaml .
COPY patches patches
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY tsconfig.schema.json .
COPY --from=deps /tmp /src

ENV CI=true

RUN pnpm i

COPY src src
COPY public public
COPY prisma prisma
COPY index.html .
COPY vite.config.ts .
COPY tailwind.config .
COPY postcss.config.cjs .
COPY esbuild.ts .

RUN pnpm build

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /src/build /app/build/
COPY package.json package.json
# COPY /config /app/config/
ARG VERSION
ENV VERSION=${VERSION}
CMD ["yarn", "start"]
