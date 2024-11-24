# Use the Zenika image with Puppeteer support
FROM zenika/alpine-chrome:with-puppeteer

# Set working directory inside the container
WORKDIR /usr/src/app

# Switch to 'chrome' user for better security and permissions
USER chrome

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (assuming you are using pnpm)
COPY --chown=chrome:chrome package*.json ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the Prisma schema directory
COPY --chown=chrome:chrome src/prisma ./src/prisma

# Copy the rest of your app files
COPY --chown=chrome:chrome . .

# Generate Prisma client
RUN pnpx prisma generate

# Build the TypeScript app
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Set Puppeteer environment variables to use the pre-installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Start the application
CMD ["pnpm", "start"]
