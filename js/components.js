// کامپوننت‌لودر برای GitHub Pages
class ComponentLoader {
    constructor() {
        this.components = {};
    }

    async loadComponent(componentName) {
        if (this.components[componentName]) {
            return this.components[componentName];
        }

        try {
            const response = await fetch(`components/${componentName}.html`);
            if (!response.ok) throw new Error('Component not found');
            
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
        }
    }

    // لود همزمان چند کامپوننت
    async loadAllComponents() {
        await Promise.all([
            this.renderComponent('header', 'header-container'),
            this.renderComponent('footer', 'footer-container')
        ]);
        
        // اجرای اسکریپت‌ها بعد از لود کامپوننت‌ها
        this.initializeComponents();
    }

    initializeComponents() {
        // ری‌اینیشالایز کردن اسکریپت‌ها
        if (typeof updateVisitorCounter === 'function') {
            updateVisitorCounter();
        }
        
        // ری‌اینیشالایز کردن لایت‌بکس
        initializeLightbox();
    }
}

// ایجاد نمونه و استفاده
const componentLoader = new ComponentLoader();

// وقتی DOM لود شد
document.addEventListener('DOMContentLoaded', function() {
    componentLoader.loadAllComponents();
});
