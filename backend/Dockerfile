FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm ci --only=production

# Copy all source files
COPY . .

# Expose backend port
EXPOSE 5000

# Run server
CMD ["npm", "start"]
