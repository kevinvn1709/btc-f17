// ===================================
// LIGHTBOX FUNCTIONALITY
// ===================================

// Get lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.querySelector('.lightbox-close');

// Get all polaroid images
const polaroids = document.querySelectorAll('.polaroid');

// Add click event to each polaroid
polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', function() {
        const img = this.querySelector('img');
        const yearLabel = this.querySelector('.year-label').textContent;
        const memoryNote = this.querySelector('.memory-note').textContent;
        
        // Open lightbox
        openLightbox(img.src, yearLabel, memoryNote);
    });
});

// Function to open lightbox
function openLightbox(imgSrc, year, note) {
    lightbox.classList.add('active');
    lightboxImg.src = imgSrc;
    lightboxCaption.innerHTML = `<strong>${year}</strong><br>${note}`;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Close lightbox on click of close button
lightboxClose.addEventListener('click', closeLightbox);

// Close lightbox on click outside image
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Close lightbox on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});

// ===================================
// SMOOTH SCROLL ANIMATION
// ===================================

// Add smooth reveal animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all memory cards
const memoryCards = document.querySelectorAll('.memory-card');
memoryCards.forEach(card => {
    observer.observe(card);
});

// ===================================
// PARALLAX EFFECT ON SCROLL (SUBTLE)
// ===================================

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.3}px)`;
        header.style.opacity = 1 - (scrolled / 500);
    }
});

// ===================================
// ADD HOVER SOUND EFFECT (OPTIONAL)
// ===================================

// You can uncomment this if you want to add sound effects
/*
polaroids.forEach(polaroid => {
    polaroid.addEventListener('mouseenter', function() {
        // Add subtle hover sound
        // const hoverSound = new Audio('path-to-your-sound.mp3');
        // hoverSound.volume = 0.2;
        // hoverSound.play();
    });
});
*/

// ===================================
// RANDOM ROTATION ENHANCEMENT
// ===================================

// Add slight random rotation to each polaroid for more natural look
memoryCards.forEach((card, index) => {
    const randomRotation = (Math.random() - 0.5) * 4; // Random between -2 and 2 degrees
    const polaroid = card.querySelector('.polaroid');
    
    // Only apply if not hovering
    polaroid.style.setProperty('--rotation', `${randomRotation}deg`);
});

// ===================================
// LOADING ANIMATION
// ===================================

window.addEventListener('load', function() {
    // Add loaded class to body for any additional animations
    document.body.classList.add('loaded');
    
    // Animate header elements
    const headerElements = document.querySelectorAll('.main-title, .subtitle, .decorative-line');
    headerElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }, index * 200);
    });
});

// ===================================
// TOUCH DEVICE OPTIMIZATION
// ===================================

// Detect touch device
const isTouchDevice = ('ontouchstart' in window) || 
                      (navigator.maxTouchPoints > 0) || 
                      (navigator.msMaxTouchPoints > 0);

if (isTouchDevice) {
    // Add touch-specific class
    document.body.classList.add('touch-device');
    
    // Improve touch interaction
    polaroids.forEach(polaroid => {
        polaroid.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        polaroid.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
}

// ===================================
// CONSOLE MESSAGE (EASTER EGG)
// ===================================

console.log('%c✨ Memory Wall ✨', 'font-size: 20px; color: #DAA520; font-weight: bold;');
console.log('%cKỷ niệm được lưu giữ mãi mãi ♥', 'font-size: 14px; color: #8B4513; font-style: italic;');
console.log('%c2017 - 2025', 'font-size: 12px; color: #A0522D;');
