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
    // Define your Go High Level calendar URLs for each service type
    const bookingUrls = {
        'consultation': 'https://api.leadconnectorhq.com/widget/booking/KnLhETWeXcsKQXRLkNI6/',
        'training': 'https://api.leadconnectorhq.com/widget/form/RmCVZOApDLA2S0ZCdv7S',
        'development': 'https://api.leadconnectorhq.com/widget/form/7GpHVgZ9uiaeW71w7Nds',
        'project': "https://api.leadconnectorhq.com/widget/form/0viKwec6MrAiXfWjmd7R"
    };
    
    // Track the booking attempt (optional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_attempt', {
            'event_category': 'engagement',
            'event_label': service
        });
    }
    
    // Get the URL for the requested service or use consultation as default
    const bookingUrl = bookingUrls[service] || bookingUrls['consultation'];
    
    // Open the booking calendar in a new tab
    window.open(bookingUrl, '_blank');
    
    // Return false to prevent default anchor behavior
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