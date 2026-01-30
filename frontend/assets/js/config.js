// API Configuration
const API_CONFIG = {
    development: 'http://localhost:5000',
    // Primary production API. If you have multiple backends, set this to the
    // publicly reachable backend for the frontend to call (provided by you).
    // Example alternatives: 'https://backend-two-kappa-76.vercel.app' or 'https://api.pstuec.com'
    production: 'https://backend-two-kappa-76.vercel.app'
};

// Get the API base URL based on environment
function getApiBaseUrl() {
    // Treat empty hostname (file://) and localhost as development
    const host = window.location.hostname || '';
    if (!host || host === 'localhost' || host === '127.0.0.1') {
        return API_CONFIG.development;
    }
    return API_CONFIG.production;
}

// Export for use in other scripts
window.API_BASE_URL = getApiBaseUrl();

// Optional: Event-specific register URL overrides (paste your Google Forms URLs here)
// Key by event slug or numeric id
window.EVENT_REGISTER_URLS = {
    // Example:
    // 'summit-2025': 'https://forms.gle/your-real-google-form',
    // 7: 'https://forms.gle/another-form-id'
};