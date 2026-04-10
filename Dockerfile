FROM node:18-alpine
WORKDIR /app

# Point to the specific service folder
COPY services/backend/package*.json ./

RUN npm install

# Copy the rest of the backend
COPY services/backend/ .

EXPOSE 3000
CMD ["npm", "start"]