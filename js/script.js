// برای دیباگ
console.log('script.js loaded successfully');

// کامپوننت‌لودر برای GitHub Pages
class ComponentLoader {
    constructor() {
        this.components = {};
        this.isInitialized = false;
    }

    async loadComponent(componentName) {
        if (this.components[componentName]) {
            return this.components[componentName];
        }

        try {
            // برای GitHub Pages از مسیر نسبی استفاده می‌کنیم
            const response = await fetch(`./components/${componentName}.html`);
            if (!response.ok) throw new Error(`Component ${componentName} not found`);
            
            const html = await response.text();
            this.components[componentName] = html;
            return html;
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            return `<div class="error">Error loading ${componentName}</div>`;
        }
    }

    async renderComponent(componentName, targetElementId) {
        const html = await this.loadComponent(componentName);
        const target = document.getElementById(targetElementId);
        if (target) {
            target.innerHTML = html;
            console.log(`Component ${componentName} rendered successfully`);
        } else {
            console.warn(`Target element #${targetElementId} not found for ${componentName}`);
        }
    }

    // لود همزمان چند کامپوننت
    async loadAllComponents() {
        try {
            await Promise.all([
                this.renderComponent('header', 'header-container'),
                this.renderComponent('footer', 'footer-container')
            ]);
            
            // اجرای اسکریپت‌ها بعد از لود کامپوننت‌ها
            this.initializeComponents();
            this.isInitialized = true;
            
            console.log('All components loaded successfully');
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    initializeComponents() {
        // ری‌اینیشالایز کردن لایت‌بکس
        this.initializeLightbox();
        
        // ری‌اینیشالایز کردن اسکرول نرم
        this.initializeSmoothScroll();
        
        // ری‌اینیشالایز کردن کانتر
        if (typeof this.updateVisitorCounter === 'function') {
            this.updateVisitorCounter();
        }
        
        // جلوگیری از کلیک روی لینک‌های غیرفعال
        this.handleDisabledLinks();
    }

    initializeLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        const triggers = document.querySelectorAll('.lightbox-trigger');

        // اگر المان‌ها وجود ندارند، خارج شو
        if (!lightbox || !lightboxImg) {
            console.log('Lightbox elements not found');
            return;
        }

        let currentIndex = 0;
        const images = [];

        // جمع‌آوری تمام تصاویر
        triggers.forEach(trigger => {
            const img = trigger.querySelector('img');
            if (img) {
                images.push({
                    src: img.src,
                    alt: img.alt
                });
            }
        });

        // اضافه کردن ایونت‌لیسنر به هر تریگر
        triggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    const index = parseInt(img.getAttribute('data-index')) || 0;
                    currentIndex = index;
                    updateLightboxImage();
                    lightbox.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // بستن لایت‌بکس
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // بستن با کلیک روی بک‌گراند
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // نویگیشن قبلی/بعدی
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateLightboxImage();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', function(e) {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % images.length;
                updateLightboxImage();
            });
        }

        // نویگیشن با کیبورد
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
            if (images[currentIndex]) {
                lightboxImg.src = images[currentIndex].src;
                lightboxImg.alt = images[currentIndex].alt;
            }
        }

        function closeLightbox() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        console.log('Lightbox initialized with', images.length, 'images');
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // آپدیت URL بدون ریلود صفحه
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    handleDisabledLinks() {
        document.querySelectorAll('a[href="#"], a[href=""]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Disabled link clicked:', link.textContent);
            });
        });

        // اضافه کردن استایل به لینک‌های غیرفعال
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.style.cursor = 'not-allowed';
            link.style.opacity = '0.6';
        });
    }

    // کانتر با استفاده از CountAPI
    async updateVisitorCounter() {
        const counterElement = document.getElementById('footerVisitorCount');
        
        if (!counterElement) {
            console.log('Visitor counter element not found');
            return;
        }

        // ابتدا عدد 0 رو نمایش بده
        counterElement.textContent = '0';
        
        try {
            // استفاده از CountAPI برای شمارش جهانی
            const response = await fetch('https://api.countapi.xyz/hit/mahmoodvhdtfr-global/visits');
            const data = await response.json();
            
            if (data && data.value) {
                // انیمیشن از 0 به عدد واقعی
                this.animateCounter(counterElement, 0, data.value);
            }
        } catch (error) {
            console.log('CountAPI not available, using simulated counter');
            // اگر API کار نکرد، از شبیه‌سازی استفاده کن
            this.simulateCounter(counterElement);
        }
    }

    // شبیه‌سازی شمارنده اگر API کار نکرد
    simulateCounter(element) {
        const baseCount = 1250; // عدد پایه برای شبیه‌سازی
        const randomIncrement = Math.floor(Math.random() * 50) + 10;
        const finalCount = baseCount + randomIncrement;
        
        // انیمیشن با تأخیر
        setTimeout(() => {
            this.animateCounter(element, 0, finalCount);
        }, 1000);
    }

    // تابع انیمیشن شمارنده
    animateCounter(element, start, end) {
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.max(10, Math.floor(1500 / (end - start)));
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current.toLocaleString(); // فرمت عدد
            
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
}

// ایجاد نمونه جهانی
const componentLoader = new ComponentLoader();

// وقتی DOM کاملاً لود شد
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing components...');
    
    // لود کامپوننت‌ها
    componentLoader.loadAllComponents();
    
    // اضافه کردن loading state
    document.body.classList.add('components-loaded');
});

// هندل کردن خطاها
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// برای دیباگ
console.log('ComponentLoader class defined:', {
    componentLoader: typeof componentLoader,
    methods: Object.getOwnPropertyNames(ComponentLoader.prototype)
});

// تابع کمکی برای بررسی وضعیت لود
window.getLoaderStatus = function() {
    return {
        isInitialized: componentLoader.isInitialized,
        loadedComponents: Object.keys(componentLoader.components),
        totalComponents: 2
    };
};

// تابع برای ریلود کامپوننت‌ها (مفید برای توسعه)
window.reloadComponents = function() {
    componentLoader.components = {};
    componentLoader.loadAllComponents();
};
