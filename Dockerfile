FROM oven/bun:1.4.3-slim
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY bunfig.toml tsconfig.json dev.ts index.html ./
COPY src ./src
ENV API_URL=http://backend:3000
EXPOSE 5173
CMD ["bun", "run", "dev"]
