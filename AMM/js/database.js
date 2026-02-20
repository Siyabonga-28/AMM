// ============================================
// FILE: js/database.js
// LOCATION: /js/database.js
// ============================================

const DB = {
    init() {
        if (!localStorage.getItem('amm_db')) {
            const initialData = {
                settings: {
                    companyName: 'All Maintenance Matters',
                    phone: '012 345 6789',
                    whatsapp: '072 123 4567',
                    email: 'info@allmaintenancematters.co.za',
                    address: '123 Main Street, Sandton, Johannesburg, 2196',
                    logo: 'https://i.imgur.com/placeholder.png'
                },
                services: [
                    { id: 1, name: 'Electrical Work', icon: 'fa-bolt', description: 'Full electrical installations, repairs, and maintenance.', price: 'From R450/hour', category: 'electrical' },
                    { id: 2, name: 'Road & Paving', icon: 'fa-road', description: 'Road repairs, driveway installations, and concrete paving.', price: 'From R350/m²', category: 'roads' },
                    { id: 3, name: 'Home Repairs', icon: 'fa-home', description: 'General maintenance including plumbing, drywall, and painting.', price: 'From R380/hour', category: 'home' },
                    { id: 4, name: 'Construction', icon: 'fa-building', description: 'New builds, extensions, renovations, and structural work.', price: 'Project Based', category: 'construction' },
                    { id: 5, name: 'Painting & Finishing', icon: 'fa-paint-roller', description: 'Interior and exterior painting with proper surface prep.', price: 'From R120/m²', category: 'renovation' },
                    { id: 6, name: 'Emergency Repairs', icon: 'fa-tools', description: '24/7 emergency services for urgent repairs.', price: 'R650 call-out', category: 'emergency' }
                ],
                pricing: [
                    { id: 1, name: 'Basic Maintenance', price: 'R450', unit: '/hour', description: 'Perfect for small repairs', featured: false, features: ['Minor electrical repairs', 'Plumbing fixes', 'Door/window repairs', 'General handyman work', '3-month warranty'] },
                    { id: 2, name: 'Renovation Package', price: 'R850', unit: '/m²', description: 'Complete room renovations', featured: true, features: ['Full room renovation', 'Kitchen/bathroom remodel', 'Flooring installation', 'Painting & finishing', '12-month warranty', 'Project management'] },
                    { id: 3, name: 'Commercial', price: 'Custom', unit: 'Quote', description: 'Tailored business solutions', featured: false, features: ['Road & paving work', 'Commercial electrical', 'Building maintenance', 'Scheduled maintenance', '24/7 priority support', 'BEE Certified'] }
                ],
                projects: [
                    { id: 1, title: 'Commercial Electrical', category: 'electrical', description: 'Full rewiring & panel upgrade', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop' },
                    { id: 2, title: 'Road Resurfacing', category: 'roads', description: 'Community road repair project', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=400&fit=crop' },
                    { id: 3, title: 'Home Renovation', category: 'renovation', description: 'Complete kitchen remodel', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop' },
                    { id: 4, title: 'New Construction', category: 'construction', description: 'Residential extension build', image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=400&fit=crop' }
                ],
                testimonials: [
                    { id: 1, name: 'John Mbaso', role: 'Business Owner', location: 'Sandton', rating: 5, text: 'AMM handled our office electrical upgrade professionally. They worked after hours to minimize disruption.', date: '2 weeks ago', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop' },
                    { id: 2, name: 'Sarah Nkosi', role: 'Homeowner', location: 'Sandton', rating: 5, text: 'Had a burst pipe at midnight and they came within the hour! Fixed everything quickly.', date: '1 month ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop' },
                    { id: 3, name: 'Michael Peters', role: 'Property Manager', location: 'Pretoria', rating: 5, text: 'They repaved our driveway and fixed drainage issues. Professional and fair pricing.', date: '2 months ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }
                ],
                faq: [
                    { question: 'How quickly can you respond to emergency calls?', answer: 'We offer 24/7 emergency services with a typical response time of 30-60 minutes within our service area.' },
                    { question: 'Do you provide free quotes?', answer: 'Yes! We provide free, no-obligation quotes. For larger jobs, we\'ll visit your site to assess the work needed.' },
                    { question: 'What payment methods do you accept?', answer: 'We accept EFT, cash, and all major credit/debit cards. For larger projects, we offer payment plans.' },
                    { question: 'Are you licensed and insured?', answer: 'Absolutely. We are fully licensed electrical contractors, registered builders, and carry R5M insurance coverage.' },
                    { question: 'Do you offer warranties on your work?', answer: 'Yes, all our work comes with a warranty. Standard repairs: 3 months, renovations: 12 months, new construction: 5 years.' },
                    { question: 'Can you handle commercial projects?', answer: 'Definitely! We handle both residential and commercial projects, from office renovations to road maintenance.' }
                ],
                serviceAreas: ['Sandton', 'Rosebank', 'Bryanston', 'Randburg', 'Midrand', 'Centurion', 'Pretoria', 'Fourways', 'Johannesburg CBD'],
                leads: [],
                bookings: [],
                stats: { years: 15, jobs: 2500, rating: 4.9, reviews: 127 }
            };
            localStorage.setItem('amm_db', JSON.stringify(initialData));
        }
        return JSON.parse(localStorage.getItem('amm_db'));
    },

    get(key) {
        const db = this.init();
        return db[key];
    },

    set(key, value) {
        const db = this.init();
        db[key] = value;
        localStorage.setItem('amm_db', JSON.stringify(db));
        return db;
    },

    addLead(lead) {
        const db = this.init();
        lead.id = Date.now();
        lead.date = new Date().toISOString();
        lead.status = 'New';
        db.leads.unshift(lead);
        localStorage.setItem('amm_db', JSON.stringify(db));
        return lead;
    },

    addBooking(booking) {
        const db = this.init();
        booking.id = Date.now();
        booking.date = new Date().toISOString();
        booking.status = 'Pending';
        db.bookings.unshift(booking);
        localStorage.setItem('amm_db', JSON.stringify(db));
        return booking;
    },

    updateTestimonial(id, updates) {
        const db = this.init();
        const index = db.testimonials.findIndex(t => t.id === id);
        if (index !== -1) {
            db.testimonials[index] = { ...db.testimonials[index], ...updates };
            localStorage.setItem('amm_db', JSON.stringify(db));
        }
        return db.testimonials;
    }
};