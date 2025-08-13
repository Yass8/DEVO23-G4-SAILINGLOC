FROM node:22
WORKDIR /app

# 1. Copy package files first
COPY package*.json ./

# 2. Clean install with forced optional dependencies
RUN rm -rf node_modules package-lock.json && \
    npm install --include=optional

# 3. Copy the rest of the files
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]