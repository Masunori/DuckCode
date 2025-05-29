# client/Dockerfile.dev
FROM node:20-alpine

# 1. Prep workdir & copy just package files
WORKDIR /app
COPY package.json package-lock.json ./

# 2. Install deps (production + dev)
RUN npm install

# 3. Copy the rest of your code
COPY . .

# 4. Expose Next.js default dev port
EXPOSE 3000

# 5. Default to dev mode; you can override this in compose if you like
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]

