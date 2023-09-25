FROM oven/bun

COPY . .
RUN bun run build

CMD ["bun", "run", "dist/index.js"]