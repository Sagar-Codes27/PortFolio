import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  Activity, 
  Folder, 
  Github, 
  Linkedin, 
  ExternalLink, 
  FileText, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Send,
  CheckCircle,
  AlertTriangle,
  Play,
  Square,
  ArrowRight
} from 'lucide-react';
import { portfolioConfig } from './portfolioConfig';

function App() {
  const config = portfolioConfig;

  // --- STATE HOOKS ---
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [activeTab, setActiveTab] = useState('cli'); // 'cli' or 'gui'
  const [projectFilter, setProjectFilter] = useState('all');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Terminal States
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInputValue, setTerminalInputValue] = useState('');
  const [terminalTypedBuffer, setTerminalTypedBuffer] = useState('');
  const [isTerminalBooted, setIsTerminalBooted] = useState(false);

  // System Monitor States
  const [cpuLoad, setCpuLoad] = useState(12);
  const [ramLoad, setRamLoad] = useState(2.4);
  const [services, setServices] = useState({
    firewalld: true,
    nginx: true,
    docker: true,
    sshd: true
  });

  // Contact Form States
  const [formInput, setFormInput] = useState({ name: '', email: '', subject: '', message: '' });
  const [formErrors, setFormErrors] = useState({ name: false, email: false, subject: false, message: false });

  // Refs
  const terminalInputRef = useRef(null);
  const consoleBodyRef = useRef(null);

  // --- THEME SYNC ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  // --- RESOURCES SIMULATION ---
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'gui') {
        // CPU oscillates between 8% and 24%
        setCpuLoad(Math.floor(Math.random() * 16) + 8);
        // RAM oscillates between 2.3 GB and 2.7 GB
        setRamLoad(parseFloat((Math.random() * 0.4 + 2.3).toFixed(2)));
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [activeTab]);

  // --- TERMINAL BOOT SEQUENCE ---
  useEffect(() => {
    let timer1, timer2;
    // Simulate typewriter for boot command
    const bootCmd = 'neofetch';
    let index = 0;

    const typeWriter = () => {
      if (index < bootCmd.length) {
        setTerminalTypedBuffer(bootCmd.substring(0, index + 1));
        index++;
        timer1 = setTimeout(typeWriter, 100);
      } else {
        // Wait and run command
        timer2 = setTimeout(() => {
          setTerminalTypedBuffer('');
          setIsTerminalBooted(true);
          handleRunCommand('neofetch');
        }, 400);
      }
    };

    timer1 = setTimeout(typeWriter, 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Scroll terminal log on update
  useEffect(() => {
    if (consoleBodyRef.current) {
      consoleBodyRef.current.scrollTop = consoleBodyRef.current.scrollHeight;
    }
  }, [terminalHistory, terminalTypedBuffer]);

  // --- TOAST NOTIFICATIONS HELPER ---
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- SYSTEMD SERVICES CONTROLLER ---
  const toggleService = (svcName) => {
    const willActive = !services[svcName];
    setServices((prev) => ({ ...prev, [svcName]: willActive }));
    
    if (willActive) {
      addToast(`systemctl start ${svcName}.service`, 'success');
    } else {
      addToast(`systemctl stop ${svcName}.service`, 'success');
      if (svcName === 'firewalld') {
        addToast('CRITICAL: Firewall stopped. Security profiles vulnerable!', 'error');
      }
    }
  };

  // --- TERMINAL DISPATCHER ---
  const handleTerminalSubmit = (e) => {
    if (e.key === 'Enter') {
      const command = terminalInputValue;
      setTerminalInputValue('');
      setTerminalTypedBuffer('');
      handleRunCommand(command);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  };

  const handleTabCompletion = () => {
    const val = terminalInputValue.trim().toLowerCase();
    if (!val) return;
    const commandsList = ['help', 'neofetch', 'about', 'skills', 'projects', 'contact', 'clear', 'theme', 'sudo', 'ls', 'cat'];
    const match = commandsList.find(cmd => cmd.startsWith(val));
    if (match) {
      setTerminalInputValue(match);
      setTerminalTypedBuffer(match);
    }
  };

  const handleRunCommand = (rawText) => {
    const cleanText = rawText.trim().toLowerCase();
    const args = cleanText.split(' ');
    const mainCommand = args[0];

    const promptLine = {
      type: 'prompt',
      content: `[visitor@sagar-linux ~]$ ${rawText}`
    };

    if (mainCommand === 'clear') {
      setTerminalHistory([]);
      return;
    }

    let response = '';
    let responseType = 'response';

    switch (mainCommand) {
      case 'help':
        response = `Available CLI Commands:
  neofetch    - Print beautiful systems specifications
  ls          - List virtual directory text files
  cat [file]  - View contents of a virtual text file (e.g. 'cat about.txt')
  about       - Show Sagar's biography
  skills      - Display Technical expertise profile
  projects    - List selected coding/systems projects
  project [n] - Inspect project details (e.g. 'project 1')
  contact     - Display email and profile handles
  theme       - Toggle visual color theme mode
  clear       - Clear terminal console screen`;
        break;

      case 'ls':
        response = `about.txt      skills.txt      projects.txt      certifications.txt      contact.txt`;
        responseType = 'accent';
        break;

      case 'cat':
        const file = args[1];
        if (!file) {
          response = `Usage: cat [filename]. Type 'ls' to see available files.`;
          responseType = 'error';
        } else if (file === 'about.txt') {
          response = `[ Sagar's Bio ]\n-------------------------------\n${config.personal.bio}`;
        } else if (file === 'skills.txt') {
          let text = `[ Skills Profiles ]\n-------------------------------\n`;
          Object.keys(config.skills).forEach(k => {
            text += `* ${config.skills[k].title}:\n  - ${config.skills[k].items.join('\n  - ')}\n`;
          });
          response = text;
        } else if (file === 'projects.txt') {
          let text = `[ Selected Projects ]\n-------------------------------\n`;
          config.projects.forEach((p, idx) => {
            text += `[${idx + 1}] ${p.title}\n    Stack: ${p.techStack.join(', ')}\n    Metric: ${p.keyMetric || 'N/A'}\n\n`;
          });
          response = text;
        } else if (file === 'certifications.txt') {
          let text = `[ Certifications & Achievements ]\n-------------------------------\n`;
          config.achievements.forEach(a => {
            text += `* ${a.title} (${a.date}) - Issued by ${a.issuer}\n  ${a.description}\n\n`;
          });
          response = text;
        } else if (file === 'contact.txt') {
          response = `[ Contact Coordinates ]\n-------------------------------\nEmail: ${config.personal.email}\nLinkedIn: ${config.personal.linkedin}\nGitHub: ${config.personal.github}`;
        } else {
          response = `cat: ${args[1]}: No such file or directory. Type 'ls' to see files.`;
          responseType = 'error';
        }
        break;

      case 'neofetch':
        const topSkills = config.skills.devops?.items?.slice(0, 3) || [];
        response = `           .---.         OS: Red Hat Enterprise Linux (RHEL) / Local
          /     \\        Host: ${config.personal.name}'s Interactive Portfolio React Node
          \\.@-@./        Kernel: React Virtual Shell v3.0
          /\`\\_/\`\\        Uptime: B.Tech CSE Years
         //  _  \\\\       Shell: Bash (Custom Terminal Component)
        | \\     / |      Certifications: RHCSA (2025), Azure Fundamentals
       (|  \`---\`  |)     Core Tools: ${topSkills.join(', ')}
       / \\__...__/ \\     GPA: 7.0/10
      /  ________   \\    
     /  /        \\   \\   Type 'help' to see command descriptions.
    /  /          \\   \\  `;
        responseType = 'neofetch';
        break;

      case 'about':
        response = `[ ${config.personal.name} ${config.personal.lastName || ''} - Systems Specialist ]\n${config.personal.title}\n--------------------------------------------------\n${config.personal.bio}`;
        break;

      case 'skills':
        let skHtml = `Technical Expertise Matrix:\n`;
        Object.keys(config.skills).forEach(catKey => {
          const category = config.skills[catKey];
          skHtml += `\n* ${category.title}:\n  - ${category.items.join('\n  - ')}`;
        });
        response = skHtml;
        break;

      case 'projects':
        let projHtml = `Selected Projects List:\n`;
        config.projects.forEach((p, idx) => {
          projHtml += `  [${idx + 1}] ${p.title} (${p.techStack.join(', ')})\n`;
        });
        projHtml += `\nType 'project [index]' (e.g. 'project 1') to inspect inside detail spotlights!`;
        response = projHtml;
        break;

      case 'project':
        const idx = parseInt(args[1]) - 1;
        if (!isNaN(idx) && idx >= 0 && idx < config.projects.length) {
          const p = config.projects[idx];
          response = `Opening spotlight details modal for: "${p.title}"`;
          responseType = 'success';
          setTimeout(() => {
            setActiveModalProject(p);
          }, 300);
        } else {
          response = `Error: Invalid project index. Usage: project [1-${config.projects.length}]. Type 'projects' to check indexes.`;
          responseType = 'error';
        }
        break;

      case 'contact':
        response = `Coordinates:\n  - Email:    ${config.personal.email}\n  - LinkedIn: ${config.personal.linkedin}\n  - GitHub:   ${config.personal.github}`;
        break;

      case 'theme':
        response = `Flipping visual theme toggler...`;
        responseType = 'success';
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
        break;

      case 'sudo':
        response = `visitor is not in the sudoers file. This incident will be reported.`;
        responseType = 'error';
        break;

      default:
        if (cleanText !== '') {
          response = `bash: command not found: ${rawText}. Type 'help' to view options.`;
          responseType = 'error';
        }
        break;
    }

    setTerminalHistory((prev) => [...prev, promptLine, { type: responseType, content: response }]);
  };

  const handleHintClick = (cmd) => {
    setTerminalInputValue(cmd);
    setTerminalTypedBuffer(cmd);
    if (terminalInputRef.current) terminalInputRef.current.focus();

    setTimeout(() => {
      setTerminalInputValue('');
      setTerminalTypedBuffer('');
      handleRunCommand(cmd);
    }, 250);
  };

  // --- CONTACT FORM SUBMISSION ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setFormErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    let hasError = false;
    const errorsCopy = { name: false, email: false, subject: false, message: false };

    if (!formInput.name.trim()) {
      errorsCopy.name = true;
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formInput.email.trim() || !emailRegex.test(formInput.email.trim())) {
      errorsCopy.email = true;
      hasError = true;
    }

    if (!formInput.subject.trim()) {
      errorsCopy.subject = true;
      hasError = true;
    }

    if (!formInput.message.trim()) {
      errorsCopy.message = true;
      hasError = true;
    }

    setFormErrors(errorsCopy);

    if (hasError) {
      addToast('Please correct validation issues before sending.', 'error');
    } else {
      addToast(`Thank you, ${formInput.name}! Message simulated successfully.`, 'success');
      setFormInput({ name: '', email: '', subject: '', message: '' });
    }
  };

  // --- RENDER HELPERS ---
  const filteredProjects = config.projects.filter(p => {
    if (projectFilter === 'all') return true;
    return p.category === projectFilter;
  });

  const fullName = `${config.personal.name} ${config.personal.lastName || ''}`.trim();
  const initials = config.personal.name.charAt(0) + (config.personal.lastName ? config.personal.lastName.charAt(0) : '');

  return (
    <>
      {/* Background spotlights */}
      <div className="glow-bg glow-bg-1"></div>
      <div className="glow-bg glow-bg-2"></div>

      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#hero" className="nav-logo">
            <span className="logo-symbol">&lt;/&gt;</span>
            <span>{config.personal.name}</span>
          </a>

          <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#hero" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
            <a href="#skills" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Skills</a>
            <a href="#projects" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Projects</a>
            <a href="#achievements" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Achievements</a>
            <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          </nav>

          <div className="nav-actions">
            <button 
              className="btn-icon" 
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              className="btn-icon mobile-menu-btn" 
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero-section section-padding">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="cyber-badge">
              <span className="badge-pulse"></span>
              <span>SYSTEM NODE // RHCSA CERTIFIED</span>
            </div>
            <span className="hero-greeting">Hello, World! I am</span>
            <h1 className="hero-name">{fullName}</h1>
            <h2 className="hero-title">{config.personal.title}</h2>
            <p className="hero-desc">{config.personal.tagline}</p>
            
            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary">
                View Projects <ArrowRight size={16} />
              </a>
              <a href="#contact" className="btn btn-secondary">Contact Me</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="terminal-card" onClick={() => activeTab === 'cli' && terminalInputRef.current?.focus()}>
              <div className="terminal-header">
                <div className="terminal-buttons">
                  <span className="t-btn t-close" onClick={() => setTerminalHistory([])} title="Clear terminal screen"></span>
                  <span className="t-btn t-minimize" onClick={() => {
                    setTerminalHistory([]);
                    handleRunCommand('neofetch');
                  }} title="Reset terminal state"></span>
                  <span className="t-btn t-expand" onClick={() => handleRunCommand('help')} title="Run help command"></span>
                </div>
                <div className="terminal-tabs">
                  <button 
                    className={`term-tab ${activeTab === 'cli' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('cli');
                    }}
                  >
                    sagar.sh
                  </button>
                  <button 
                    className={`term-tab ${activeTab === 'gui' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('gui');
                    }}
                  >
                    sys_monitor.rt
                  </button>
                </div>
                <div className="terminal-status">{activeTab === 'cli' ? 'bash' : 'monitor'}</div>
              </div>

              {/* TAB 1: CLI VIEW */}
              {activeTab === 'cli' && (
                <>
                  <div className="terminal-body" ref={consoleBodyRef}>
                    {terminalHistory.map((item, idx) => (
                      <div key={idx} className="terminal-stdout-line">
                        {item.type === 'prompt' ? (
                          <span className="terminal-stdout-cmd">{item.content}</span>
                        ) : (
                          <pre className={`terminal-stdout-response terminal-${item.type}-text`}>{item.content}</pre>
                        )}
                      </div>
                    ))}
                    
                    {/* Input Line */}
                    <div className="terminal-input-line">
                      <span className="terminal-prompt">[visitor@sagar-linux ~]$</span>
                      <span className="terminal-input-display">{terminalTypedBuffer}</span>
                      <span className="terminal-caret">█</span>
                      <input 
                        type="text" 
                        id="terminal-hidden-input"
                        ref={terminalInputRef}
                        value={terminalInputValue}
                        onChange={(e) => {
                          setTerminalInputValue(e.target.value);
                          setTerminalTypedBuffer(e.target.value);
                        }}
                        onKeyDown={handleTerminalSubmit}
                        disabled={!isTerminalBooted}
                        autoComplete="off"
                        aria-label="Terminal prompt input"
                      />
                    </div>
                  </div>
                  <div className="terminal-footer">
                    <span>Try: 
                      <span className="hint-cmd" onClick={() => handleHintClick('help')}>help</span>, 
                      <span className="hint-cmd" onClick={() => handleHintClick('neofetch')}>neofetch</span>, 
                      <span className="hint-cmd" onClick={() => handleHintClick('ls')}>ls</span>,
                      <span className="hint-cmd" onClick={() => handleHintClick('projects')}>projects</span>
                    </span>
                  </div>
                </>
              )}

              {/* TAB 2: SYSTEM MONITOR GUI */}
              {activeTab === 'gui' && (
                <div className="terminal-gui-body">
                  <div className="gui-monitor-grid">
                    <div className="gui-monitor-card">
                      <div className="gui-monitor-info">
                        <span>CPU Core Load</span>
                        <span className="gui-monitor-value">{cpuLoad}%</span>
                      </div>
                      <div className="gui-progress-track">
                        <div className="gui-progress-bar" style={{ width: `${cpuLoad}%` }}></div>
                      </div>
                    </div>

                    <div className="gui-monitor-card">
                      <div className="gui-monitor-info">
                        <span>RAM System Load</span>
                        <span className="gui-monitor-value">{ramLoad} / 8.0 GB</span>
                      </div>
                      <div className="gui-progress-track">
                        <div className="gui-progress-bar" style={{ width: `${(ramLoad / 8.0) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="gui-monitor-card">
                      <div className="gui-monitor-info">
                        <span>LVM Storage (vg_sagar)</span>
                        <span className="gui-monitor-value">48.2 / 80 GB</span>
                      </div>
                      <div className="gui-progress-track">
                        <div className="gui-progress-bar" style={{ width: '60.2%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="gui-services-panel">
                    <h4>Linux Node Services (RHCSA Control)</h4>
                    <div className="gui-services-list">
                      {Object.keys(services).map((svcName) => (
                        <div key={svcName} className="gui-service-row">
                          <div className="gui-service-info">
                            <span className={`service-status-dot ${services[svcName] ? 'active' : 'inactive'}`}></span>
                            <span>{svcName}.service</span>
                          </div>
                          <button 
                            className={`btn btn-sm svc-toggle-btn ${services[svcName] ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={() => toggleService(svcName)}
                          >
                            {services[svcName] ? <><Square size={10} style={{ marginRight: '4px' }} /> Stop</> : <><Play size={10} style={{ marginRight: '4px' }} /> Start</>}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section section-padding">
        <div className="container">
          <h2 className="section-heading">About Me</h2>
          
          <div className="about-grid" style={{ marginTop: '30px' }}>
            <div className="about-bio-panel">
              <div className="bio-avatar-container">
                <div className="bio-avatar">
                  {config.personal.avatar ? (
                    <img src={config.personal.avatar} alt={fullName} />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
              </div>
              <p className="bio-text">{config.personal.bio}</p>
              
              <div className="bio-links">
                {config.personal.linkedin && (
                  <a href={config.personal.linkedin} target="_blank" rel="noreferrer" className="social-link" title="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                )}
                {config.personal.github && (
                  <a href={config.personal.github} target="_blank" rel="noreferrer" className="social-link" title="GitHub">
                    <Github size={18} />
                  </a>
                )}
                {config.personal.resumeUrl && config.personal.resumeUrl !== '#' && (
                  <a href={config.personal.resumeUrl} className="btn btn-secondary btn-sm" download>
                    <FileText size={14} /> Resume PDF
                  </a>
                )}
              </div>
            </div>

            <div className="stats-panel">
              {config.stats.map((stat, index) => (
                <div key={index} className="glass-card stat-card">
                  <span className="stat-val">{stat.value}</span>
                  <span className="stat-lbl">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="skills-section section-padding">
        <div className="container">
          <h2 className="section-heading">Technical Expertise</h2>
          <p className="section-subheading">A comprehensive breakdown of tools, libraries, languages, and technical frameworks I use.</p>
          
          <div className="skills-container">
            {Object.keys(config.skills).map((key) => {
              const category = config.skills[key];
              return (
                <div key={key} className="glass-card skill-category-card">
                  <h3>{category.title}</h3>
                  <div className="skills-list">
                    {category.items.map((item, idx) => (
                      <span key={idx} className="skill-tag">{item}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section section-padding">
        <div className="container">
          <h2 className="section-heading">Selected Projects</h2>
          
          <div className="projects-filter-bar" style={{ marginTop: '20px' }}>
            <button className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`} onClick={() => setProjectFilter('all')}>All Projects</button>
            <button className={`filter-btn ${projectFilter === 'systems' ? 'active' : ''}`} onClick={() => setProjectFilter('systems')}>Systems & DevOps</button>
            <button className={`filter-btn ${projectFilter === 'web' ? 'active' : ''}`} onClick={() => setProjectFilter('web')}>Web & Cloud</button>
          </div>

          <div className="projects-grid">
            {filteredProjects.map((proj, idx) => (
              <article 
                key={idx} 
                className="glass-card project-card"
                onClick={() => setActiveModalProject(proj)}
              >
                {proj.imageUrl && (
                  <div className="project-image-wrapper">
                    <img src={proj.imageUrl} className="project-card-image" alt={proj.title} />
                  </div>
                )}
                <div className="project-content-wrapper">
                  <div className="project-header">
                    <div className="project-icon">
                      <Folder size={18} />
                    </div>
                    <div className="project-links">
                      {proj.githubLink && proj.githubLink !== '#' && (
                        <a 
                          href={proj.githubLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="project-link-btn" 
                          title="GitHub Source"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {proj.liveLink && proj.liveLink !== '#' && (
                        <a 
                          href={proj.liveLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="project-link-btn" 
                          title="Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="project-title">{proj.title}</h3>
                  <p className="project-desc">{proj.description}</p>
                  {proj.keyMetric && (
                    <div className="project-metric">{proj.keyMetric}</div>
                  )}
                  <div className="project-tech">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="project-tech-tag">{tech}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: '15px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontWeight: '600' }}>
                    <span>View details</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="achievements-section section-padding">
        <div className="container">
          <h2 className="section-heading">Achievements & Certifications</h2>
          
          <div className="timeline" style={{ marginTop: '40px' }}>
            {config.achievements.map((ach, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-content">
                  <div className="timeline-date">{ach.date}</div>
                  <h3 className="timeline-title">{ach.title}</h3>
                  <div className="timeline-issuer">{ach.issuer}</div>
                  <p className="timeline-desc">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section section-padding">
        <div className="container">
          <h2 className="section-heading">Get In Touch</h2>
          <p className="section-subheading">Have an opportunity, a project proposal, or just want to chat? Drop a message!</p>
          
          <div className="contact-grid">
            <div className="contact-details-panel">
              <div className="contact-card glass-card">
                <div className="contact-card-icon">
                  <FileText size={18} />
                </div>
                <div className="contact-card-info">
                  <h3>Email</h3>
                  <a href={`mailto:${config.personal.email}`}>{config.personal.email}</a>
                </div>
              </div>

              <div className="contact-card glass-card">
                <div className="contact-card-icon">
                  <Linkedin size={18} />
                </div>
                <div className="contact-card-info">
                  <h3>LinkedIn</h3>
                  <a href={config.personal.linkedin} target="_blank" rel="noreferrer">Connect with me</a>
                </div>
              </div>

              <div className="contact-card glass-card">
                <div className="contact-card-icon">
                  <Github size={18} />
                </div>
                <div className="contact-card-info">
                  <h3>GitHub</h3>
                  <a href={config.personal.github} target="_blank" rel="noreferrer">github.com/sagar</a>
                </div>
              </div>
            </div>

            <div className="contact-form-panel glass-card">
              <form onSubmit={handleFormSubmit} className="contact-form" noValidate>
                <div className="form-row-2">
                  <div className={`form-group ${formErrors.name ? 'error' : ''}`}>
                    <label htmlFor="name">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formInput.name} 
                      onChange={handleInputChange} 
                      placeholder="Enter name" 
                    />
                    <span className="error-msg">Name is required</span>
                  </div>

                  <div className={`form-group ${formErrors.email ? 'error' : ''}`}>
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formInput.email} 
                      onChange={handleInputChange} 
                      placeholder="name@domain.com" 
                    />
                    <span className="error-msg">Provide a valid email</span>
                  </div>
                </div>

                <div className={`form-group ${formErrors.subject ? 'error' : ''}`}>
                  <label htmlFor="subject">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formInput.subject} 
                    onChange={handleInputChange} 
                    placeholder="e.g. Opportunity or Collaboration" 
                  />
                  <span className="error-msg">Subject is required</span>
                </div>

                <div className={`form-group ${formErrors.message ? 'error' : ''}`}>
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    value={formInput.message} 
                    onChange={handleInputChange} 
                    placeholder="Write your message here..." 
                  />
                  <span className="error-msg">Message cannot be empty</span>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Send Message <Send size={14} style={{ marginLeft: '4px' }} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight details Modal */}
      {activeModalProject && (
        <div className="modal-backdrop open" onClick={() => setActiveModalProject(null)}>
          <div className="glass-card modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="btn-icon modal-close-btn" onClick={() => setActiveModalProject(null)} title="Close Details">
              <X size={18} />
            </button>
            <div className="modal-content-body">
              <div className="modal-header-section">
                {activeModalProject.imageUrl && (
                  <div style={{ width: '100%', maxHeight: '250px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
                    <img src={activeModalProject.imageUrl} alt={activeModalProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <span className="modal-project-badge">
                  {activeModalProject.category === 'systems' ? 'Systems & DevOps' : 'Web & Cloud'}
                </span>
                <h2 className="modal-project-title">{activeModalProject.title}</h2>
                <div className="modal-tech-stack">
                  {activeModalProject.techStack.map((t, idx) => (
                    <span key={idx} className="project-tech-tag">{t}</span>
                  ))}
                </div>
              </div>
              <hr className="modal-divider" />
              <div className="modal-grid-details">
                <div className="modal-left-col">
                  <h3>Project Overview</h3>
                  <p>{activeModalProject.modalDetails?.longDescription || activeModalProject.description}</p>
                  <h3>Key Challenges & Implementation</h3>
                  <p>{activeModalProject.modalDetails?.challenges || 'Standard configuration and node provision management.'}</p>
                </div>
                <div className="modal-right-col">
                  <h3>System Architecture</h3>
                  {activeModalProject.modalDetails?.architecture ? (
                    <div className="modal-architecture-container">
                      <pre style={{ whiteSpace: 'pre-wrap' }}><code>{activeModalProject.modalDetails.architecture}</code></pre>
                    </div>
                  ) : (
                    <div className="modal-architecture-container">
                      <pre><code>[Local Server Host] --&gt; [POSIX Socket API]</code></pre>
                    </div>
                  )}
                  <div className="modal-links-footer">
                    {activeModalProject.githubLink && activeModalProject.githubLink !== '#' && (
                      <a href={activeModalProject.githubLink} target="_blank" rel="noreferrer" className="btn btn-primary">
                        <Github size={16} /> GitHub Source
                      </a>
                    )}
                    {activeModalProject.liveLink && activeModalProject.liveLink !== '#' && (
                      <a href={activeModalProject.liveLink} target="_blank" rel="noreferrer" className="btn btn-secondary">
                        <ExternalLink size={16} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications portal */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.type === 'success' ? <CheckCircle size={16} color="#27c93f" /> : <AlertTriangle size={16} color="#ff5f56" />}
              <span>{t.message}</span>
            </div>
            <span className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={14} />
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footer-bar">
        <div className="container footer-content">
          <p>&copy; {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <div className="footer-links">
            <a href="#hero">Back to top</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
