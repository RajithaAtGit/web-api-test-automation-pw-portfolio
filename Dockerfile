# Use Node.js as the base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Install dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libwayland-client0 \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps chromium firefox

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build

# Create directories for test results
RUN mkdir -p test-results/screenshots test-results/videos test-results/traces test-results/reports

# Set environment variables
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Volume for test results
VOLUME ["/app/test-results"]

# Default command
ENTRYPOINT ["npm", "run"]
CMD ["test"]