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

// Cache for detected image counts
const imagesByYear = {};

// Get all polaroid images
const polaroids = document.querySelectorAll('.polaroid');

// Add click event to each polaroid
polaroids.forEach(polaroid => {
    polaroid.addEventListener('click', async function() {
        const yearLabel = this.querySelector('.year-label').textContent;
        const note = this.querySelector('.memory-note').textContent;
        
        // Open slideshow for this year
        await openSlideshow(yearLabel, note);
    });
});

// Function to detect how many images exist for a year
async function detectImageCount(year) {
    // Check cache first
    if (imagesByYear[year]) {
        return imagesByYear[year];
    }
    
    let count = 0;
    let maxAttempts = 20; // Giới hạn tìm kiếm tối đa 20 ảnh
    
    for (let i = 1; i <= maxAttempts; i++) {
        const imgPath = `images/${year}/${year}-${i}.jpg`;
        const exists = await checkImageExists(imgPath);
        
        if (exists) {
            count = i;
        } else {
            break; // Dừng khi không tìm thấy ảnh tiếp theo
        }
    }
    
    // Cache kết quả
    imagesByYear[year] = count > 0 ? count : 1;
    return imagesByYear[year];
}

// Function to check if image exists
function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Function to open slideshow
async function openSlideshow(year, note) {
    currentYear = year;
    memoryNote = note;
    currentImageIndex = 0;
    
    // Show lightbox with loading state
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Detect total images for this year
    totalImages = await detectImageCount(year);
    
    // Display first image
    updateSlideshow();
}

// Function to update slideshow display
function updateSlideshow() {
    const imgSrc = `images/${currentYear}/${currentYear}-${currentImageIndex + 1}.jpg`;
    lightboxImg.src = imgSrc;
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
    
    // Add slide animation
    lightboxImg.style.animation = 'none';
    setTimeout(() => {
        lightboxImg.style.animation = 'zoomIn 0.3s ease';
    }, 10);
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
