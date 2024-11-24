# Use the Zenika image with Puppeteer support
FROM zenika/alpine-chrome:with-puppeteer

# Set working directory inside the container
WORKDIR /app

# Switch to 'chrome' user for better security and permissions
USER chrome

# Copy package.json and package-lock.json to install dependencies
COPY --chown=chrome:chrome package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

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

# Start the application
CMD ["npm", "start"]
