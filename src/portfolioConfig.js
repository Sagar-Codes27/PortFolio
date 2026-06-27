export const portfolioConfig = {
    // --- PERSONAL INFORMATION ---
    personal: {
        name: "Sagar",
        lastName: "",
        title: "B.Tech CSE Student & Aspiring DevOps Engineer",
        tagline: "Configuring Linux systems, learning Docker & Cloud, and studying Red Hat automation.",
        bio: "I am a Computer Science & Engineering student focused on Linux System Administration, Systems Engineering, and DevOps. Certified as an RHCSA, I enjoy configuring local servers and am actively studying automated configuration management using Ansible. I am building hands-on experience with containerization and cloud systems as I prepare for enterprise deployment roles.",
        email: "sagar.yourmail@example.com",
        github: "https://github.com/",
        linkedin: "https://linkedin.com/in/",
        resumeUrl: "#",
        avatar: ""
    },

    // --- CORE STATS (Shown in About Section) ---
    stats: [
        { label: "Certified", value: "RHCSA (2025)" },
        { label: "Studying", value: "RHCE (Running)" },
        { label: "Containers", value: "Docker (Learning)" },
        { label: "GPA", value: "7.0/10" }
    ],

    // --- SKILLS CATEGORIES ---
    skills: {
        systems: {
            title: "System Administration & OS",
            items: ["Red Hat Enterprise Linux (RHEL)", "RHCSA System Configuration", "Storage Management (LVM)", "Local Network Config", "Linux User & Security Admin"]
        },
        devops: {
            title: "Automation & Version Control",
            items: ["Ansible Playbooks (RHCE - Running)", "Docker Containerization (Running)", "Git & GitHub (Running)", "YAML Configuration", "Bash Shell Scripting"]
        },
        cloudtech: {
            title: "Cloud & Databases",
            items: ["Microsoft Azure (Running)", "SQL Databases (Running)", "MongoDB NoSQL (Running)", "Local/Virtual Environment Hosting"]
        },
        future: {
            title: "Future Learning Path",
            items: ["Kubernetes Orchestration", "CI/CD Pipelines Automation", "Infrastructure as Code (IaC)"]
        }
    },

    // --- PROJECTS ---
    projects: [
        {
            title: "Local Enterprise Linux Server Configuration",
            category: "systems",
            techStack: ["RHEL", "Bash Shell", "LVM", "Firewalld", "Systemd"],
            imageUrl: "/rhel_server_setup.jpg",
            description: "Configured and provisioned a local enterprise Linux server node. Handled logical volume storage allocations (LVM), secure SSH keys, service management, and custom firewall routing rules.",
            keyMetric: "Configured local services with 100% compliance based on RHCSA standards.",
            githubLink: "https://github.com/",
            liveLink: "#",
            modalDetails: {
                longDescription: "This project involved deploying a secure, standard-compliant Red Hat Enterprise Linux local node. The system was partition-provisioned with Logical Volume Management (LVM) to support dynamic disk resizing. Automated bash scripts were set up to monitor storage and trigger notifications.",
                challenges: "Handling raw partitions and ensuring LVM metadata integrity during sizing, plus setting firewalld policies that allow only target subnets.",
                architecture: "[User client] --(SSH key-auth)--> [Firewalld Rules] --> [Systemd Services (Httpd/Sshd)]\n                                            |\n                                  [LVM Dynamic Storage]"
            }
        },
        {
            title: "Containerized API Deployment Environment",
            category: "web",
            techStack: ["Docker", "Node.js", "Azure Cloud", "MongoDB"],
            imageUrl: "/docker_api_deploy.jpg",
            description: "Practicing containerization workflows by writing Dockerfiles to package simple web endpoints, run multi-container applications locally, and explore basic Azure container provisioning.",
            keyMetric: "Successfully deployed and tested containerized environments locally and in Azure.",
            githubLink: "https://github.com/",
            liveLink: "#",
            modalDetails: {
                longDescription: "A dockerized project environment containing a Node.js Express server communicating with a MongoDB backend. Configured bridge networks, mapped storage volumes for database persistence, and set up an automated multi-container deployment pipeline using Docker Compose.",
                challenges: "Ensuring persistent storage synchronization for database instances across local host boundaries and optimizing image layer caching.",
                architecture: "[Client Browser] --> [Port 80/443] --> [Docker Bridge Network]\n                                            |\n                               +------------+------------+\n                               |                         |\n                        [Node.js App]              [MongoDB Container]\n                                                         |\n                                                  [Docker Volume]"
            }
        },
        {
            title: "Local Routing & Networking Socket Utility",
            category: "systems",
            techStack: ["C++", "Linux Systems", "Socket Programming", "TCP/IP"],
            imageUrl: "/socket_router_network.jpg",
            description: "Built a C++ routing script that handles TCP connections and routes packets between localized socket hosts to study networking protocols and system IPC.",
            keyMetric: "Optimized socket mapping parameters to reduce connection handshake overhead by 25%.",
            githubLink: "https://github.com/",
            liveLink: "#",
            modalDetails: {
                longDescription: "Developed a native C++ socket programming helper to route frames/packets between multiple localhost addresses. Used standard Linux systems POSIX networking APIs, sockets, threads, and packet headers manipulation.",
                challenges: "Managing thread synchronization and preventing packet collisions or deadlocks when high volumes of socket operations occur simultaneously.",
                architecture: "[Socket Sender] ---> [Port 8080 (Listening Router)] ---> [Thread Pool Dispatcher]\n                                                              |\n                                                     [Socket Receivers 1/2/3]"
            }
        }
    ],

    // --- ACHIEVEMENTS & CERTIFICATIONS ---
    achievements: [
        {
            title: "Red Hat Certified System Administrator (RHCSA)",
            issuer: "Red Hat",
            date: "2025",
            description: "Certified system administrator capable of configuring local storage, managing file systems, managing user groups, configuring firewall policies, and securing Linux environments."
        },
        {
            title: "Red Hat Certified Engineer (RHCE) - Running",
            issuer: "Red Hat (Pursuing)",
            date: "In Progress",
            description: "Currently studying automated administration using Ansible, writing playbooks for node inventory setup, and automating system configuration tasks on enterprise hosts."
        },
        {
            title: "Microsoft Certified: Azure Fundamentals (AZ-900)",
            issuer: "Microsoft",
            date: "2025",
            description: "Validated foundational knowledge of cloud services, core Azure concepts, security, privacy, compliance, and trust architecture."
        }
    ]
};
