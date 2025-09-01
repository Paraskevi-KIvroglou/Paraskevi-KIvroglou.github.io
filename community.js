// Community page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityPage();
    addSmoothScrolling();
    addScrollAnimations();
    addCommunityInteractions();
});

function initializeCommunityPage() {
    console.log('AI Advantage Club community page initialized');
    
    // Add any page-specific initialization here
    trackCommunityPageView();
}

function trackCommunityPageView() {
    // Track community page views for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'AI Advantage Club Community',
            page_location: window.location.href
        });
    }
}

function addSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
}

function addScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.benefit-card, .feature-card, .stat-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

function addCommunityInteractions() {
    // Add hover effects and interactions for community elements
    const communityCards = document.querySelectorAll('.benefit-card, .feature-card, .stat-card');
    
    communityCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Track community button clicks
    const joinButton = document.querySelector('.join-button');
    if (joinButton) {
        joinButton.addEventListener('click', function() {
            // Track community join button click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Community',
                    event_label: 'Join AI Advantage Club',
                    value: 1
                });
            }
        });
    }
}

// Utility functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

// Add scroll-based animations
window.addEventListener('scroll', debounce(() => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.community-visual');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}, 10));
