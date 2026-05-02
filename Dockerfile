# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application source
COPY . .

# Build Vite SPA
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Re-copy package.json for production install
COPY package.json package-lock.json* ./

# Copy built SPA from builder
COPY --from=builder /app/dist ./dist

# Copy the server file and install production dependencies
COPY server.ts ./
RUN npm ci --omit=dev && npm install express dotenv @google/genai

# TypeScript execution in production might fail without TSX unless compiled.
# However, using tsx in production is sometimes done, or we transpile server.ts.
# Assuming using 'tsx' global or saving as devDep that we kept:
RUN npm install tsx -g

# Cloud Run enforces the PORT environment variable
EXPOSE 3000

# Start server
CMD ["tsx", "server.ts"]
