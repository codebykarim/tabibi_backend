# Step 1: Use Node.js as the base image
FROM node:latest

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and lock files
COPY package*.json ./
RUN npm install --frozen-lockfile

# Step 4: Install dependencies
RUN apt-get update \
  && apt-get install -y \
  gconf-service \
  libgbm-dev \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils \
  && rm -rf /var/lib/apt/lists/*

RUN npm install

# Step 5: Copy Prisma schema
COPY src/prisma ./src/prisma

# Step 6: Copy the rest of the application
COPY . .

# Step 7: Generate Prisma client
RUN npx prisma generate

# Step 8: Build the TypeScript app
RUN npm run build

# Step 9: Expose port
EXPOSE 3000

# Define environment variables for Puppeteer (helps with memory issues)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Step 10: Start the application
CMD ["npm", "start"]
