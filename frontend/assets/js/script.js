// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Website ready!");

    // Initialize membership form if it exists
    const membershipForm = document.getElementById('membershipForm');
    if (membershipForm) {
        initMembershipForm();
    }

    // Smooth scroll for internal anchor links (if added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Membership Form Functionality
function initMembershipForm() {
    const form = document.getElementById('membershipForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const alertContainer = document.getElementById('alertContainer');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        btnText.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        submitBtn.disabled = true;
        clearAlert();

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {};
            
            // Basic form fields
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }

            // Collect interests (checkboxes)
            const interests = [];
            form.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
                if (checkbox.id !== 'agreement') { // Skip agreement checkbox
                    interests.push(checkbox.value);
                }
            });
            data.interests = interests.join(', ');

            // Validate required fields
            if (!data.name || !data.email || !data.department || !data.message) {
                throw new Error('Please fill in all required fields');
            }

            // Send data to backend
            const response = await fetch('http://localhost:5000/api/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                showAlert('success', 'Application Submitted Successfully!', 
                    'Thank you for joining PSTU Entrepreneurship Club. We will contact you soon.');
                form.reset();
            } else {
                throw new Error(result.message || 'Failed to submit application');
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            showAlert('danger', 'Submission Failed', 
                error.message === 'Failed to fetch' 
                    ? 'Unable to connect to server. Please make sure the backend is running and try again.' 
                    : error.message
            );
        } finally {
            // Reset button state
            btnText.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            submitBtn.disabled = false;
        }
    });
}

// Alert functions
function showAlert(type, title, message) {
    const alertContainer = document.getElementById('alertContainer');
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${title}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    alertContainer.innerHTML = alertHTML;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearAlert() {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = '';
}


// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Back to top button
const backToTopButton = document.querySelector('.back-to-top');
window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('active');
    } else {
        backToTopButton.classList.remove('active');
    }
});
backToTopButton.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Grayscale hover effect for sponsors
const sponsorImages = document.querySelectorAll('.grayscale');
sponsorImages.forEach(img => {
    img.addEventListener('mouseover', function () {
        this.style.filter = 'grayscale(0%)';
    });
    img.addEventListener('mouseout', function () {
        this.style.filter = 'grayscale(100%)';
    });
});
  
