// components.js - Component Loader for GitHub Pages
console.log('components.js loaded successfully');

// کامپوننت‌لودر حرفه‌ای برای GitHub Pages
class ComponentLoader {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        console.log('ComponentLoader initialized');
    }

    // لود کامپوننت از فایل HTML
    async loadComponent(componentName) {
        // اگر قبلاً لود شده، از کش استفاده کن
        if (this.components[componentName]) {
            console.log(`Using cached component: ${componentName}`);
            return this.components[componentName];
        }

        try {
            console.log(`Loading component: ${componentName}`);
            
            // مسیرهای مختلف برای تست
            const paths = [
                `./components/${componentName}.html`,
                `components/${componentName}.html`,
                `/${componentName}.html`
            ];

            let response;
            for (const path of paths) {
                try {
                    response = await fetch(path);
                    if (response.ok) break;
                } catch (e) {
                    console.log(`Trying alternative path: ${path}`);
                    continue;
                }
            }

            if (!response || !response.ok) {
                throw new Error(`Component ${componentName} not found in any path`);
            }
            
            const html = await response.text();
            
            // ذخیره در کش
            this.components[componentName] = html;
            console.log(`Component ${componentName} loaded successfully`);
            
            return html;
            
        } catch (error) {
            console.error(`Error loading ${componentName}:`, error);
            
            // کامپوننت پیش‌فرض در صورت خطا
            return this.getFallbackComponent(componentName);
        }
    }

    // کامپوننت‌های پیش‌فرض برای زمانی که فایل‌ها لود نمی‌شوند
    getFallbackComponent(componentName) {
        const fallbackComponents = {
            'header': `
                <header class="main-header">
                    <div class="header-container">
                        <div class="header-actions">
                            <a href="https://daramet.com/MahmoodVhdtfr" target="_blank" rel="noopener noreferrer" class="coffee-btn">
                                <span class="coffee-text">Buy Me a Cup of Tea</span>
                                <span>🍵</span>
                            </a>
                        </div>
                        <div class="logo">
                            <a href="index.html">
                                <img src="images/LOGO-M.png" alt="MahmoodVhdtfr" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjUiIGhlaWdodD0iNjUiIHZpZXdCb3g9IjAgMCA2NSA2NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY1IiBoZWlnaHQ9IjY1IiBmaWxsPSIjMzk4RDk1Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyNCI+TTwvdGV4dD4KPC9zdmc+'">
                            </a>
                        </div>
                    </div>
                </header>
            `,
            'footer': `
                <footer class="footer">
                    <a href="https://wa.me/989355618035" style="color: white; text-decoration: none">
                        <img src="images/LOGO-M.png" alt="MahmoodVhdtfr" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjMzk4RDk1Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIyMCI+TTwvdGV4dD4KPC9zdmc+'">
                        <p style="margin: 0; font-weight: bold;">MahmoodVhdtfr</p>
                    </a>
                    <p style="margin: 0;">تورکجه‌م منیم، سس بایراغیم</p>
                    <p style="margin: 0;"> 
                        <span class="visitor-number" id="footerVisitorCount">0</span> : 👥 | ❤️ ایله یارادیلیب 
                    </p>
                </footer>

                <!-- لایت‌بکس -->
                <div id="lightbox" class="lightbox">
                    <span class="lightbox-close">&times;</span>
                    <div class="lightbox-nav">
                        <span class="lightbox-prev">&#10094;</span>
                        <span class="lightbox-next">&#10095;</span>
                    </div>
                    <img class="lightbox-content" id="lightbox-img" src="" alt="">
                </div>
            `
        };

        return fallbackComponents[componentName] || `<div class="component-error">Component ${componentName} failed to load</div>`;
    }

    // رندر کامپوننت در المان هدف
    async renderComponent(componentName, targetElementId) {
        const html = await this.loadComponent(componentName);
        const target = document.getElementById(targetElementId);
        
        if (target) {
            target.innerHTML = html;
            console.log(`Component ${componentName} rendered to #${targetElementId}`);
            
            // اجرای اسکریپت‌های داخل کامپوننت
            this.executeScriptsInComponent(target);
            
            return true;
        } else {
            console.error(`Target element #${targetElementId} not found for ${componentName}`);
            return false;
        }
    }

    // اجرای اسکریپت‌های داخل کامپوننت
    executeScriptsInComponent(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            
            // کپی کردن attributes
            Array.from(script.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            
            // کپی کردن محتوای اسکریپت
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            
            // جایگزینی اسکریپت قدیمی
            script.parentNode.replaceChild(newScript, script);
        });
    }

    // لود همزمان تمام کامپوننت‌ها
    async loadAllComponents() {
        console.log('Starting to load all components...');
        
        try {
            const componentsToLoad = [
                { name: 'header', target: 'header-container' },
                { name: 'footer', target: 'footer-container' }
            ];

            const results = await Promise.allSettled(
                componentsToLoad.map(comp => 
                    this.renderComponent(comp.name, comp.target)
                )
            );

            // بررسی نتایج
            results.forEach((result, index) => {
                const comp = componentsToLoad[index];
                if (result.status === 'fulfilled' && result.value) {
                    console.log(`✅ ${comp.name} loaded successfully`);
                } else {
                    console.error(`❌ ${comp.name} failed to load`);
                }
            });

            // اینیشالایز کردن قابلیت‌ها
            await this.initializeFeatures();
            
            this.isInitialized = true;
            console.log('🎉 All components initialized successfully');
            
            // رویداد سفارشی برای اطلاع از لود کامل
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
            
        } catch (error) {
            console.error('💥 Error loading components:', error);
            
            // ریترای در صورت خطا
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`Retrying... (${this.retryCount}/${this.maxRetries})`);
                setTimeout(() => this.loadAllComponents(), 1000 * this.retryCount);
            }
        }
    }

    // اینیشالایز کردن تمام قابلیت‌ها
    async initializeFeatures() {
        console.log('Initializing features...');
        
        // صبر کردن برای اینکه DOM بروزرسانی شود
        await this.delay(100);
        
        // اینیشالایز کردن قابلیت‌ها
        this.initializeLightbox();
        this.initializeSmoothScroll();
        this.initializeVisitorCounter();
        this.handleDisabledLinks();
        this.initializeNavigation();
        
        console.log('All features initialized');
    }

    // تابع کمکی برای تاخیر
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // اینیشالایز کردن لایت‌بکس
    initializeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) {
            console.log('Lightbox element not found');
            return;
        }

        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxClose = document.querySelector('.lightbox-close');
        const lightboxPrev = document.querySelector('.lightbox-prev');
        const lightboxNext = document.querySelector('.lightbox-next');
        const triggers = document.querySelectorAll('.lightbox-trigger');

        let currentIndex = 0;
        const images = [];

        // جمع‌آوری تصاویر
        triggers.forEach(trigger => {
            const img = trigger.querySelector('img');
            if (img) {
                images.push({
                    src: img.src,
                    alt: img.alt,
                    element: img
                });
            }
        });

        // اگر تصویری نیست، خارج شو
        if (images.length === 0) {
            console.log('No lightbox images found');
            return;
        }

        console.log(`Lightbox initialized with ${images.length} images`);

        // ایونت‌های تریگر
        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => {
                currentIndex = index;
                this.updateLightboxImage(lightboxImg, images[currentIndex]);
                lightbox.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        // ایونت‌های کنترل لایت‌بکس
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox(lightbox));
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                this.updateLightboxImage(lightboxImg, images[currentIndex]);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % images.length;
                this.updateLightboxImage(lightboxImg, images[currentIndex]);
            });
        }

        // بستن با کلیک روی بک‌گراند
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });

        // کنترل با کیبورد
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex') {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox(lightbox);
                        break;
                    case 'ArrowLeft':
                        currentIndex = (currentIndex - 1 + images.length) % images.length;
                        this.updateLightboxImage(lightboxImg, images[currentIndex]);
                        break;
                    case 'ArrowRight':
                        currentIndex = (currentIndex + 1) % images.length;
                        this.updateLightboxImage(lightboxImg, images[currentIndex]);
                        break;
                }
            }
        });
    }

    // آپدیت تصویر لایت‌بکس
    updateLightboxImage(lightboxImg, image) {
        if (lightboxImg && image) {
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
        }
    }

    // بستن لایت‌بکس
    closeLightbox(lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // اینیشالایز کردن اسکرول نرم
    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            // صرفنظر از لینک‌های غیرفعال
            if (anchor.getAttribute('href') === '#') return;
            
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // آپدیت URL
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // اینیشالایز کردن کانتر بازدیدکنندگان
    async initializeVisitorCounter() {
        const counterElement = document.getElementById('footerVisitorCount');
        if (!counterElement) {
            console.log('Visitor counter element not found');
            return;
        }

        // نمایش عدد اولیه
        counterElement.textContent = '0';

        try {
            const response = await fetch('https://api.countapi.xyz/hit/mahmoodvhdtfr-global/visits');
            const data = await response.json();
            
            if (data && data.value) {
                this.animateCounter(counterElement, 0, data.value);
            }
        } catch (error) {
            console.log('CountAPI unavailable, using fallback counter');
            this.simulateCounter(counterElement);
        }
    }

    // شبیه‌سازی کانتر
    simulateCounter(element) {
        const baseCount = 1250;
        const randomIncrement = Math.floor(Math.random() * 50) + 10;
        const finalCount = baseCount + randomIncrement;
        
        setTimeout(() => {
            this.animateCounter(element, 0, finalCount);
        }, 1500);
    }

    // انیمیشن کانتر
    animateCounter(element, start, end) {
        let current = start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.max(10, Math.floor(2000 / (end - start)));
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current.toLocaleString();
            
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // هندل کردن لینک‌های غیرفعال
    handleDisabledLinks() {
        document.querySelectorAll('a[href="#"], a[href=""]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
            
            // استایل برای لینک‌های غیرفعال
            link.style.cursor = 'not-allowed';
            link.style.opacity = '0.6';
        });
    }

    // اینیشالایز کردن نویگیشن
    initializeNavigation() {
        // هایلایت لینک فعال
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    // ری‌لود کامپوننت‌ها
    async reloadComponents() {
        console.log('Reloading components...');
        this.components = {};
        this.isInitialized = false;
        await this.loadAllComponents();
    }

    // گرفتن وضعیت لودر
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            loadedComponents: Object.keys(this.components),
            retryCount: this.retryCount
        };
    }
}

// ایجاد نمونه جهانی
const componentLoader = new ComponentLoader();

// وقتی DOM لود شد
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting component loader');
    
    // اضافه کردن کلاس لودینگ
    document.body.classList.add('components-loading');
    
    // لود کامپوننت‌ها
    componentLoader.loadAllComponents().then(() => {
        document.body.classList.remove('components-loading');
        document.body.classList.add('components-loaded');
    });
});

// رویداد برای زمانی که کامپوننت‌ها لود شدند
document.addEventListener('componentsLoaded', function() {
    console.log('Components loaded event received');
});

// قرار دادن در scope جهانی برای دسترسی از کنسول
window.componentLoader = componentLoader;

// توابع کمکی برای توسعه
window.getLoaderStatus = () => componentLoader.getStatus();
window.reloadComponents = () => componentLoader.reloadComponents();

console.log('components.js setup completed');
