FROM nginx:1.23-alpine

# Security: Run as non-root user
RUN adduser -D -u 1001 appuser && \
    chown -R appuser:appuser /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Only copy images if they exist (safe for Kaniko)
COPY images/ /usr/share/nginx/html/images/
# COPY images/ /usr/share/nginx/html/images/ 2>/dev/null || true

# Security headers configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]