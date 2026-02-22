// ===================================
// LIGHTBOX SLIDESHOW FUNCTIONALITY
// ===================================

// Get lightbox elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Slideshow state
let currentYear = null;
let currentImageIndex = 0;
let totalImages = 0;
let memoryNote = '';

// Get all polaroid images
const polaroids = document.querySelectorAll('.polaroid');

// Add click event to each polaroid
polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', function() {
        const memoryCard = this.closest('.memory-card');
        const yearLabel = this.querySelector('.year-label').textContent;
        const note = this.querySelector('.memory-note').textContent;
        const imageCount = parseInt(memoryCard.dataset.imageCount) || 1;
        
        // Open slideshow for this year
        openSlideshow(yearLabel, note, imageCount);
    });
});

// Function to open slideshow (no async detection needed)
function openSlideshow(year, note, imageCount) {
    currentYear = year;
    memoryNote = note;
    currentImageIndex = 0;
    totalImages = imageCount;
    
    // Show lightbox and display first image immediately
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Display first image instantly - no delay!
    updateSlideshow();
}

// Function to update slideshow display
function updateSlideshow() {
    const imgSrc = `images/${currentYear}/${currentYear}-${currentImageIndex + 1}.jpg`;
    
    // Add loading state
    lightboxImg.style.opacity = '0.3';
    
    // Create a new image to preload
    const newImg = new Image();
    newImg.onload = () => {
        // Once loaded, update the src
        lightboxImg.src = imgSrc;
        lightboxImg.style.opacity = '1';
        
        // Add slide animation
        lightboxImg.style.animation = 'none';
        setTimeout(() => {
            lightboxImg.style.animation = 'zoomIn 0.3s ease';
        }, 10);
    };
    newImg.onerror = () => {
        // If error, still show something
        lightboxImg.src = imgSrc;
        lightboxImg.style.opacity = '1';
    };
    newImg.src = imgSrc;
    
    lightboxCaption.innerHTML = `<strong>${currentYear}</strong><br>${memoryNote}`;
    
    // Update counter
    if (totalImages > 1) {
        lightboxCounter.textContent = `${currentImageIndex + 1} / ${totalImages}`;
        lightboxCounter.style.display = 'block';
    } else {
        lightboxCounter.style.display = 'none';
    }
    
    // Show/hide navigation buttons
    if (totalImages <= 1) {
        lightboxPrev.classList.add('hidden');
        lightboxNext.classList.add('hidden');
    } else {
        lightboxPrev.classList.remove('hidden');
        lightboxNext.classList.remove('hidden');
    }
}

// Function to show next image
function showNextImage() {
    if (currentImageIndex < totalImages - 1) {
        currentImageIndex++;
        updateSlideshow();
    }
}

// Function to show previous image
function showPrevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateSlideshow();
    }
}

// Function to close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentYear = null;
    currentImageIndex = 0;
}

// Navigation button events
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
});

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
});

// Close lightbox on click of close button
lightboxClose.addEventListener('click', closeLightbox);

// Close lightbox on click outside image
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

lightboxImg.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightboxImg.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swiped left - show next
            showNextImage();
        } else {
            // Swiped right - show previous
            showPrevImage();
        }
    }
}

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
console.log('%cKỷ niệm được lưu lại của những con người F17 ♥', 'font-size: 14px; color: #8B4513; font-style: italic;');
console.log('%cfrom 2019', 'font-size: 12px; color: #A0522D;');
