// ============================================
// FILE: js/main.js
// LOCATION: /js/main.js
// ============================================

// Global variables
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let uploadedFiles = [];
let isDragging = false;
let exitIntentShown = false;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function smoothScroll(id) {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function selectService(service) {
    const select = document.getElementById('serviceSelect');
    if (select) {
        select.value = service.split(' (')[0]; // Remove price if present
        smoothScroll('contact');
        showToast(`${service.split(' (')[0]} selected. Please complete the form.`);
        select.style.background = '#FFF3E0';
        setTimeout(() => select.style.background = '', 1000);
    }
}

function filterGallery(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.gallery-filter');
    
    if (!cards.length || !buttons.length) return;
    
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.classList.remove('hidden');
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.classList.add('hidden');
        }
    });
}

function openLightbox(card) {
    const img = card.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    
    if (!lightbox || !lightboxImg || !img) return;
    
    lightboxImg.src = img.src;
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

function scrollTestimonials(direction) {
    const track = document.getElementById('testimonialsTrack');
    if (track) track.scrollBy({ left: direction * 380, behavior: 'smooth' });
}

function checkArea() {
    const input = document.getElementById('areaInput');
    const result = document.getElementById('areaResult');
    
    if (!input || !result) return;
    
    const inputVal = input.value.toLowerCase().trim();
    const areas = DB.get('serviceAreas').map(a => a.toLowerCase());
    
    if (!inputVal) {
        result.className = 'area-result error';
        result.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a suburb name.';
        return;
    }
    
    const isCovered = areas.some(area => inputVal.includes(area) || area.includes(inputVal));
    
    if (isCovered) {
        result.className = 'area-result success';
        result.innerHTML = '<i class="fas fa-check-circle"></i> Yes! We service your area. Get a free quote today!';
    } else {
        result.className = 'area-result error';
        result.innerHTML = '<i class="fas fa-times-circle"></i> Your area may be outside our standard zone. Contact us to confirm availability.';
    }
}

function toggleFaq(element) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
    if (!isActive) item.classList.add('active');
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

function closeExitPopup() {
    const popup = document.getElementById('exitPopup');
    if (popup) popup.classList.remove('active');
}

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.classList.remove('show');
}

// ============================================
// QUOTE CALCULATOR
// ============================================

function calculateQuote() {
    const service = document.getElementById('calcService');
    const size = document.getElementById('calcSize');
    const urgency = document.getElementById('calcUrgency');
    const material = document.getElementById('calcMaterial');
    const calcResult = document.getElementById('calcResult');
    const calcPrice = document.getElementById('calcPrice');
    
    if (!service || !size || !urgency || !material || !calcResult || !calcPrice) return;
    
    if (!service.value || !size.value) {
        calcResult.style.display = 'none';
        return;
    }

    const rate = parseFloat(service.options[service.selectedIndex].dataset.rate);
    let total = rate * parseFloat(size.value);
    total *= parseFloat(urgency.value);
    total *= parseFloat(material.value);

    calcPrice.textContent = 'R' + total.toLocaleString();
    calcResult.style.display = 'block';
}

function bookFromCalculator() {
    const service = document.getElementById('calcService');
    const calcPrice = document.getElementById('calcPrice');
    
    if (!service || !calcPrice) return;
    
    const serviceVal = service.value;
    const price = calcPrice.textContent;
    selectService(serviceVal + ' (' + price + ' estimate)');
}

