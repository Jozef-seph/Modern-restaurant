// ============================================
// MODERN RESTAURANT WEBSITE - INTERACTIVITY
// ============================================

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');
const reservationForm = document.querySelector('.reservation-form');
const menuButtons = document.querySelectorAll('.menu-btn');
const menuContents = document.querySelectorAll('.menu-content');
const navLinks = document.querySelectorAll('.nav-menu a');
const floatingBtn = document.querySelector('.floating-btn');

// ============================================
// NAVIGATION TOGGLE (MOBILE)
// ============================================

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// MENU TOGGLE (DINNER/LUNCH)
// ============================================

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        menuButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get the menu type from data attribute
        const menuType = button.getAttribute('data-menu');
        
        // Hide all menu contents
        menuContents.forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show selected menu
        const selectedMenu = document.getElementById(`${menuType}-menu`);
        if (selectedMenu) {
            selectedMenu.classList.remove('hidden');
            // Add fade-in animation
            selectedMenu.style.animation = 'fadeIn 0.5s ease-out';
        }
    });
});

// ============================================
// RESERVATION FORM HANDLING
// ============================================

if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            specialRequests: document.getElementById('special-requests').value
        };
        
        // Validate form
        if (!formData.date || !formData.time || !formData.guests || !formData.name || !formData.email || !formData.phone) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate date (must be in the future)
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date.', 'error');
            return;
        }
        
        // Submit to backend API
        const submitButton = reservationForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Send data to backend API
        fetch('/api/reservations', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification(data.message || 'Reservation submitted successfully! We will contact you shortly to confirm.', 'success');
                reservationForm.reset();
            } else {
                showNotification(data.message || 'Error submitting reservation. Please try again.', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Error connecting to server. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    });
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#D4AF37' : '#ff4444'};
        color: ${type === 'success' ? '#0E0E0E' : '#FFFFFF'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 600;
    `;
    
    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ============================================
// SET MINIMUM DATE FOR RESERVATION FORM
// ============================================

const dateInput = document.getElementById('date');
if (dateInput) {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ============================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section > .container').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Observe dish cards, menu items, gallery items, and review cards
document.querySelectorAll('.dish-card, .menu-item, .gallery-item, .review-card').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(item);
});

// ============================================
// GALLERY LIGHTBOX (OPTIONAL ENHANCEMENT)
// ============================================

const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
                animation: fadeIn 0.3s ease-out;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src.replace('w=600&h=600&fit=crop', 'w=1200&h=1200&fit=crop');
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            // Close on click
            lightbox.addEventListener('click', () => {
                lightbox.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => lightbox.remove(), 300);
            });
            
            // Close on Escape key
            const closeLightbox = (e) => {
                if (e.key === 'Escape') {
                    lightbox.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                        lightbox.remove();
                        document.removeEventListener('keydown', closeLightbox);
                    }, 300);
                }
            };
            document.addEventListener('keydown', closeLightbox);
        }
    });
});

// ============================================
// FLOATING BUTTON VISIBILITY (disabled: button removed)
// ============================================

if (floatingBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            floatingBtn.style.opacity = '1';
            floatingBtn.style.transform = 'scale(1)';
        } else {
            floatingBtn.style.opacity = '0.7';
            floatingBtn.style.transform = 'scale(0.9)';
        }
    });

    // Initialize floating button
    floatingBtn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    floatingBtn.style.opacity = '0.7';
}

// ============================================
// LAZY LOADING FOR IMAGES (PERFORMANCE)
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// FORM VALIDATION ENHANCEMENTS
// ============================================

// Real-time email validation
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            emailInput.style.borderColor = '#ff4444';
            showNotification('Please enter a valid email address.', 'error');
        } else {
            emailInput.style.borderColor = 'transparent';
        }
    });
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = value.match(/.{1,3}/g).join(' ');
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
        }
        e.target.value = value;
    });
}

// ============================================
// CHATBOT FUNCTIONALITY
// ============================================

const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');

// Chatbot responses
const chatbotResponses = {
    greetings: ['Hello!', 'Hi there!', 'Hey!', 'Greetings!'],
    hours: 'We are open Monday-Thursday: 11:30 AM - 10:00 PM, Friday-Saturday: 11:30 AM - 11:00 PM, and Sunday: 12:00 PM - 9:00 PM.',
    menu: 'We offer a variety of dishes including starters, mains, drinks, and desserts. You can view our full menu on the website or ask me about specific dishes!',
    reservation: 'You can make a reservation by filling out the form on our website or by calling us at +61 2 1234 5678. Would you like me to help you with a reservation?',
    location: 'We are located at 123 Modern Street, Sydney, NSW 2000, Australia. We also have complimentary valet parking available.',
    contact: 'You can reach us at +61 2 1234 5678 or email us at hello@modernrestaurant.com.au. We\'d love to hear from you!',
    default: 'I\'m here to help! You can ask me about our menu, hours, reservations, location, or contact information. How can I assist you?'
};

// Toggle chatbot
if (chatbotToggle) {
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
        }
    });
}

// Close chatbot
if (chatbotClose) {
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
}

// Quick reply buttons
quickReplyButtons.forEach(button => {
    button.addEventListener('click', () => {
        const message = button.getAttribute('data-message');
        sendUserMessage(message);
    });
});

// Send message function
function sendUserMessage(message) {
    if (!message.trim()) return;

    // Add user message
    addMessage(message, 'user');
    
    // Disable input while processing
    chatbotInput.disabled = true;
    chatbotSend.disabled = true;
    
    // Simulate typing delay
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
        chatbotInput.disabled = false;
        chatbotSend.disabled = false;
        chatbotInput.focus();
    }, 1000);
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${type}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `<p>${text}</p>`;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Get bot response based on user message
function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/hello|hi|hey|greetings|good morning|good afternoon|good evening/)) {
        return chatbotResponses.greetings[Math.floor(Math.random() * chatbotResponses.greetings.length)] + ' ' + chatbotResponses.default;
    }
    
    // Check for hours
    if (lowerMessage.match(/hours?|open|close|when|time|schedule/)) {
        return chatbotResponses.hours;
    }
    
    // Check for menu
    if (lowerMessage.match(/menu|food|dish|dishes|what.*serve|eat|order/)) {
        return chatbotResponses.menu;
    }
    
    // Check for reservation
    if (lowerMessage.match(/reservation|book|table|reserve|booking/)) {
        return chatbotResponses.reservation;
    }
    
    // Check for location
    if (lowerMessage.match(/location|address|where|directions|map|find/)) {
        return chatbotResponses.location;
    }
    
    // Check for contact
    if (lowerMessage.match(/contact|phone|email|call|reach|number/)) {
        return chatbotResponses.contact;
    }
    
    // Default response
    return chatbotResponses.default;
}

// Send button click
if (chatbotSend) {
    chatbotSend.addEventListener('click', () => {
        const message = chatbotInput.value.trim();
        if (message) {
            sendUserMessage(message);
            chatbotInput.value = '';
        }
    });
}

// Enter key to send
if (chatbotInput) {
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const message = chatbotInput.value.trim();
            if (message) {
                sendUserMessage(message);
                chatbotInput.value = '';
            }
        }
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
    
    // Set today's date as minimum for date picker
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
    
    console.log('Modern Restaurant Website - Ready!');
});


