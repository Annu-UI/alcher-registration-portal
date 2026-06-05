# Use Node.js for building the React app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json / yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Copy the runserver script
COPY runserver.sh /app/runserver.sh
RUN chmod +x /app/runserver.sh

# Expose port 80 for the container
EXPOSE 80

# Start the container by running the script
CMD ["/app/runserver.sh"]
