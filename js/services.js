document.addEventListener('DOMContentLoaded', function() {
    // Remove the old contact form handler since we're using GHL now
    
    // Keep the smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Add a small delay before scrolling to allow form to initialize
                setTimeout(() => {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 100);
            }
        });
    });

    // Update the contact buttons handler
    const contactButtons = document.querySelectorAll('.contact-button');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const service = this.getAttribute('data-service');
            const contactSection = document.getElementById('contact-section');
            
            if (contactSection) {
                // Add a small delay before scrolling
                setTimeout(() => {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Trigger form refresh if needed
                    if (window.GHLForm && typeof window.GHLForm.refresh === 'function') {
                        window.GHLForm.refresh();
                    }
                }, 100);
            }
        });
    });
});

/**
 * Redirects users to the appropriate Go High Level booking calendar
 * based on the service type they've selected
 * @param {string} service - The type of service being booked
 */
function redirectToBooking(service) {
    // Cache booking URLs to avoid recreating the object each time
    if (!window.bookingUrlCache) {
        window.bookingUrlCache = {
            'consultation': 'https://api.leadconnectorhq.com/widget/booking/KnLhETWeXcsKQXRLkNI6/',
            'training': 'https://api.leadconnectorhq.com/widget/form/RmCVZOApDLA2S0ZCdv7S',
            'development': 'https://api.leadconnectorhq.com/widget/form/7GpHVgZ9uiaeW71w7Nds',
            'project': "https://api.leadconnectorhq.com/widget/form/0viKwec6MrAiXfWjmd7R"
        };
    }
    
    // Get the URL with less code
    const bookingUrl = window.bookingUrlCache[service] || window.bookingUrlCache['consultation'];
    
    // Track asynchronously to not block
    if (typeof gtag !== 'undefined') {
        setTimeout(() => {
            gtag('event', 'booking_attempt', {
                'event_category': 'engagement',
                'event_label': service
            });
        }, 0);
    }
    
    // Open the booking calendar
    window.open(bookingUrl, '_blank');
    return false;
}

// Add this right after your DOMContentLoaded event handler
window.addEventListener('load', function() {
    // Check if GHL form container exists
    const formContainer = document.getElementById('ghl-form-container');
    if (formContainer) {
        console.log('GHL form container found');
        
        // Monitor for changes in the form container
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    console.log('GHL form content changed:', mutation);
                }
            });
        });
        
        observer.observe(formContainer, {
            childList: true,
            subtree: true
        });
    } else {
        console.error('GHL form container not found');
    }
    
    // Check if GHL script is loaded
    if (typeof GHLForm === 'undefined') {
        console.error('GHL Form script not loaded');
    } else {
        console.log('GHL Form script loaded successfully');
    }
});

function lazyLoadIframes() {
    const iframes = document.querySelectorAll('iframe[data-src]');
    
    // Set up intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                iframe.src = iframe.getAttribute('data-src');
                observer.unobserve(iframe);
                
                // Show loading indicator
                const container = iframe.closest('.ghl-form-container');
                if (container) {
                    container.classList.add('loading');
                    
                    // Hide loading indicator when iframe loads
                    iframe.addEventListener('load', () => {
                        container.classList.remove('loading');
                    });
                }
            }
        });
    });
    
    // Observe all iframes
    iframes.forEach(iframe => {
        observer.observe(iframe);
    });
}

// Call this function after DOM is loaded
document.addEventListener('DOMContentLoaded', lazyLoadIframes); 