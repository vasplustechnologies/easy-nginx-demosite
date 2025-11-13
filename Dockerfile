# Use official Nginx Alpine image as base
FROM nginx:1.23-alpine

# Create app user with UID 1001
RUN adduser -D -u 1001 appuser

# Create directories needed by Nginx and your app
RUN mkdir -p /var/cache/nginx \
    /var/log/nginx \
    /usr/share/nginx/html/images

# Change ownership only for directories we control
RUN chown -R appuser:appuser \
    /var/cache/nginx \
    /var/log/nginx \
    /usr/share/nginx/html

# Copy your website files (if any)
COPY ./html/ /usr/share/nginx/html/

# Replace default Nginx port with 8088
RUN sed -i 's/listen       80;/listen       8088;/g' /etc/nginx/conf.d/default.conf

# Switch to the unprivileged user
USER appuser

# Expose the new port
EXPOSE 8088

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
