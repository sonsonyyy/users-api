# ---- Build stage ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install all dependencies (including dev deps needed to compile TypeScript)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and compile
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:22-alpine AS production

ENV NODE_ENV=production
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled output from the build stage
COPY --from=builder /app/dist ./dist

# Run as a non-root user
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

EXPOSE 8081

CMD ["node", "dist/app.js"]
