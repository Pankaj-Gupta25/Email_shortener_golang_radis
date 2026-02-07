// Configuration
const API_ENDPOINT = 'http://localhost:3000/api/v1';

// DOM Elements
const form = document.getElementById('shortenForm');
const resultCard = document.getElementById('resultCard');
const errorCard = document.getElementById('errorCard');
const shortUrlEl = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const submitBtn = form.querySelector('button[type="submit"]');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous results
    hideResults();
    
    // Show loading state
    setLoadingState(true);

    // Get form data
    const formData = getFormData();

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            showSuccessResult(data);
        } else {
            showError(data.error || 'An error occurred');
        }
    } catch (error) {
        console.error('Request failed:', error);
        showError(`Failed to connect to server. Make sure the API is running on ${API_ENDPOINT}`);
    } finally {
        setLoadingState(false);
    }
});

// Copy to clipboard handler
copyBtn.addEventListener('click', async () => {
    const url = shortUrlEl.textContent;
    try {
        await navigator.clipboard.writeText(url);
        showCopyFeedback();
    } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        fallbackCopyToClipboard(url);
    }
});

// Helper Functions

/**
 * Get form data as object
 */
function getFormData() {
    return {
        url: document.getElementById('url').value,
        short: document.getElementById('customShort').value,
        expiry: parseInt(document.getElementById('expiry').value) || 24
    };
}

/**
 * Hide all result and error cards
 */
function hideResults() {
    resultCard.classList.remove('show');
    errorCard.classList.remove('show');
}

/**
 * Set loading state for submit button
 */
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/**
 * Display success result
 */
function showSuccessResult(data) {
    shortUrlEl.textContent = data.short;
    document.getElementById('rateRemaining').textContent = data.rate_limit;
    document.getElementById('rateReset').textContent = `${data.rate_limit_reset} min`;
    document.getElementById('expiryTime').textContent = `${data.erpiry} hrs`;
    resultCard.classList.add('show');
}

/**
 * Display error message
 */
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    errorCard.classList.add('show');
}

/**
 * Show copy feedback animation
 */
function showCopyFeedback() {
    const originalText = copyBtn.textContent;
    const originalBg = copyBtn.style.background;
    
    copyBtn.textContent = 'Copied!';
    copyBtn.style.background = '#00F5B8';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = originalBg;
    }, 2000);
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Validate URL format (basic client-side validation)
 */
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Add real-time URL validation (optional enhancement)
 */
const urlInput = document.getElementById('url');
urlInput.addEventListener('blur', function() {
    const url = this.value;
    if (url && !isValidURL(url)) {
        // Add http:// if missing
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            this.value = 'https://' + url;
        }
    }
});

// Initialize - Focus on URL input on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('url').focus();
});