// API Configuration
const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

// DOM Elements
const amountInput = document.getElementById('amount');
const fromCurrencySelect = document.getElementById('from-currency');
const toCurrencySelect = document.getElementById('to-currency');
const convertBtn = document.querySelector('.convert-btn');
const swapBtn = document.querySelector('.swap-btn');
const clearBtn = document.querySelector('.clear-btn');
const resultAmount = document.getElementById('result-amount');
const resultCurrency = document.getElementById('result-currency');
const rateText = document.querySelector('.rate-text');
const lastUpdated = document.getElementById('last-updated');
const loadingOverlay = document.getElementById('loading-overlay');

// State Management
let currentRate = 0;
let isLoading = false;
let lastUpdateTime = new Date();
let cachedRates = null;
let cacheExpiry = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeCurrencyDropdowns();
    setupEventListeners();
    updateExchangeRate();
    startAutoRefresh();
});

// Initialize currency dropdowns
function initializeCurrencyDropdowns() {
    const selects = [fromCurrencySelect, toCurrencySelect];
    
    selects.forEach((select, index) => {
        // Clear existing options
        select.innerHTML = '';
        
        // Add currency options
        for (let currCode in countryList) {
            const option = document.createElement('option');
            option.innerText = currCode;
            option.value = currCode;
            
            // Set default selections
            if (index === 0 && currCode === 'USD') {
                option.selected = true;
            } else if (index === 1 && currCode === 'BDT') {
                option.selected = true;
            }
            
            select.appendChild(option);
        }
        
        // Add change event listener
        select.addEventListener('change', (e) => {
            updateFlag(e.target);
            updateExchangeRate();
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Convert button
    convertBtn.addEventListener('click', (e) => {
        e.preventDefault();
        updateExchangeRate();
    });
    
    // Swap button
    swapBtn.addEventListener('click', () => {
        const fromValue = fromCurrencySelect.value;
        const toValue = toCurrencySelect.value;
        
        fromCurrencySelect.value = toValue;
        toCurrencySelect.value = fromValue;
        
        updateFlag(fromCurrencySelect);
        updateFlag(toCurrencySelect);
        updateExchangeRate();
        
        // Add swap animation
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // Clear button
    clearBtn.addEventListener('click', () => {
        amountInput.value = '1';
        amountInput.focus();
        updateExchangeRate();
    });
    
    // Amount input
    amountInput.addEventListener('input', debounce(() => {
        updateExchangeRate();
    }, 500));
    
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            updateExchangeRate();
        }
    });
    
    // Add focus effects
    amountInput.addEventListener('focus', () => {
        amountInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    amountInput.addEventListener('blur', () => {
        amountInput.parentElement.style.transform = 'scale(1)';
    });
}

// Fetch exchange rates from API
async function fetchExchangeRates(baseCurrency = 'USD') {
    // Check cache first
    if (cachedRates && cacheExpiry && new Date() < cacheExpiry) {
        return cachedRates;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/${baseCurrency}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Cache the rates for 1 hour
        cachedRates = data;
        cacheExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        
        return data;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw error;
    }
}

// Update exchange rate
async function updateExchangeRate() {
    if (isLoading) return;
    
    const amount = parseFloat(amountInput.value) || 1;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    
    // Validate amount
    if (amount < 0) {
        amountInput.value = '1';
        return;
    }
    
    showLoading(true);
    
    try {
        // Fetch rates based on from currency
        const ratesData = await fetchExchangeRates(fromCurrency);
        
        if (!ratesData || !ratesData.rates) {
            throw new Error('Invalid exchange rate data received');
        }
        
        const rate = ratesData.rates[toCurrency];
        
        if (!rate) {
            throw new Error(`Exchange rate not available for ${toCurrency}`);
        }
        
        currentRate = rate;
        const finalAmount = amount * rate;
        
        // Update UI with animation
        animateValueChange(resultAmount, finalAmount.toFixed(2));
        resultCurrency.textContent = toCurrency;
        
        // Update rate display
        rateText.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        
        // Update last updated time
        lastUpdateTime = new Date();
        updateLastUpdatedTime();
        
        // Add success animation
        convertBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        setTimeout(() => {
            convertBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }, 1000);
        
    } catch (error) {
        console.error('Error updating exchange rate:', error);
        
        // Try fallback API if main API fails
        if (error.message.includes('HTTP error') || error.message.includes('fetch')) {
            await tryFallbackAPI(amount, fromCurrency, toCurrency);
        } else {
            showError('Failed to fetch exchange rate. Please try again.');
        }
    } finally {
        showLoading(false);
    }
}

// Fallback API using a different service
async function tryFallbackAPI(amount, fromCurrency, toCurrency) {
    try {
        // Try using a different free API as fallback
        const fallbackURL = `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`;
        const response = await fetch(fallbackURL);
        
        if (!response.ok) {
            throw new Error('Fallback API also failed');
        }
        
        const data = await response.json();
        const rate = data.rates[toCurrency];
        
        if (!rate) {
            throw new Error('Invalid fallback data');
        }
        
        currentRate = rate;
        const finalAmount = amount * rate;
        
        // Update UI
        animateValueChange(resultAmount, finalAmount.toFixed(2));
        resultCurrency.textContent = toCurrency;
        rateText.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
        
        lastUpdateTime = new Date();
        updateLastUpdatedTime();
        
        // Show fallback notification
        showNotification('Using fallback API due to main service issues', 'warning');
        
    } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        showError('All exchange rate services are currently unavailable. Please try again later.');
    }
}

// Update flag based on currency selection
function updateFlag(element) {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector('img');
    
    if (img) {
        img.src = newSrc;
        img.alt = currCode;
    }
}

// Show/hide loading overlay
function showLoading(show) {
    isLoading = show;
    if (show) {
        loadingOverlay.classList.add('active');
        convertBtn.disabled = true;
        convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Converting...</span>';
    } else {
        loadingOverlay.classList.remove('active');
        convertBtn.disabled = false;
        convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Convert</span>';
    }
}

// Show notification (success, warning, error)
function showNotification(message, type = 'error') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'error' ? 'exclamation-triangle' : 
                 type === 'warning' ? 'exclamation-circle' : 'check-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles based on type
    const colors = {
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1001;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Show error message (alias for showNotification)
function showError(message) {
    showNotification(message, 'error');
}

// Animate value changes
function animateValueChange(element, newValue) {
    const oldValue = parseFloat(element.textContent) || 0;
    const newValueNum = parseFloat(newValue);
    const difference = newValueNum - oldValue;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = oldValue + (difference * easeOutQuart);
        
        element.textContent = currentValue.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = newValue;
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Update last updated time
function updateLastUpdatedTime() {
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastUpdateTime) / 1000);
    
    if (diffInSeconds < 60) {
        lastUpdated.textContent = 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        lastUpdated.textContent = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
        const hours = Math.floor(diffInSeconds / 3600);
        lastUpdated.textContent = `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
}

// Start auto refresh
function startAutoRefresh() {
    setInterval(() => {
        updateLastUpdatedTime();
    }, 30000); // Update every 30 seconds
    
    // Auto refresh rates every 10 minutes
    setInterval(() => {
        if (!isLoading) {
            // Clear cache to force fresh data
            cachedRates = null;
            cacheExpiry = null;
            updateExchangeRate();
        }
    }, 600000); // 10 minutes
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for animations and notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        transition: background 0.2s ease;
        margin-left: auto;
    }
    
    .notification button:hover {
        background: rgba(255, 255, 255, 0.2);
    }
    
    .convert-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .convert-btn:disabled:hover {
        transform: none;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
    
    .notification {
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .notification i:first-child {
        font-size: 1.1rem;
    }
`;
document.head.appendChild(style);