// ============================================
// CALENDAR & BOOKING
// ============================================

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const currentMonthEl = document.getElementById('currentMonth');
    
    if (!grid || !currentMonthEl) return;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    currentMonthEl.textContent = monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
    
    grid.innerHTML = '';
    
    // Day headers
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        grid.innerHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const today = new Date();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div></div>`;
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const disabled = isPast || (isWeekend && day % 3 !== 0); // Some weekends available
        
        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (disabled) classes += ' disabled';
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) classes += ' selected';
        
        grid.innerHTML += `<div class="${classes}" onclick="${disabled ? '' : `selectDate(${day})`}">${day}</div>`;
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

function selectDate(day) {
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    renderCalendar();
    showToast(`Selected: ${selectedDate.toDateString()}`);
}

function selectTime(el) {
    if (!el || el.classList.contains('disabled')) return;
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    selectedTime = el.textContent;
}

function confirmBooking() {
    const serviceSelect = document.getElementById('serviceSelect');
    
    if (!selectedDate || !selectedTime) {
        showToast('Please select a date and time');
        return;
    }

    const booking = {
        date: selectedDate.toISOString(),
        time: selectedTime,
        service: (serviceSelect && serviceSelect.value) || 'General Inquiry'
    };

    DB.addBooking(booking);
    showToast('Booking confirmed! We\'ll contact you within 2 hours.');
    
    // Reset
    selectedDate = null;
    selectedTime = null;
    renderCalendar();
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
}

// ============================================
// FILE UPLOAD & FORM SUBMISSION
// ============================================

function handleFileUpload(input) {
    if (!input) return;
    
    const files = Array.from(input.files);
    if (files.length > 5) {
        showToast('Maximum 5 files allowed');
        return;
    }

    uploadedFiles = files;
    const container = document.getElementById('uploadedFiles');
    if (container) {
        container.innerHTML = files.map(f => `<span style="background: var(--light-orange); padding: 5px 10px; border-radius: 15px; font-size: 12px; margin-right: 5px;"><i class="fas fa-image"></i> ${f.name}</span>`).join('');
    }
}

function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    
    const originalText = btn.innerHTML;
    
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    const formData = new FormData(e.target);
    const lead = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        area: formData.get('area'),
        message: formData.get('message'),
        urgent: formData.get('urgent') === 'on',
        files: uploadedFiles.length
    };

    // Save to localStorage
    DB.addLead(lead);

    // Simulate API call
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        e.target.reset();
        const uploadedFilesContainer = document.getElementById('uploadedFiles');
        if (uploadedFilesContainer) uploadedFilesContainer.innerHTML = '';
        uploadedFiles = [];
        showToast('Quote request sent! We\'ll contact you within 24 hours.');
    }, 1500);
}

// ============================================
// INITIALIZATION
// ============================================

function initComparisonSlider() {
    const slider = document.getElementById('comparisonSlider');
    const handle = document.getElementById('sliderHandle');
    const afterImage = document.getElementById('afterImage');
    
    if (!slider || !handle || !afterImage) return;
    
    handle.addEventListener('mousedown', () => isDragging = true);
    document.addEventListener('mouseup', () => isDragging = false);
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        handle.style.left = percent + '%';
        afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    });

    // Touch support
    handle.addEventListener('touchstart', () => isDragging = true);
    document.addEventListener('touchend', () => isDragging = false);
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const rect = slider.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        handle.style.left = percent + '%';
        afterImage.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    });
}

function initExitIntent() {
    document.addEventListener('mouseout', (e) => {
        if (!exitIntentShown && e.clientY < 0) {
            const popup = document.getElementById('exitPopup');
            if (popup) {
                popup.classList.add('active');
                exitIntentShown = true;
            }
        }
    });
}

function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    });
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            closeExitPopup();
            const mobileMenu = document.getElementById('mobileMenu');
            const chatbotWindow = document.getElementById('chatbotWindow');
            
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (chatbotWindow) chatbotWindow.classList.remove('active');
        }
    });
}

// Initialize on page load
window.addEventListener('load', () => {
    // Hide loader after 1.5 seconds
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 1500);

    // Render all UI components
    renderServices();
    renderPricing();
    renderProjects();
    renderTestimonials();
    renderFAQ();
    renderServiceAreas();
    updateStats();
    updateLogo();
    renderCalendar();

    // Initialize interactive features
    initComparisonSlider();
    initExitIntent();
    initScrollEffects();
    initKeyboardShortcuts();

    // Show cookie banner if not accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            const banner = document.getElementById('cookieBanner');
            if (banner) banner.classList.add('show');
        }, 3000);
    }
});