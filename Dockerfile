FROM nginx:1.23-alpine

# Create non-root user
RUN adduser -D -u 1001 appuser

# Fix all required nginx permissions
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html/images && \
    chown -R appuser:appuser \
        /var/cache/nginx \
        /var/run \
        /var/log/nginx \
        /etc/nginx \
        /usr/share/nginx/html

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser

EXPOSE 8088

CMD ["nginx", "-g", "daemon off;"]
