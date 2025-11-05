// Add build information dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Set build date
    document.getElementById('build-date').textContent = new Date().toISOString().split('T')[0];
    
    // In a real scenario, this would come from environment variables
    // For demo, we'll use a placeholder
    document.getElementById('git-sha').textContent = 'main-' + Date.now().toString(36);
    
    // Add some interactive features
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    console.log('Easy Nginx Demo Site loaded successfully!');
});