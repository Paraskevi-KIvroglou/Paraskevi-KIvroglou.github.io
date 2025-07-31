// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth scrolling for anchor links
    initializeSmoothScrolling();
    
    // Initialize contact form handling
    initializeContactForm();
});

/**
 * Initialize smooth scrolling functionality for anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('.scroll-btn').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize contact form functionality
 */
function initializeContactForm() {
    const form = document.getElementById('leadForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

/**
 * Handle contact form submission
 * @param {Event} e - Form submission event
 */
function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const project = formData.get('project');
    
    // Basic validation
    if (!name || !email) {
        showFormAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show success message
    showFormAlert('Thank you! Your automation audit request has been submitted. I\'ll get back to you within 24 hours.', 'success');
    
    // Clear form
    this.reset();
    
    // Optional: Send data to your backend/email service
    // You can integrate with services like Formspree, Netlify Forms, or your own backend
    console.log('Form submitted:', { name, email, project });
    
    // Example integration with Formspree (uncomment and configure as needed):
    // submitToFormspree(formData);
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show form alert message
 * @param {string} message - Message to display
 * @param {string} type - Alert type ('success' or 'error')
 */
function showFormAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `form-alert ${type}`;
    alert.innerHTML = `<p>${message}</p>`;
    
    // Insert after form
    const form = document.getElementById('leadForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(alert, form.nextSibling);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

/**
 * Example function for Formspree integration
 * Uncomment and configure as needed
 * @param {FormData} formData - Form data to submit
 */
/*
function submitToFormspree(formData) {
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Form submitted successfully to Formspree');
        } else {
            console.error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
}
*/

/**
 * Example function for Netlify Forms integration
 * Uncomment and configure as needed
 * @param {FormData} formData - Form data to submit
 */
/*
function submitToNetlify(formData) {
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
    })
    .then(response => {
        if (response.ok) {
            console.log('Form submitted successfully to Netlify');
        } else {
            console.error('Form submission failed');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
}
*/ 