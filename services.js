document.addEventListener('DOMContentLoaded', function() {
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

    // Handle booking button clicks
    document.querySelectorAll('.editorial-cta').forEach(button => {
        button.addEventListener('click', function(e) {
            const serviceType = this.getAttribute('data-booking-type');
            redirectToBooking(serviceType);
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
        
        // Open the booking calendar in a new tab for better user experience
        window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    }
});