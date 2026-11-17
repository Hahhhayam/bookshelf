FROM node:24-alpine AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_SHOP_CUSTOMER_ID
ENV VITE_SHOP_CUSTOMER_ID=$VITE_SHOP_CUSTOMER_ID
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
