// API Configuration
const API_CONFIG = {
    development: 'http://localhost:5000',
    // After custom domain setup, use the API subdomain in production
    production: 'https://api.pstuec.com'
};

// Get the API base URL based on environment
function getApiBaseUrl() {
    // Check if running on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return API_CONFIG.development;
    } else {
        return API_CONFIG.production;
    }
}

// Export for use in other scripts
window.API_BASE_URL = getApiBaseUrl();