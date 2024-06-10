# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/avar
EXPOSE 3000

RUN --mount=type=secret,id=cognito_client_id \
    AUTH_COGNITO_ID=$(cat /run/secrets/cognito_client_id)
RUN --mount=type=secret,id=cognito_client_secret \
    AUTH_COGNITO_SECRET=$(cat /run/secrets/cognito_client_secret)
RUN --mount=type=secret,id=cognito_issuer \
    AUTH_COGNITO_ISSUER=$(cat /run/secrets/cognito_issuer)
RUN --mount=type=secret,id=auth_js_secret \
    AUTH_SECRET=$(cat /run/secrets/auth_js_secret)

FROM base as dev
ENV NODE_ENV development
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER root
COPY . .
CMD npm run dev

FROM base as prod
ENV NODE_ENV production
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER root
COPY . .
RUN npm run build
USER node
CMD npm run start

FROM base as test
ENV NODE_ENV test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
RUN npm run test