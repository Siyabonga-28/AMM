// ============================================
// FILE: js/ui-renderer.js
// LOCATION: /js/ui-renderer.js
// ============================================

function renderServices() {
    const services = DB.get('services');
    const grid = document.getElementById('servicesGrid');
    const select = document.getElementById('serviceSelect');
    
    if (!grid || !select) return;
    
    grid.innerHTML = services.map(s => `
        <div class="service-card" onclick="selectService('${s.name}')">
            <div class="service-icon"><i class="fas ${s.icon}"></i></div>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
            <div class="service-price">${s.price}</div>
            <a href="#contact" class="service-link" onclick="event.stopPropagation(); selectService('${s.name}')">Get Quote <i class="fas fa-arrow-right"></i></a>
        </div>
    `).join('');

    select.innerHTML = '<option value="">Select a service...</option>' + 
        services.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
}

function renderPricing() {
    const pricing = DB.get('pricing');
    const grid = document.getElementById('pricingGrid');
    
    if (!grid) return;
    
    grid.innerHTML = pricing.map(p => `
        <div class="pricing-card ${p.featured ? 'featured' : ''}">
            ${p.featured ? '<div class="pricing-badge">Most Popular</div>' : ''}
            <h3>${p.name}</h3>
            <div class="pricing-price">${p.price}<span>${p.unit}</span></div>
            <p>${p.description}</p>
            <ul class="pricing-features">
                ${p.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>
            <button class="btn-primary" onclick="selectService('${p.name}')" style="width: 100%; ${p.featured ? 'background: var(--primary-orange);' : ''}">
                Select Package
            </button>
        </div>
    `).join('');
}

function renderProjects() {
    const projects = DB.get('projects');
    const grid = document.getElementById('projectsGrid');
    
    if (!grid) return;
    
    grid.innerHTML = projects.map(p => `
        <div class="project-card" data-category="${p.category}" onclick="openLightbox(this)">
            <img src="${p.image}" alt="${p.title}">
            <div class="project-overlay">
                <h4>${p.title}</h4>
                <p>${p.description}</p>
            </div>
        </div>
    `).join('');
}

function renderTestimonials() {
    const testimonials = DB.get('testimonials');
    const track = document.getElementById('testimonialsTrack');
    
    if (!track) return;
    
    track.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
            <div class="quote-icon">"</div>
            <div class="stars">${Array(t.rating).fill('<i class="fas fa-star"></i>').join('')}</div>
            <p class="testimonial-text">${t.text}</p>
            <div class="testimonial-author">
                <img src="${t.avatar}" alt="${t.name}" class="author-avatar">
                <div class="author-info">
                    <h4>${t.name}</h4>
                    <p>${t.role}, ${t.location}</p>
                    <div class="testimonial-date">${t.date}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderFAQ() {
    const faq = DB.get('faq');
    const grid = document.getElementById('faqGrid');
    
    if (!grid) return;
    
    grid.innerHTML = faq.map((item, index) => `
        <div class="faq-item ${index === 0 ? 'active' : ''}">
            <div class="faq-question" onclick="toggleFaq(this)">
                <span>${item.question}</span>
                <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">${item.answer}</div>
        </div>
    `).join('');
}

function renderServiceAreas() {
    const areas = DB.get('serviceAreas');
    const container = document.getElementById('serviceAreas');
    
    if (!container) return;
    
    container.innerHTML = areas.map(a => 
        `<span style="background: var(--light-orange); padding: 5px 15px; border-radius: 20px; font-size: 13px;">${a}</span>`
    ).join('');
}

function updateStats() {
    const stats = DB.get('stats');
    const statYears = document.getElementById('statYears');
    const statJobs = document.getElementById('statJobs');
    const statRating = document.getElementById('statRating');
    const googleRating = document.getElementById('googleRating');
    const reviewCount = document.getElementById('reviewCount');
    
    if (statYears) statYears.textContent = stats.years + '+';
    if (statJobs) statJobs.textContent = stats.jobs.toLocaleString() + '+';
    if (statRating) statRating.textContent = stats.rating;
    if (googleRating) googleRating.innerHTML = `${stats.rating} <span>/ 5.0</span>`;
    if (reviewCount) reviewCount.textContent = stats.reviews;
}

function updateLogo() {
    const settings = DB.get('settings');
    const logos = ['loaderLogo', 'headerLogo', 'footerLogo'];
    logos.forEach(id => {
        const el = document.getElementById(id);
        if (el && settings.logo) el.src = settings.logo;
    });
}