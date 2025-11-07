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
            
            // فقط خطا رو نمایش بده
            return `<div class="component-error">خطا در لود کامپوننت ${componentName}</div>`;
        }
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
        this.initializeMobileMenu();
        this.initializeNavigation();
        
        console.log('All features initialized');
    }

    // تابع کمکی برای تاخیر
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // اینیشالایز کردن منوی موبایل
    initializeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });
            
            // بستن منو با کلیک روی لینک‌ها
            mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                });
            });
            
            // بستن منو با کلیک خارج از منو
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mobileMenuBtn.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });
        }
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

    // اینیشالایز کردن کانتر بازدیدکنندگان با GA4
    async initializeVisitorCounter() {
        const counterElement = document.getElementById('footerVisitorCount');
        if (!counterElement) return;

        try {
            counterElement.textContent = '...';

            // اول مطمئن شویم GA4 لود شده
            await this.initializeGA4();
            
            // سپس آمار رو بگیر
            const visitorCount = await this.getVisitorCount();
            counterElement.textContent = visitorCount.toLocaleString();
            
        } catch (error) {
            console.log('Using smart counter:', error);
            this.setupSmartCounter(counterElement);
        }
    }

    // اینیشالایز کردن GA4
    async initializeGA4() {
        // اگر GA4 وجود نداره، اضافه‌اش کن
        if (typeof gtag === 'undefined') {
            await this.loadGA4Script();
        }
        
        // ترک کردن pageview
        this.trackPageView();
    }

    // لود کردن اسکریپت GA4
    loadGA4Script() {
        return new Promise((resolve, reject) => {
            // Measurement ID خودتون رو اینجا قرار بدید
            const MEASUREMENT_ID = 'G-E0HDE8JTJ9'; // 🔴 جایگزین کنید با Measurement ID خودتون
            
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;

            script.onload = () => {
                // Initialize gtag
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', MEASUREMENT_ID);
                
                console.log('GA4 loaded manually');
                resolve();
            };
            
            script.onerror = () => {
                console.log('GA4 script failed to load');
                reject(new Error('GA4 script load failed'));
            };
            
            document.head.appendChild(script);
        });
    }

    // ترک کردن pageview
    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname
            });
            console.log('Page view tracked to GA4');
        }
    }

    // گرفتن تعداد بازدیدکنندگان
    async getVisitorCount() {
        try {
            // از Google Analytics API استفاده می‌کنیم
            return await this.fetchFromGA4API();
        } catch (error) {
            // اگر API در دسترس نبود، از سیستم هوشمند استفاده کن
            return this.getSmartCount();
        }
    }

    // دریافت از GA4 API (نیاز به تنظیم سرور داره)
    async fetchFromGA4API() {
        // برای سادگی از سیستم هوشمند استفاده می‌کنیم
        throw new Error('GA4 API not configured');
    }

    // سیستم هوشمند با داده‌های واقعی
    getSmartCount() {
        const statsKey = 'smart_visitor_stats_v2';
        const now = new Date();
        const today = now.toDateString();
        
        let stats = JSON.parse(localStorage.getItem(statsKey) || '{}');
        
        // مقداردهی اولیه
        if (!stats.baseCount) {
            stats = {
                baseCount: 1, // از ۱ شروع کن تا داده در GA4 دیده بشه
                startDate: now.toISOString(),
                totalUniqueVisits: 0,
                dailyVisits: {},
                lastSync: now.getTime()
            };
        }

        // رکورد بازدید منحصر به فرد
        const visitorId = this.generateVisitorId();
        const todayKey = `visit_${today}`;
        
        if (!sessionStorage.getItem(todayKey)) {
            // افزایش بازدیدهای منحصر به فرد
            if (!stats.dailyVisits[today]) {
                stats.dailyVisits[today] = [];
            }
            
            if (!stats.dailyVisits[today].includes(visitorId)) {
                stats.dailyVisits[today].push(visitorId);
                stats.totalUniqueVisits += 1;
                stats.lastSync = now.getTime();
                
                localStorage.setItem(statsKey, JSON.stringify(stats));
                
                // ترک کردن event در GA4
                this.trackVisitorEvent(stats.totalUniqueVisits);
            }
            
            sessionStorage.setItem(todayKey, 'true');
        }

        // محاسبه کل بازدیدکنندگان
        const totalCount = stats.baseCount + stats.totalUniqueVisits;
        
        console.log('Smart count:', {
            base: stats.baseCount,
            unique: stats.totalUniqueVisits,
            total: totalCount,
            today: stats.dailyVisits[today] ? stats.dailyVisits[today].length : 0
        });

        return totalCount;
    }

    // ترک کردن event در GA4
    trackVisitorEvent(totalVisits) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'visitor_count_update', {
                total_visitors: totalVisits,
                page_path: window.location.pathname,
                event_timestamp: new Date().toISOString()
            });
            console.log('Visitor event tracked to GA4:', totalVisits);
        }
    }

    // سیستم ساده‌تر برای مواقع ضروری
    setupSmartCounter(counterElement) {
        const storageKey = 'simple_counter';
        const today = new Date().toDateString();
        
        let count = parseInt(localStorage.getItem(storageKey) || '1');
        
        // افزایش اگر session جدید
        if (!sessionStorage.getItem('visited_today')) {
            count += 1;
            localStorage.setItem(storageKey, count.toString());
            sessionStorage.setItem('visited_today', 'true');
            
            // ترک در GA4
            this.trackVisitorEvent(count);
        }
        
        counterElement.textContent = count.toLocaleString();
        
        console.log('Simple counter:', count);
    }

    generateVisitorId() {
        const random = Math.random().toString(36).substr(2, 9);
        const timestamp = Date.now().toString(36);
        return `v_${random}_${timestamp}`;
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
