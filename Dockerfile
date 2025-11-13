FROM nginx:1.23-alpine

# Expose port 8088
EXPOSE 8088

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Change Nginx to listen on 8088
RUN sed -i 's/listen       80;/listen       8088;/g' /etc/nginx/conf.d/default.conf

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
