/**
 * Premium Dental Landing Page - Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    setupNavbarScroll();
    setupCtaTracking();
    setupCarousel();
});

/**
 * Change navbar styling when scrolling down to support premium glassmorphism
 */
function setupNavbarScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '12px 0';
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            header.style.boxShadow = '0 4px 20px -5px rgba(15, 23, 42, 0.08)';
        } else {
            header.style.padding = '20px 0';
            header.style.backgroundColor = 'rgba(248, 250, 252, 0.85)';
            header.style.boxShadow = 'none';
        }
    });
}

/**
 * Capture CTA clicks to track conversion metrics on the backend API before redirecting to WhatsApp
 */
function setupCtaTracking() {
    const ctaButtons = [
        { id: 'hero-cta-btn', name: 'Hero Main CTA' },
        { id: 'nav-cta-btn', name: 'Navbar Call To Action' },
        { id: 'footer-cta-btn', name: 'Footer Main CTA' },
        { id: 'floating-whatsapp-btn', name: 'Floating WhatsApp Bubble' }
    ];

    ctaButtons.forEach(buttonInfo => {
        const btn = document.getElementById(buttonInfo.id);
        if (!btn) return;

        btn.addEventListener('click', (event) => {
            // Prevent immediate redirection to allow the async tracking call to start
            // (We will open WhatsApp in a new tab anyway as per target="_blank")
            trackLead(buttonInfo.name);
        });
    });
}

/**
 * Call the backend /api/lead endpoint to register a new lead event
 * @param {string} source - The button or location where the CTA was triggered
 */
async function trackLead(source) {
    const payload = {
        source: source,
        timestamp: new Date().toISOString(),
        url: window.location.href
    };

    try {
        console.log(`[Analytics] Registrando lead desde: ${source}...`);
        
        // This endpoint will be resolved by either the Node.js Express server or the Python Flask server
        const response = await fetch('/api/lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('[Analytics] Lead registrado con éxito:', data);
        } else {
            console.warn('[Analytics] Respuesta del servidor no exitosa al registrar lead');
        }
    } catch (error) {
        // Fallback silently if offline or backend is not active, standard click still proceeds
        console.error('[Analytics] Error de red al registrar lead:', error);
    }
}

/**
 * Setup treatment slides carousel logic
 */
function setupCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
    
    const slides = Array.from(track.children);
    const dots = Array.from(dotsContainer.children);
    let currentIndex = 0;
    
    function updateCarousel(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    prevBtn.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
    });
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            updateCarousel(idx);
        });
    });
    
    // Auto slide transition (every 6 seconds)
    let autoSlideInterval = setInterval(() => {
        updateCarousel(currentIndex + 1);
    }, 6000);
    
    const resetInterval = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            updateCarousel(currentIndex + 1);
        }, 6000);
    };
    
    prevBtn.addEventListener('click', resetInterval);
    nextBtn.addEventListener('click', resetInterval);
    dots.forEach(dot => dot.addEventListener('click', resetInterval));
}
