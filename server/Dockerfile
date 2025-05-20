 === Stage 1: Build (if you have a build step like TypeScript) ===
 FROM node:20-alpine AS builder
 WORKDIR /app/server
 COPY package.json package-lock.json ./
 RUN npm install
 COPY . .
 RUN npm run build 
 
# === Stage 2: Production ===
# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app/server

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json ./
COPY package-lock.json ./
# If using yarn:
# COPY yarn.lock ./

# Install only production dependencies
RUN npm install --omit=dev
# If using yarn:
# RUN yarn install --production --frozen-lockfile

# Copy the rest of the application code
# If you had a build stage, you'd copy from it:
# COPY --from=builder /app/server/dist ./dist
# COPY . . # If no build stage or to copy remaining files like .env if not using compose for vars
COPY . .


# Expose the port the backend will run on
# This should match the PORT environment variable you use in your app
EXPOSE 8080

# Define the command to run your application
# This assumes your package.json has a "start" script
# e.g., "start": "node index.js"
CMD ["npm", "start"]
