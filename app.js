/**
 * Sagar's Portfolio Javascript Logic
 * Dynamically populates and controls the portfolio interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check that config is loaded
    if (typeof portfolioConfig === 'undefined') {
        console.error('Portfolio Configuration (config.js) not found!');
        return;
    }

    // --- INIT PORTFOLIO ---
    initTheme();
    renderPortfolioData();
    setupThemeToggle();
    setupNavigationSpy();
    setupMobileMenu();
    setupProjectFilter();
    setupTerminalAnimation();
    setupContactForm();
});

// --- THEME CONTROL & COLOR CONFIG ---
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyThemeColors(savedTheme);
}

function applyThemeColors(theme) {
    const colors = portfolioConfig.themeColors?.[theme];
    if (colors) {
        if (colors.hue !== undefined) {
            document.documentElement.style.setProperty('--base-hue', colors.hue);
        }
        if (colors.accentHue !== undefined) {
            document.documentElement.style.setProperty('--accent-hue', colors.accentHue);
        }
        if (colors.accentAltHue !== undefined) {
            document.documentElement.style.setProperty('--accent-alt-hue', colors.accentAltHue);
        }
    }
}

function setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        applyThemeColors(newTheme);
        
        showToast(`Switched to ${newTheme} mode!`, 'success');
    });
}

// --- DATA RENDERING SYSTEM ---
function renderPortfolioData() {
    const config = portfolioConfig;

    // 1. Header & Brand Names
    const headerName = document.getElementById('header-name');
    const footerName = document.getElementById('footer-name');
    const fullName = `${config.personal.name} ${config.personal.lastName || ''}`.trim();
    if (headerName) headerName.innerText = config.personal.name;
    if (footerName) footerName.innerText = fullName;
    
    // Dynamic title tags & metadata
    document.title = `${fullName} | Portfolio`;

    // 2. Hero Section
    const heroNameEl = document.getElementById('hero-name-display');
    const heroTitleEl = document.getElementById('hero-title-display');
    const heroDescEl = document.getElementById('hero-desc-display');
    if (heroNameEl) heroNameEl.innerText = fullName;
    if (heroTitleEl) heroTitleEl.innerText = config.personal.title;
    if (heroDescEl) heroDescEl.innerText = config.personal.tagline;

    // 3. About Section
    const aboutBioEl = document.getElementById('about-bio-text');
    if (aboutBioEl) aboutBioEl.innerText = config.personal.bio;
    
    // Avatar Config
    const initialsEl = document.getElementById('avatar-initials');
    const avatarPlaceholder = document.getElementById('bio-avatar-placeholder');
    if (config.personal.avatar && avatarPlaceholder) {
        avatarPlaceholder.innerHTML = `<img src="${config.personal.avatar}" alt="${fullName}'s Headshot">`;
    } else if (initialsEl) {
        // Fallback initials
        const initialText = config.personal.name.charAt(0) + (config.personal.lastName ? config.personal.lastName.charAt(0) : '');
        initialsEl.innerText = initialText.toUpperCase();
    }

    // About Social Links
    const aboutLinkedin = document.getElementById('about-linkedin');
    const aboutGithub = document.getElementById('about-github');
    const aboutResume = document.getElementById('about-resume');
    
    if (aboutLinkedin) aboutLinkedin.href = config.personal.linkedin || '#';
    if (aboutGithub) aboutGithub.href = config.personal.github || '#';
    if (aboutResume) {
        if (config.personal.resumeUrl && config.personal.resumeUrl !== '#') {
            aboutResume.href = config.personal.resumeUrl;
            aboutResume.style.display = 'inline-flex';
        } else {
            aboutResume.style.display = 'none';
        }
    }

    // Stats rendering
    const statsGrid = document.getElementById('about-stats-grid');
    if (statsGrid && config.stats) {
        statsGrid.innerHTML = '';
        config.stats.forEach(stat => {
            const card = document.createElement('div');
            card.className = 'glass-card stat-card';
            card.innerHTML = `
                <span class="stat-val">${stat.value}</span>
                <span class="stat-lbl">${stat.label}</span>
            `;
            statsGrid.appendChild(card);
        });
    }

    // 4. Skills Section
    const skillsGrid = document.getElementById('skills-categories-grid');
    if (skillsGrid && config.skills) {
        skillsGrid.innerHTML = '';
        Object.keys(config.skills).forEach(key => {
            const category = config.skills[key];
            const card = document.createElement('div');
            card.className = 'glass-card skill-category-card';
            
            let tagsHtml = '';
            category.items.forEach(item => {
                tagsHtml += `<span class="skill-tag">${item}</span>`;
            });

            card.innerHTML = `
                <h3>${category.title}</h3>
                <div class="skills-list">
                    ${tagsHtml}
                </div>
            `;
            skillsGrid.appendChild(card);
        });
    }

    // 5. Projects Section
    const projectsRenderGrid = document.getElementById('projects-render-grid');
    if (projectsRenderGrid && config.projects) {
        projectsRenderGrid.innerHTML = '';
        config.projects.forEach(proj => {
            const card = document.createElement('article');
            card.className = 'glass-card project-card';
            card.dataset.category = proj.category;

            let techHtml = '';
            proj.techStack.forEach(t => {
                techHtml += `<span class="project-tech-tag">${t}</span>`;
            });

            // Metric block if defined
            const metricHtml = proj.keyMetric 
                ? `<div class="project-metric">${proj.keyMetric}</div>` 
                : '';

            // Folder icon SVG
            const folderIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
            const githubIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
            const externalLinkIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>`;

            let linksHtml = '';
            if (proj.githubLink && proj.githubLink !== '#') {
                linksHtml += `<a href="${proj.githubLink}" target="_blank" class="project-link-btn" title="GitHub Source" aria-label="View Github source">${githubIcon}</a>`;
            }
            if (proj.liveLink && proj.liveLink !== '#') {
                linksHtml += `<a href="${proj.liveLink}" target="_blank" class="project-link-btn" title="Live Demo" aria-label="View Live demo">${externalLinkIcon}</a>`;
            }

            card.innerHTML = `
                <div class="project-header">
                    <div class="project-icon">${folderIcon}</div>
                    <div class="project-links">${linksHtml}</div>
                </div>
                <h3 class="project-title">${proj.title}</h3>
                <p class="project-desc">${proj.description}</p>
                ${metricHtml}
                <div class="project-tech">${techHtml}</div>
            `;
            projectsRenderGrid.appendChild(card);
        });
    }

    // 6. Achievements Section
    const timelineEl = document.getElementById('achievements-timeline');
    if (timelineEl && config.achievements) {
        timelineEl.innerHTML = '';
        config.achievements.forEach((ach, index) => {
            const item = document.createElement('div');
            const alignmentClass = index % 2 === 0 ? 'left-item' : 'right-item';
            item.className = `timeline-item ${alignmentClass}`;
            
            item.innerHTML = `
                <div class="glass-card timeline-content">
                    <div class="timeline-date">${ach.date}</div>
                    <h3 class="timeline-title">${ach.title}</h3>
                    <div class="timeline-issuer">${ach.issuer}</div>
                    <p class="timeline-desc">${ach.description}</p>
                </div>
            `;
            timelineEl.appendChild(item);
        });
    }

    // 7. Contact Details Info
    const contactEmailLink = document.getElementById('contact-email-link');
    const contactLinkedinLink = document.getElementById('contact-linkedin-link');
    const contactGithubLink = document.getElementById('contact-github-link');

    if (contactEmailLink) {
        contactEmailLink.href = `mailto:${config.personal.email}`;
        contactEmailLink.innerText = config.personal.email;
    }
    if (contactLinkedinLink) {
        contactLinkedinLink.href = config.personal.linkedin || '#';
    }
    if (contactGithubLink) {
        contactGithubLink.href = config.personal.github || '#';
        contactGithubLink.innerText = config.personal.github ? config.personal.github.replace('https://', '') : 'github.com';
    }

    // Set footer dynamic year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }
}

// --- SCROLL SPY ACTIVE LINK INDICATOR ---
function setupNavigationSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyOptions = {
        rootMargin: '-30% 0px -70% 0px' // Trigger active state when section is centered
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, spyOptions);

    sections.forEach(section => observer.observe(section));
}

// --- MOBILE MENU DRAWER ---
function setupMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileBtn || !navMenu) return;

    function toggleMenu() {
        mobileBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
        
        // Prevent background scrolling when mobile menu open
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileBtn.addEventListener('click', toggleMenu);

    // Close mobile menu when nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
}

// --- PROJECT CARDS INTERACTIVE FILTER ---
function setupProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Toggle active button class
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.dataset.filter;
            const projectCards = document.querySelectorAll('.project-card');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                } else {
                    card.classList.remove('fade-in');
                    card.classList.add('fade-out');
                }
            });
        });
    });
}

// --- INTERACTIVE MONOSPACE TERMINAL CONTROLLER ---
function setupTerminalAnimation() {
    const codeArea = document.getElementById('terminal-code-area');
    const tabTitle = document.getElementById('terminal-tab-title');
    if (!codeArea) return;

    const config = portfolioConfig;
    
    // Gather primary dynamic values for terminal mockup
    const devName = config.personal.name.toLowerCase();
    const devSkills = config.skills.devops?.items?.slice(0, 3) || ["Linux", "Docker", "Ansible"];
    const fileExt = "json";
    if (tabTitle) tabTitle.innerText = `${devName}.${fileExt}`;
    
    // Construct the mock content string
    const linesToType = [
        `{`,
        `  "engineer": "${config.personal.name}",`,
        `  "role": "devops_automation",`,
        `  "platforms": [`,
        `    ${devSkills.map(s => `"${s}"`).join(',\n    ')}`,
        `  ],`,
        `  "focus": "deployment_pipelines",`,
        `  "certification": "${config.stats?.[0]?.value || 'RHCSA'}",`,
        `  "status": "pursuing_rhce"`,
        `}`
    ];

    const fullContent = linesToType.join('\n');
    let currentCharIndex = 0;
    codeArea.innerText = '';

    // Simple typing tick function
    function typeTick() {
        if (currentCharIndex < fullContent.length) {
            codeArea.innerText = fullContent.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            // Vary writing speed slightly for realism (faster coding, slower braces)
            const nextChar = fullContent.charAt(currentCharIndex);
            let delay = 15;
            if (nextChar === '\n') delay = 100;
            if (nextChar === ',' || nextChar === ':') delay = 50;
            setTimeout(typeTick, delay);
        }
    }
    
    // Start the animation
    setTimeout(typeTick, 600);
}

// --- CONTACT FORM HANDLER WITH VALIDATION ---
function setupContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;

        // Name field check
        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('error');
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove('error');
        }

        // Subject field check
        if (!subjectInput.value.trim()) {
            subjectInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            subjectInput.parentElement.classList.remove('error');
        }

        // Message field check
        if (!messageInput.value.trim()) {
            messageInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            messageInput.parentElement.classList.remove('error');
        }

        if (isValid) {
            // Capture submission and trigger notification toast
            const senderName = nameInput.value.trim();
            showToast(`Thank you, ${senderName}! Your message was simulated successfully.`, 'success');
            
            // Reset the form values
            form.reset();
        } else {
            showToast('Please correct the highlighted form validation errors.', 'error');
        }
    });

    // Remove error validation outline dynamically as user types
    const inputs = [nameInput, emailInput, subjectInput, messageInput];
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.parentElement.classList.remove('error');
                }
            });
        }
    });
}

// --- DYNAMIC TOAST NOTIFICATION CONTAINER HELPER ---
function showToast(message, type = 'success') {
    const toastBox = document.getElementById('toast-box');
    if (!toastBox) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Checkmark or cross icons depending on toast classification
    const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27c93f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    const crossIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5f56" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    const closeSymbol = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    
    const icon = type === 'success' ? checkIcon : crossIcon;

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            ${icon}
            <span class="toast-content">${message}</span>
        </div>
        <span class="toast-close" aria-label="Dismiss message">${closeSymbol}</span>
    `;

    toastBox.appendChild(toast);

    // Click listener to dismiss toast manually
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    // Auto dismiss toast after 4000ms
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 4000);
}
