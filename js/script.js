// کد لایت‌بکس
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
// ... کدهای لایت‌بکس

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
async function updateVisitorCounter() {  // <- این تابع باید اینجا باشد
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

// برای دیباگ - خط اول فایل
console.log('script.js loaded successfully');

// در انتهای فایل
console.log('All functions defined:', {
    updateVisitorCounter: typeof updateVisitorCounter,
    simulateCounter: typeof simulateCounter,
    animateCounter: typeof animateCounter
});

// اجرای کانتر وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    updateVisitorCounter();  // <- اینجا صدا زده می‌شود
});
