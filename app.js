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
    initCustomAccentColor();
    renderPortfolioData();
    setupThemeToggle();
    setupNavigationSpy();
    setupMobileMenu();
    setupProjectFilter();
    setupInteractiveTerminal();
    setupCustomizer();
    setupCursorGlow();
    setupScrollReveal();
    setupContactForm();
    setupModalHandlers();
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
        if (colors.hue !== undefined && !localStorage.getItem('portfolio-accent-hue')) {
            document.documentElement.style.setProperty('--base-hue', colors.hue);
        }
        if (colors.accentHue !== undefined && !localStorage.getItem('portfolio-accent-hue')) {
            document.documentElement.style.setProperty('--accent-hue', colors.accentHue);
        }
        if (colors.accentAltHue !== undefined && !localStorage.getItem('portfolio-accent-hue')) {
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

// --- LIVE ACCENT COLOR CUSTOMIZER ---
function initCustomAccentColor() {
    const savedHue = localStorage.getItem('portfolio-accent-hue');
    if (savedHue) {
        document.documentElement.style.setProperty('--accent-hue', savedHue);
        document.documentElement.style.setProperty('--accent-alt-hue', (parseInt(savedHue) - 15 + 360) % 360);
    }
}

function setupCustomizer() {
    const panel = document.getElementById('customizer-panel');
    const toggleBtn = document.getElementById('customizer-toggle');
    const closeBtn = document.getElementById('customizer-close');
    const slider = document.getElementById('accent-hue-slider');
    const hueDisplay = document.getElementById('hue-value-display');
    const resetBtn = document.getElementById('reset-color-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');

    if (!panel || !toggleBtn) return;

    // Toggle Customizer Panel
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('open');
        });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && e.target !== toggleBtn) {
            panel.classList.remove('open');
        }
    });

    // Initialize customizer elements state
    const currentHue = localStorage.getItem('portfolio-accent-hue') || 190;
    if (slider) slider.value = currentHue;
    if (hueDisplay) hueDisplay.innerText = currentHue;

    // Range slider interaction
    if (slider) {
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            updateAccentHue(val);
        });
    }

    // Presets click interaction
    presetBtns.forEach(btn => {
        const hue = btn.dataset.hue;
        btn.addEventListener('click', () => {
            updateAccentHue(hue);
        });
        
        // Highlight active preset
        if (parseInt(hue) === parseInt(currentHue)) {
            btn.classList.add('active');
        }
    });

    // Reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            localStorage.removeItem('portfolio-accent-hue');
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            
            // Reapply config defaults
            const colors = portfolioConfig.themeColors?.[currentTheme];
            if (colors) {
                document.documentElement.style.setProperty('--accent-hue', colors.accentHue);
                document.documentElement.style.setProperty('--accent-alt-hue', colors.accentAltHue);
                if (slider) slider.value = colors.accentHue;
                if (hueDisplay) hueDisplay.innerText = colors.accentHue;
            }
            
            presetBtns.forEach(b => b.classList.remove('active'));
            showToast('Accent colors reset to default!', 'success');
        });
    }

    function updateAccentHue(hue) {
        document.documentElement.style.setProperty('--accent-hue', hue);
        document.documentElement.style.setProperty('--accent-alt-hue', (parseInt(hue) - 15 + 360) % 360);
        localStorage.setItem('portfolio-accent-hue', hue);
        
        if (slider) slider.value = hue;
        if (hueDisplay) hueDisplay.innerText = hue;

        // Manage active states for presets
        presetBtns.forEach(btn => {
            if (parseInt(btn.dataset.hue) === parseInt(hue)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// --- DYNAMIC DATA RENDERING SYSTEM ---
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
        config.projects.forEach((proj, idx) => {
            const card = document.createElement('article');
            card.className = 'glass-card project-card';
            card.dataset.category = proj.category;
            card.dataset.index = idx;

            let techHtml = '';
            proj.techStack.forEach(t => {
                techHtml += `<span class="project-tech-tag">${t}</span>`;
            });

            const metricHtml = proj.keyMetric 
                ? `<div class="project-metric">${proj.keyMetric}</div>` 
                : '';

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
                <div style="margin-top: 15px; font-size: 0.8rem; display: flex; align-items: center; gap: 4px; color: var(--primary-color); font-weight: 600;">
                    <span>View details</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </div>
            `;
            projectsRenderGrid.appendChild(card);
            
            // Attach modal trigger click listener
            card.addEventListener('click', (e) => {
                if (e.target.closest('.project-links')) return;
                openProjectModal(proj);
            });
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

    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.innerText = new Date().getFullYear();
    }
}

// --- PROJECT DETAIL MODALS HANDLING ---
function setupModalHandlers() {
    const modal = document.getElementById('project-details-modal');
    const closeBtn = document.getElementById('modal-close');

    if (!modal) return;

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    // Close on click backdrop
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            modal.classList.remove('open');
        }
    });
}

function openProjectModal(proj) {
    const modal = document.getElementById('project-details-modal');
    if (!modal) return;

    const badge = document.getElementById('modal-project-badge');
    const title = document.getElementById('modal-project-title');
    const techStack = document.getElementById('modal-tech-stack');
    const desc = document.getElementById('modal-project-desc');
    const challenges = document.getElementById('modal-project-challenges');
    const archCode = document.getElementById('modal-architecture-code');
    const githubBtn = document.getElementById('modal-github-link-btn');
    const liveBtn = document.getElementById('modal-live-link-btn');

    if (badge) {
        badge.innerText = proj.category === 'systems' ? 'Systems & DevOps' : 'Web & Cloud';
    }
    if (title) title.innerText = proj.title;
    if (desc) desc.innerText = proj.modalDetails?.longDescription || proj.description;
    if (challenges) challenges.innerText = proj.modalDetails?.challenges || 'Standard configurations with firewalls and automated validation.';
    if (archCode) {
        archCode.innerText = proj.modalDetails?.architecture || `[Local Server Host] --> [POSIX Network API]`;
    }

    if (techStack) {
        techStack.innerHTML = '';
        proj.techStack.forEach(t => {
            const s = document.createElement('span');
            s.className = 'project-tech-tag';
            s.innerText = t;
            techStack.appendChild(s);
        });
    }

    if (githubBtn) {
        if (proj.githubLink && proj.githubLink !== '#') {
            githubBtn.href = proj.githubLink;
            githubBtn.style.display = 'inline-flex';
        } else {
            githubBtn.style.display = 'none';
        }
    }

    if (liveBtn) {
        if (proj.liveLink && proj.liveLink !== '#') {
            liveBtn.href = proj.liveLink;
            liveBtn.style.display = 'inline-flex';
        } else {
            liveBtn.style.display = 'none';
        }
    }

    modal.classList.add('open');
}

// --- INTERACTIVE MONOSPACE TERMINAL CONTROLLER ---
function setupInteractiveTerminal() {
    const consoleBody = document.getElementById('terminal-console-body');
    const stdout = document.getElementById('terminal-stdout');
    const hiddenInput = document.getElementById('terminal-hidden-input');
    const displayTyped = document.getElementById('terminal-typed-content');
    const terminalCard = document.getElementById('interactive-terminal');
    const tabTitle = document.getElementById('terminal-tab-title');

    if (!consoleBody || !hiddenInput || !stdout) return;

    const config = portfolioConfig;
    const devName = config.personal.name.toLowerCase();
    if (tabTitle) tabTitle.innerText = `${devName}.sh`;

    // Click anywhere on terminal card focuses input
    if (terminalCard) {
        terminalCard.addEventListener('click', () => {
            hiddenInput.focus();
        });
    }

    // Sync hidden input with visual custom caret line
    hiddenInput.addEventListener('input', () => {
        displayTyped.innerText = hiddenInput.value;
        consoleBody.scrollTop = consoleBody.scrollHeight;
    });

    // Capture CLI keyboard keys
    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = hiddenInput.value;
            const cleanVal = rawVal.trim().toLowerCase();
            
            // Execute CLI parse
            hiddenInput.value = '';
            displayTyped.innerText = '';
            
            executeTerminalCommand(rawVal, cleanVal);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleTerminalTabCompletion();
        }
    });

    // Clicking hint commands triggers them instantly
    document.querySelectorAll('.hint-cmd').forEach(hint => {
        hint.addEventListener('click', (e) => {
            e.stopPropagation();
            const cmd = hint.innerText;
            hiddenInput.value = cmd;
            displayTyped.innerText = cmd;
            hiddenInput.focus();
            
            // Auto run hint command after a short visual delay
            setTimeout(() => {
                hiddenInput.value = '';
                displayTyped.innerText = '';
                executeTerminalCommand(cmd, cmd.trim().toLowerCase());
            }, 300);
        });
    });

    // Boot sequence type-writer mock
    let bootCmd = 'neofetch';
    let charIndex = 0;
    hiddenInput.setAttribute('disabled', 'true');

    function typeBoot() {
        if (charIndex < bootCmd.length) {
            displayTyped.innerText = bootCmd.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeBoot, 100);
        } else {
            // Trigger boot command neofetch automatically
            setTimeout(() => {
                displayTyped.innerText = '';
                hiddenInput.removeAttribute('disabled');
                executeTerminalCommand('neofetch', 'neofetch');
                hiddenInput.focus();
            }, 400);
        }
    }

    // Start boot script after section renders
    setTimeout(typeBoot, 1000);

    // List of completions
    const commandsList = ['help', 'neofetch', 'about', 'skills', 'projects', 'contact', 'clear', 'theme', 'sudo'];

    function handleTerminalTabCompletion() {
        const val = hiddenInput.value.trim().toLowerCase();
        if (!val) return;

        const match = commandsList.find(cmd => cmd.startsWith(val));
        if (match) {
            hiddenInput.value = match;
            displayTyped.innerText = match;
        }
    }

    function executeTerminalCommand(rawText, cleanText) {
        // Create command line in stdout
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-stdout-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">[visitor@sagar-linux ~]$</span> <span class="terminal-stdout-cmd">${rawText}</span>`;
        stdout.appendChild(cmdLine);

        // Parse command options
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-stdout-line terminal-stdout-response';

        const args = cleanText.split(' ');
        const mainCommand = args[0];

        switch (mainCommand) {
            case 'clear':
                stdout.innerHTML = '';
                consoleBody.scrollTop = 0;
                return;

            case 'help':
                responseLine.innerHTML = `Available CLI Commands:
  <span class="terminal-accent-text">neofetch</span>    - Print beautiful systems specifications
  <span class="terminal-accent-text">about</span>       - Show Sagar's biography
  <span class="terminal-accent-text">skills</span>      - Display Technical expertise profile
  <span class="terminal-accent-text">projects</span>    - List selected coding/systems projects
  <span class="terminal-accent-text">project [n]</span> - Inspect project details (e.g. 'project 1')
  <span class="terminal-accent-text">contact</span>     - Display email and profile handles
  <span class="terminal-accent-text">theme</span>       - Toggle visual color theme mode
  <span class="terminal-accent-text">clear</span>       - Clear terminal console screen`;
                break;

            case 'neofetch':
                const skillsList = config.skills.devops?.items?.slice(0, 3) || [];
                responseLine.innerHTML = `
<span class="terminal-accent-text">           .---.        </span> <span class="terminal-success-text">OS</span>: Red Hat Enterprise Linux (RHEL) / Local
<span class="terminal-accent-text">          /     \\\\       </span> <span class="terminal-success-text">Host</span>: ${config.personal.name}'s Interactive Portfolio Terminal
<span class="terminal-accent-text">          \\\\.@-@./       </span> <span class="terminal-success-text">Kernel</span>: Custom Systems Shell v2.1
<span class="terminal-accent-text">          /\`\\\\_/\`\\\\       </span> <span class="terminal-success-text">Uptime</span>: B.Tech CSE Years
<span class="terminal-accent-text">         //  _  \\\\\\\\      </span> <span class="terminal-success-text">Shell</span>: Bash (Custom Prompt Shell)
<span class="terminal-accent-text">        | \\\\     / |     </span> <span class="terminal-success-text">Certifications</span>: RHCSA (2025), AZ-900 (2025)
<span class="terminal-accent-text">       (|  \`---\`  |)    </span> <span class="terminal-success-text">Core Tools</span>: ${skillsList.join(', ')}
<span class="terminal-accent-text">       / \\\\__...__/ \\\\    </span> <span class="terminal-success-text">GPA</span>: 7.0/10
<span class="terminal-accent-text">      /  ________   \\\\   </span> 
<span class="terminal-accent-text">     /  /        \\\\   \\\\  </span> Type 'help' to see command descriptions.
<span class="terminal-accent-text">    /  /          \\\\   \\\\ </span> 
`;
                break;

            case 'about':
                responseLine.innerHTML = `[ <span class="terminal-accent-text">${config.personal.name} ${config.personal.lastName || ''}</span> - Systems Specialist ]
${config.personal.title}
--------------------------------------------------
${config.personal.bio}`;
                break;

            case 'skills':
                let skHtml = `Technical Expertise Matrix:\n`;
                Object.keys(config.skills).forEach(catKey => {
                    const category = config.skills[catKey];
                    skHtml += `\n* <span class="terminal-accent-text">${category.title}</span>:\n  - ${category.items.join('\n  - ')}`;
                });
                responseLine.innerHTML = skHtml;
                break;

            case 'projects':
                let projHtml = `Selected Projects List:\n`;
                config.projects.forEach((p, idx) => {
                    projHtml += `  [<span class="terminal-accent-text">${idx + 1}</span>] ${p.title} (${p.techStack.join(', ')})\n`;
                });
                projHtml += `\nType 'project [index]' (e.g. 'project 1') to view details inside a graphical spotlight window!`;
                responseLine.innerHTML = projHtml;
                break;

            case 'project':
                const idx = parseInt(args[1]) - 1;
                if (!isNaN(idx) && idx >= 0 && idx < config.projects.length) {
                    const p = config.projects[idx];
                    responseLine.innerHTML = `<span class="terminal-success-text">Successfully mapped project endpoint. Opening Spotlight details for "${p.title}"...</span>`;
                    setTimeout(() => {
                        openProjectModal(p);
                    }, 500);
                } else {
                    responseLine.innerHTML = `<span class="terminal-error-text">Error: Invalid project index. Usage: project [1-${config.projects.length}]. Type 'projects' to check indexing.</span>`;
                }
                break;

            case 'contact':
                responseLine.innerHTML = `Contact coordinates:
  - Email:    <span class="terminal-accent-text">${config.personal.email}</span>
  - LinkedIn: <span class="terminal-accent-text">${config.personal.linkedin}</span>
  - GitHub:   <span class="terminal-accent-text">${config.personal.github}</span>`;
                break;

            case 'theme':
                responseLine.innerHTML = `<span class="terminal-success-text">Triggering theme flip command...</span>`;
                const themeBtn = document.getElementById('theme-toggle');
                if (themeBtn) {
                    setTimeout(() => {
                        themeBtn.click();
                    }, 200);
                }
                break;

            case 'sudo':
                responseLine.innerHTML = `<span class="terminal-error-text">visitor is not in the sudoers file. This incident will be reported to the system administrator.</span>`;
                break;

            default:
                if (cleanText === '') {
                    responseLine.innerHTML = '';
                } else {
                    responseLine.innerHTML = `<span class="terminal-error-text">bash: command not found: ${rawText}. Type <span class="terminal-accent-text">'help'</span> to view options.</span>`;
                }
                break;
        }

        stdout.appendChild(responseLine);
        consoleBody.scrollTop = consoleBody.scrollHeight;
    }
}

// --- DYNAMIC CARD POINTER MOUSE GLOW ---
function setupCursorGlow() {
    // Glow effect coordinates tracking
    document.addEventListener('mousemove', (e) => {
        const target = e.target.closest('.project-card, .stat-card, .skill-category-card');
        if (target) {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            target.style.setProperty('--mouse-x', `${x}px`);
            target.style.setProperty('--mouse-y', `${y}px`);
        }
    });
}

// --- SCROLL REVEAL STAGGER HANDLER ---
function setupScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.about-bio-panel, .stats-panel, .skill-category-card, .project-card, .timeline-item, .contact-details-panel, .contact-form-panel'
    );

    revealTargets.forEach(el => {
        el.classList.add('reveal-element');
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target); // Run animation once
            }
        });
    }, observerOptions);

    revealTargets.forEach(el => {
        revealObserver.observe(el);
    });
}

// --- SCROLL SPY ACTIVE LINK INDICATOR ---
function setupNavigationSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const spyOptions = {
        rootMargin: '-30% 0px -70% 0px'
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
        
        if (navMenu.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    mobileBtn.addEventListener('click', toggleMenu);

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

        if (!nameInput.value.trim()) {
            nameInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            nameInput.parentElement.classList.remove('error');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove('error');
        }

        if (!subjectInput.value.trim()) {
            subjectInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            subjectInput.parentElement.classList.remove('error');
        }

        if (!messageInput.value.trim()) {
            messageInput.parentElement.classList.add('error');
            isValid = false;
        } else {
            messageInput.parentElement.classList.remove('error');
        }

        if (isValid) {
            const senderName = nameInput.value.trim();
            showToast(`Thank you, ${senderName}! Your message was simulated successfully.`, 'success');
            form.reset();
        } else {
            showToast('Please correct the highlighted form validation errors.', 'error');
        }
    });

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

    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 4000);
}
