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

# Copy the Prisma schema
COPY --chown=chrome:chrome prisma ./prisma

# Generate Prisma client before copying app files to avoid cache invalidation
RUN npx prisma generate

# Copy the rest of your app files
COPY --chown=chrome:chrome . .

# Ensure migrations are applied (if you use a database)
RUN npx prisma migrate deploy || true

# Build the TypeScript app
RUN npm run build

# Expose the application port
EXPOSE 3000

# Set Puppeteer environment variables to use the pre-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Start the application
CMD ["npm", "start"]
