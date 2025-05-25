# === Stage 1: Build ===
# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app/client

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./
# If using yarn:
# COPY yarn.lock ./

# Install dependencies
RUN npm install
# If using yarn:
# RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set NEXT_PUBLIC_API_URL as a build argument (optional, can also be set at runtime)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build the Next.js application
RUN npm run build

# === Stage 2: Production ===
# Use a smaller Node.js image for production
# FROM node:20-alpine

# WORKDIR /app/client

# # Set environment variables
# ENV NODE_ENV=production
# # The HOSTNAME variable is crucial for Next.js to listen on all interfaces
# # when running inside a Docker container, especially with `next start`.
# ENV HOSTNAME=0.0.0.0
# # Set the port Next.js will run on inside the container
# ENV PORT=3000

# # Copy the standalone output from the builder stage
# # This requires `output: 'standalone'` in next.config.js
# COPY --from=builder /app/client/.next/standalone ./
# COPY --from=builder /app/client/.next/static ./.next/static
# COPY --from=builder /app/client/public ./public

# # Expose the port the app runs on
# EXPOSE 3000

# # The command to start the Next.js server in standalone mode
# # The server.js file is created by the `output: 'standalone'` build
# CMD ["node", "server.js"]

# # # --- If NOT using standalone output (larger image, less recommended for production) ---
# FROM node:20-alpine AS runner
# WORKDIR /app/client
# ENV NODE_ENV production
# ENV HOSTNAME 0.0.0.0
# ENV PORT 3000
# COPY --from=builder /app/client/package.json ./package.json # May not be needed if all deps are in .next
# COPY --from=builder /app/client/.next ./.next
# COPY --from=builder /app/client/public ./public
# # COPY --from=builder /app/client/node_modules ./node_modules # Only if not bundled
# EXPOSE 3000
# # Ensure your package.json's "start" script is "next start -H 0.0.0.0" or adjust CMD
# CMD ["npm", "run", "start"]

FROM node:20-alpine AS runner
WORKDIR /app/client

ENV NODE_ENV production
ENV HOSTNAME 0.0.0.0
ENV PORT 3000

# Copy only package files, install production deps
COPY --from=builder /app/client/package.json ./package.json
COPY --from=builder /app/client/package-lock.json ./package-lock.json
RUN npm install --production

# Copy build output
COPY --from=builder /app/client/.next ./.next
COPY --from=builder /app/client/public ./public

EXPOSE 3000

# Use next start instead of node server.js
CMD ["npm", "run", "start"]
