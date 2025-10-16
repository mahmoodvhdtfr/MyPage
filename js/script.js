// کد لایت‌بکس
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const triggers = document.querySelectorAll('.lightbox-trigger');

let currentIndex = 0;
const images = [];

// ... بقیه کدهای JavaScript شما دقیقاً مثل قبل

// اجرای کانتر وقتی صفحه لود شد
document.addEventListener('DOMContentLoaded', function() {
    updateVisitorCounter();
});
