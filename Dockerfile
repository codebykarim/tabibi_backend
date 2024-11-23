# Step 1: Use Node.js as the base image
FROM node:18

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and lock files
COPY package*.json ./

# Step 4: Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install

# Step 5: Copy Prisma schema
COPY src/prisma ./src/prisma

# Debug: Verify Prisma files are copied
RUN ls -al ./src/prisma

# Step 6: Copy the rest of the application
COPY . .

# Step 7: Generate Prisma client
RUN npx prisma generate

# Step 8: Build the TypeScript app
RUN npm run build

# Step 9: Expose port
EXPOSE 3000

# Step 10: Start the application
CMD ["npm", "start"]
