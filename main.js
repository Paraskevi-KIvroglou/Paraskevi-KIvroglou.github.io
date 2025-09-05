document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    mobileMenuToggle.addEventListener('click', function() {
        // Toggle mobile menu
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        navLinks.classList.toggle('mobile-open');
        mobileMenuToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navLinks.classList.remove('mobile-open');
            mobileMenuToggle.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Back to Top Button functionality
    const backToTopBtn = document.getElementById('back-to-top-btn');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});