/**
 * Portfolio Website JavaScript
 * Author: Madhumitha T
 * Features: Smooth scroll, scroll-to-top, mobile navigation, reveal animations
 */

// ==================== DOM ELEMENTS ====================
// Get references to key DOM elements for manipulation
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('.section');

// ==================== MOBILE NAVIGATION ====================
/**
 * Toggle mobile navigation menu
 * Opens/closes the hamburger menu on mobile devices
 */
function toggleMobileMenu() {
    navMenu.classList.toggle('active');

    // Change hamburger icon to X when menu is open
    const icon = navToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// Add click event listener to mobile menu toggle button
navToggle.addEventListener('click', toggleMobileMenu);

/**
 * Close mobile menu when a navigation link is clicked
 * This ensures the menu closes after the user selects a section
 */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Only close if menu is currently active (mobile view)
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

/**
 * Close mobile menu when clicking outside of it
 */
document.addEventListener('click', (e) => {
    // Check if click is outside nav menu and toggle button
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
});

// ==================== SMOOTH SCROLL ====================
/**
 * Smooth scroll to section when clicking navigation links
 * Uses native scrollIntoView with smooth behavior
 */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Get the target section ID from href attribute
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Calculate offset for fixed navbar
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;

            // Smooth scroll to target position
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== ACTIVE NAVIGATION HIGHLIGHTING ====================
/**
 * Update active navigation link based on scroll position
 * Highlights the nav link corresponding to the currently visible section
 */
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

    // Check each section to determine which is currently in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to corresponding link
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });

    // Special case: If at the top of the page, highlight "Home"
    if (window.scrollY < 100) {
        navLinks.forEach(link => link.classList.remove('active'));
        const homeLink = document.querySelector('.nav-link[href="#hero"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}

// ==================== SCROLL TO TOP BUTTON ====================
/**
 * Show/hide scroll-to-top button based on scroll position
 * Button appears after scrolling down 300px
 */
function toggleScrollTopButton() {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

/**
 * Scroll to top of page when button is clicked
 */
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==================== NAVBAR BACKGROUND ON SCROLL ====================
/**
 * Add/remove shadow to navbar on scroll
 * Creates a subtle effect when scrolling past the hero section
 */
function updateNavbarOnScroll() {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
}

// ==================== SECTION REVEAL ANIMATION ====================
/**
 * Add reveal animation to sections as they come into view
 * Uses Intersection Observer for performance
 */
function setupRevealAnimations() {
    // Add reveal class to all sections
    sections.forEach(section => {
        section.classList.add('reveal');
    });

    // Create Intersection Observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: unobserve after revealing to improve performance
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of section is visible
        rootMargin: '0px 0px -50px 0px' // Slight offset from bottom
    });

    // Observe all sections
    sections.forEach(section => {
        revealObserver.observe(section);
    });
}

// ==================== CONTACT FORM HANDLING ====================
/**
 * Handle contact form submission
 * Currently shows an alert - can be extended to send data to a server
 */
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Success message (in a real application, this would send data to a server)
        alert(`Thank you, ${name}! Your message has been received. I'll get back to you soon.`);

        // Reset form
        contactForm.reset();
    });
}

// ==================== SCROLL EVENT LISTENER ====================
/**
 * Combined scroll event handler
 * Calls multiple functions on scroll for efficiency
 */
function handleScroll() {
    updateActiveNavLink();
    toggleScrollTopButton();
    updateNavbarOnScroll();
}

// Add scroll event listener with throttling for performance
let isScrolling = false;
window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            handleScroll();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// ==================== TYPING EFFECT (OPTIONAL) ====================
/**
 * Create a typing effect for the hero role text
 * Cycles through different role descriptions
 */
function initTypingEffect() {
    const roleElement = document.querySelector('.hero-role');
    if (!roleElement) return;

    const roles = [
        'Software Engineer | Full Stack Developer',
        'Web Developer | Problem Solver',
        'Creative Coder | Tech Enthusiast'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            // Remove characters
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Add characters
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Check if word is complete
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Uncomment the line below to enable typing effect
    // type();
}

// ==================== INITIALIZE ====================
/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Setup reveal animations
    setupRevealAnimations();

    // Initialize typing effect (optional)
    // initTypingEffect();

    // Initial call to set correct states
    handleScroll();

    console.log('Portfolio website initialized successfully!');
});

// ==================== ADDITIONAL HELPER FUNCTIONS ====================
/**
 * Debounce function for performance optimization
 * Limits how often a function can fire
 */
function debounce(func, wait = 20) {
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

/**
 * Check if element is in viewport
 * Useful for additional animation triggers
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add loading animation to elements
 * Can be used for lazy loading images or content
 */
function addLoadingAnimation(elements) {
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';

        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}
