# Use the Zenika image with Puppeteer support
FROM zenika/alpine-chrome:with-puppeteer

# Set working directory inside the container
WORKDIR /usr/src/app

# Switch to 'chrome' user for better security and permissions
USER chrome

# Copy package.json and package-lock.json to install dependencies
COPY --chown=chrome:chrome package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Create the token directory for Venom.js and set permissions
RUN mkdir -p /usr/src/app/tokens && chmod -R 777 /usr/src/app/tokens

# Copy the Prisma schema directory
COPY --chown=chrome:chrome src/prisma ./src/prisma

# Copy the rest of your app files
COPY --chown=chrome:chrome . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript app
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set Puppeteer environment variables to use the pre-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Declare volume mount point for persistent data
VOLUME ["/data"]

# Start the application
CMD ["npm", "start"]
