FROM nginx:1.23-alpine

# Security: Run as non-root user
RUN adduser -D -u 1001 appuser && \
    chown -R appuser:appuser /var/cache/nginx && \
    mkdir -p /var/run/nginx && \
    chown -R appuser:appuser /var/run/nginx && \
    chmod -R 755 /var/cache/nginx

# Add this to your RUN commands:
RUN mkdir -p /var/run/nginx && \
    chown -R appuser:appuser /var/run/nginx

# Copy website files
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Create images directory
RUN mkdir -p /usr/share/nginx/html/images/

# Security headers configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 80



# Fix: Use a writable location for the PID file
# CMD ["nginx", "-g", "pid /tmp/nginx.pid; daemon off;"]
CMD ["nginx", "-g", "daemon off;"]
