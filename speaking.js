// Speaking page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the speaking page
    initializeSpeakingPage();
});

function initializeSpeakingPage() {
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Add animation on scroll for event cards
    addScrollAnimations();
}

function addSmoothScrolling() {
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addScrollAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate-on-scroll', 'animated');
                }, index * 100);
            }
        });
    }, observerOptions);

    // Observe event cards and topic cards with staggered delays
    document.querySelectorAll('.event-card, .topic-card').forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        if (index < 4) {
            card.classList.add(`animate-delay-${index + 1}`);
        }
        observer.observe(card);
    });

    // Observe section headings
    document.querySelectorAll('h2').forEach((heading, index) => {
        heading.classList.add('animate-on-scroll');
        heading.classList.add(`animate-delay-${(index % 4) + 1}`);
        observer.observe(heading);
    });
}


