// کد لایت‌بکس
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const triggers = document.querySelectorAll('.lightbox-trigger');

let currentIndex = 0;
const images = [];

triggers.forEach(trigger => {
    const img = trigger.querySelector('img');
    images.push({
        src: img.src,
        alt: img.alt
    });
});

triggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
        const index = parseInt(this.querySelector('img').getAttribute('data-index'));
        currentIndex = index;
        updateLightboxImage();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

lightboxPrev.addEventListener('click', function(e) {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
});

lightboxNext.addEventListener('click', function(e) {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
});

document.addEventListener('keydown', function(e) {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        }
        if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightboxImage();
        }
    }
});

function updateLightboxImage() {
    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// اسکرول نرم
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

// کانتر با استفاده از CountAPI
async function updateVisitorCounter() {
    const counterElement = document.getElementById('footerVisitorCount');
    
    // ابتدا عدد 0 رو نمایش بده
    counterElement.textContent = '0';
    
    try {
        // استفاده از CountAPI برای شمارش جهانی
        const response = await fetch('https://api.countapi.xyz/hit/mahmoodvhdtfr-gunsefae/visits');
        const data = await response.json();
        
        if (data && data.value) {
            // انیمیشن از 0 به عدد واقعی
            animateCounter(counterElement, 0, data.value);
        }
    } catch (error) {
        console.log('CountAPI not available, using simulated counter');
        // اگر API کار نکرد، از شبیه‌سازی استفاده کن
        simulateCounter(counterElement);
    }
}

// شبیه‌سازی شمارنده اگر API کار نکرد
function simulateCounter(element) {
    const baseCount = 0;
    const randomIncrement = Math.floor(Math.random() * 20) + 5;
    const finalCount = baseCount + randomIncrement;
    
    // انیمیشن با تأخیر
    setTimeout(() => {
        animateCounter(element, baseCount, finalCount);
    }, 1000);
}

// تابع انیمیشن شمارنده
function animateCounter(element, start, end) {
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.max(10, Math.floor(1000 / (end - start)));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// اجرای کانتر وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    updateVisitorCounter();
});
