# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Install crypto-browserify to polyfill crypto
RUN npm install crypto-browserify

# Copy the rest of the application code
COPY . .

# Modify the npm run dev command to include --host to make it accessible externally
RUN sed -i 's/\"dev\": \"vite\"/\"dev\": \"vite --host\"/' package.json

# Expose the frontend and backend ports
EXPOSE 5173 8000

# Start the application
CMD ["npm", "run", "dev"]

