// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("Website ready!");

    // Smooth scroll for internal anchor links (if added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});


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
  
