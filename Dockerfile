# Step 1: Use Node.js as the base image
FROM node:lts

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and lock files
COPY package*.json ./

RUN wget -qO - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

# Step 4: Install dependencies
RUN apt-get update && apt-get install -y \
    google-chrome-stable \
    build-essential \
    python3 \
    wget \
    gnupg \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxrandr2 \
    libgbm-dev \
    libpango1.0-0 \
    libasound2 \
    libxtst6 \
    fonts-liberation \
    libappindicator3-1 \
    libfontconfig1 \
    libxss1 \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

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
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Step 10: Start the application
CMD ["npm", "start"]
