# Select the runtime environment for the application
FROM node:18.17.1-alpine

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json to install dependencies separately
 COPY package*.json .

# Install Node.js dependencies
RUN npm install

# Copy all project files into the container
COPY . .

# Expose the application port
EXPOSE 4000

# command to start the application when the container starts
CMD ["npm","start" ]