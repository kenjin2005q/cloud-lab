# Stage 1: Build React SPA (Dùng Node.js 20 để tương thích với Vite/Rolldown)
FROM node:20-alpine AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Serve React bằng Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file cấu hình Nginx Reverse Proxy từ thư mục client
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]