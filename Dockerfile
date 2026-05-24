FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare yarn@4.13.0 --activate

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY packages packages
COPY apps apps
COPY tsconfig.json turbo.json ./

RUN yarn install --immutable
# Build all workspaces and fail the image build if the bot/package output is
# missing, so a broken (dist-less) image can never be published again.
RUN yarn exec turbo run build \
    && test -f apps/pollux/dist/index.js \
    && test -f packages/core/dist/types/index.d.ts

FROM node:22-alpine

RUN corepack enable && corepack prepare yarn@4.13.0 --activate

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=builder /app/packages packages
COPY --from=builder /app/apps apps
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/tsconfig.json ./

WORKDIR /app/apps/pollux

EXPOSE 3000

# Run the compiled output, not ts-node on source: no runtime type-checking to
# crash on, and node resolves the workspace packages via their built dist.
CMD ["node", "dist/index.js"]
