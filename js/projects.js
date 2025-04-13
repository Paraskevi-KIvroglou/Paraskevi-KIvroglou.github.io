document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons and projects
    const filterButtons = document.querySelectorAll('.category-filter');
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add click event to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the category to filter by
            const category = this.getAttribute('data-category');
            
            // Show all projects if "All" is selected
            if (category === 'all') {
                projectCards.forEach(card => {
                    card.style.display = 'block';
                    // Add animation
                    animateCard(card);
                });
            } else {
                // Filter projects by category
                projectCards.forEach(card => {
                    const cardCategories = card.getAttribute('data-category');
                    
                    if (cardCategories && cardCategories.includes(category)) {
                        card.style.display = 'block';
                        // Add animation
                        animateCard(card);
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Function to animate cards when they appear
    function animateCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 50);
    }
    
    // Initialize with all projects visible
    projectCards.forEach(card => {
        animateCard(card);
    });
}); 