# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for caching dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Build your Next.js app (if you have build step)
RUN npm run build

# Expose the port your app runs on (default 3000 for Next.js)
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
