// API Configuration
const API_CONFIG = {
    development: 'http://localhost:5000',
    production: 'https://backend-mlhh5r2qg-hridoy75hubs-projects.vercel.app'
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