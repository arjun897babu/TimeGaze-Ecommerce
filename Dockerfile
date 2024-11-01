# Select the runtime environment for the application
FROM  node:20.12.2

# Set the working directory in the container
WORKDIR /src

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install google-chrome-stable -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

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