FROM nginx:1.23-alpine

# Security: Run as non-root user
RUN adduser -D -u 1001 appuser && \
    chown -R appuser:appuser /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# Copy website files......
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Create images directory (empty if no images exist)
RUN mkdir -p /usr/share/nginx/html/images/

# Security headers configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser

EXPOSE 8088

CMD ["nginx", "-g", "daemon off;"]