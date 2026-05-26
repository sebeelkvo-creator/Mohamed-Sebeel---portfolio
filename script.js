/* ==========================================================================
   MOHAMED SEBEEL KVO - PORTFOLIO JAVASCRIPT
   Interactivity, Theme Switching, Scroll Reveals, Contact Form, and Resume Modal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollHeader();
    initMobileMenu();
    initScrollReveal();
    initActiveNavHighlight();
    initResumeModal();
    animateInitialFades();
});

/* ==========================================================================
   THEME TOGGLER (DARK / LIGHT MODE)
   ========================================================================== */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check cached theme or system preferences
    const cachedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (cachedTheme === 'light' || (!cachedTheme && systemPrefersLight)) {
        body.setAttribute('data-theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
    }

    // Toggle theme event listener
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        let newTheme = 'dark';

        if (currentTheme === 'dark') {
            newTheme = 'light';
        }

        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================================================
   SCROLL EFFECTS ON HEADER
   ========================================================================== */
function initScrollHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   MOBILE DRAWER NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    menuToggle.addEventListener('click', () => {
        header.classList.toggle('menu-open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && header.classList.contains('menu-open')) {
            header.classList.remove('menu-open');
        }
    });
}

/* ==========================================================================
   SCROLL REVEAL (FADE-IN & SLIDE-UP ANIMATIONS)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills section, animate the progress bars
                if (entry.target.classList.contains('skills-wrapper')) {
                    animateProgressBars();
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

function animateInitialFades() {
    // Manually activate very top elements
    setTimeout(() => {
        const heroElements = document.querySelectorAll('#hero .reveal');
        heroElements.forEach(el => el.classList.add('active'));
    }, 100);
}

/* ==========================================================================
   ACTIVE LINK NAVIGATION HIGHLIGHT ON SCROLL
   ========================================================================== */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 150; // Offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   INTERACTIVE SKILLS TABS SWITCHER
   ========================================================================== */
window.switchSkillTab = function(tabName) {
    // Deactivate all tab buttons
    const tabBtns = document.querySelectorAll('.skills-tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Deactivate all panels
    const panels = document.querySelectorAll('.skills-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    // Activate the clicked button
    const activeBtn = Array.from(tabBtns).find(btn => btn.getAttribute('onclick').includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');

    // Activate the selected panel
    const activePanel = document.getElementById(`skill-panel-${tabName}`);
    if (activePanel) {
        activePanel.classList.add('active');
        
        // Retrigger progress bar animations on tab switch
        const progressFills = activePanel.querySelectorAll('.skill-progress-fill');
        progressFills.forEach(fill => {
            const targetWidth = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = targetWidth;
            }, 50);
        });
    }
}

function animateProgressBars() {
    const progressFills = document.querySelectorAll('.skills-panel.active .skill-progress-fill');
    progressFills.forEach(fill => {
        const targetWidth = fill.getAttribute('style').match(/width:\s*(\d+)%/)[0];
        // Ensure standard animation runs
        fill.setAttribute('style', targetWidth);
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
window.handleFormSubmit = function(event) {
    event.preventDefault();

    const form = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Visual button loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `
        Sending Inquiry... 
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-left: 8px;">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="16"></circle>
        </svg>
    `;

    // Simulate database write / network email transmission delay
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Hide form fields visually, display success overlay inside card
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            successOverlay.style.display = 'flex';
        }, 300);
    }, 1500);
};

window.resetForm = function() {
    const form = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success');

    successOverlay.style.display = 'none';
    form.reset();
    form.style.display = 'block';
    setTimeout(() => {
        form.style.opacity = '1';
    }, 50);
};

/* ==========================================================================
   RESUME / CV MODAL TRIGGER CONTROLS
   ========================================================================== */
function initResumeModal() {
    const backdrop = document.getElementById('resume-modal-backdrop');
    const viewBtn = document.getElementById('view-resume-btn');

    if (!backdrop || !viewBtn) return;

    // Open Modal
    viewBtn.addEventListener('click', () => {
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background page scroll
    });

    // Close Modal on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('active')) {
            closeResumeModal();
        }
    });
}

window.closeResumeModal = function(event) {
    const backdrop = document.getElementById('resume-modal-backdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }
};

/* Simple spin animation injector for button loader */
const styleElement = document.createElement('style');
styleElement.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleElement);
