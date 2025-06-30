"use client"

import Lanyard from "@/components/Lanyard/Lanyard";

import { useEffect, useState } from "react"
import {
  Moon,
  Sun,
  Download,
  Mail,
  ExternalLink, // Tetap diimpor karena mungkin digunakan di tempat lain (misal social links)
  Github,
  Linkedin,
  MessageCircle,
  Filter,
  Globe,
  Smartphone,
  Microscope,
  Loader2,
  Check,
  User,
  GraduationCap,
  MapPin,
  Heart,
  Target,
  Code,
  HardDrive,
  BookOpen,
  Network,
  Database
} from "lucide-react"
import Image from "next/image"

// Portfolio Data (Diperbarui dengan link yang diminta & tanpa link demo)
const portfolioData = {
  projects: [
    {
      name: "Morations",
      year: "2025",
      tools: ["VB.NET", "MySQL", "RDLC Report"],
      role: "Full-Stack Developer",
      description:
        "Built a desktop-based movie rating and subscription application designed to provide ratings and film recommendations, helping users discover movies aligned with their preferences and encouraging engagement through data-driven ratings. It features RDLC invoices, subscription verification, and an admin dashboard for review and revenue management.",
      type: "software",
      github: "https://github.com/akudhandi/morations", // Link GitHub Morations
      document: "https://drive.google.com/file/d/1DPp_aGh2goblsPKX-NN1RQ-XlcJp0d81/view?usp=drive_link" 
    },
    {
      name: "Lunar Store",
      year: "2025",
      tools: ["Laravel Livewire", "Tailwind CSS", "MySQL"],
      role: "Front-End Developer",
      description:
        "Developed a professional, responsive, and user-friendly e-commerce website for Lunar Store, designed as a primary digital platform for selling premium applications and digital subscriptions. It includes shopping cart, integrated payment gateway, and order tracking for a seamless shopping experience.",
      type: "web",
      github: "https://github.com/Hafidzrdwn/lunar_store_laravel", // Link GitHub Lunar Store
      document: "https://drive.google.com/file/d/1ZtQqiz4MiNPIu2SqcBFX19-tlkcJgfYB/view?usp=drive_link" // Link dokumen DPPL ADSI (asumsi ini laporan Lunar Store)
    },
    {
      name: "Blu by BCA Acceptance Research",
      year: "2025",
      tools: ["Jamovi", "WarpPLS", "Python"],
      role: "Data Analyst",
      description:
        "An in-depth research project analyzing user acceptance of the Blu by BCA Digital application using the UTAUT framework, extended with the Perceived Risk construct. It identifies key factors influencing behavioral intention to adopt digital banking services through quantitative analysis.",
      type: "research",
      doi: "https://doi.org/10.59934/jaiea.v4i3.1182", // Hanya Link DOI untuk riset ini
      // github dan document dihapus sesuai permintaan
    },
    {
      name: "Network Design Faculty Building", // Proyek baru
      year: "2024",
      tools: ["Cisco Packet Tracer"],
      role: "Network Designer",
      description:
        "Documentation of network design and configuration for FIK I Building, UPN 'Veteran' Jawa Timur, using Cisco Packet Tracer. It includes network topology, device identification, IP schema, and recommendations for performance and security improvements.",
      type: "networking",
      document: "https://drive.google.com/file/d/1s3dLCpXeAYnwI-pyfpwTRqJv4ZNSVtbh/view?usp=drive_link" // Hanya link dokumen
      // github dan demo dihapus
    },
    {
      name: "Desk-Go: Coworking Space Booking System", // Proyek baru
      year: "2024",
      tools: ["HTML", "PHP", "CSS", "Bootstrap", "JavaScript", "MySQL", "XAMPP"],
      role: "Full-Stack Web Developer",
      description:
        "A web-based system for monitoring and booking seats in a coworking space, designed to provide real-time seat availability, online booking, and management tools for administrators to optimize space utilization and enhance user experience.",
      type: "web",
      document: "https://drive.google.com/file/d/1rlhFBzOvXI0p0H3s4tOw4qHA_f5OxQaX/view?usp=drive_link" // Hanya link dokumen
      // github dan demo dihapus
    },
    {
      name: "Leafly Database Management", // Proyek baru
      year: "2024",
      tools: ["MariaDB", "MySQL", "SQL"],
      role: "Database Administrator",
      description:
        "Implementation and management of a database system for the Leafly application (selling ready-to-cook vegetables, cut fruits, and fruit salads). Focuses on efficient data management, security, and scalability using MariaDB and MySQL, supporting flexible delivery and personalized nutrition information.",
      type: "database",
      document: "https://drive.google.com/file/d/16eo5WSRd0vUIcXLkzD7vZzuNjy33Gvhq/view?usp=drive_link" // Hanya link dokumen
      // github dan demo dihapus
    },
    {
      name: "IS Security Evaluation - PT Kuelap", // Proyek baru
      year: "2024",
      tools: ["SNI ISO/IEC 27001:2022", "Indeks KAMI 5.0"],
      role: "Information Security Analyst",
      description:
        "Evaluated the information security management system maturity of PT. Kuelap Solusi Indonesia using SNI ISO/IEC 27001:2022 and Indeks KAMI 5.0. Identified security gaps and provided recommendations for improving governance, risk management, asset management, and personal data protection.",
      type: "research",
      document: "https://drive.google.com/file/d/18cdV516-hAucnlSRXMpFLndo0D9WHHH5/view?usp=drive_link" // Hanya link dokumen
      // github dan demo dihapus
    },
    {
      name: "NextChamp", // Proyek yang sudah ada
      year: "2025",
      tools: ["Flutter", "Strapi", "MySQL", "Figma"],
      role: "Front-End Developer",
      description:
        "Developed a cross-platform mobile app for student competition mentorship, featuring secure login, mentor chat, AI-powered chatbot, and a discussion forum. Integrated Strapi and MySQL for real-time content and refined UI based on usability testing.",
      type: "mobile",
      github: "https://github.com/akudhandi/nextchamp-strapi", // Link GitHub NextChamp
      // demo dihapus
    },
    // Jika Anda ingin menambahkan proyek lain dari link DOI yang belum ada di sini,
    // berikan detailnya seperti proyek-proyek di atas.
  ],
  experiences: [
    {
      title: "Samsung Solve for Tomorrow 2025",
      role: "Participant",
      year: "2025",
      description:
        "Currently participating in Samsung's innovation competition, developing sustainable technology solutions for environmental challenges.",
      type: "Competition",
    },
    {
      title: "Head of Security & Licensing Division, Fasilkom Fest 2024",
      role: "Team Lead",
      year: "2024",
      description: "Led and managed 30-member security division overseeing safety enforcement and venue mapping. Coordinated licensing and regulatory processes for 13 divisions, ensuring full compliance for 10+ sub-events of the annual flagship event.",
      type: "Organization",
    },
    {
      title: "Head of Logistics, Fasilkom Tech 2024",
      role: "Team Lead",
      year: "2024",
      description: "Led logistics for a 9-session national bootcamp, managing equipment, Zoom setup, tools, and meal distribution for 30+ committee members. Coordinated procurement and readiness across 12+ online and hybrid sessions.",
      type: "Organization",
    },
    {
      title: "Chairman Commitee, KASTRA Fasilkom 2024",
      role: "Team Lead",
      year: "2024",
      description: "Led the planning and execution of KASTRA FASILKOM 2024, a national seminar and discussion forum, attracting 750+ registrants through hybrid participation. Oversaw 30+ committee members across 6 divisions.",
      type: "Organization",
    },
    {
      title: "Student Welfare Advocacy Staff, BEM Faculty of Computer Science",
      role: "Staff",
      year: "2024-2025",
      description: "Managed advocacy cases and provided timely support to students facing academic and financial issues, ensuring proper resolution and coordinated documentation. Strengthened transparency between students and faculty by analyzing emerging campus and national-level issues.",
      type: "Organization",
    },
  ],
  socialLinks: [
    { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/fajar-ramadhandi-hidayat" },
    { icon: "github", label: "GitHub", href: "https://github.com/akudhandi" },
    { icon: "mail", label: "Email", href: "mailto:dhandifajar@gmail.com" },
    { icon: "message-circle", label: "WhatsApp", href: "https://wa.me/6285648058508" },
  ],
}

// Tech Stack (Menggunakan gambar lokal yang sudah Anda tempatkan di /assets)
const techStack = [
  { name: "HTML/CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "PHP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Laravel", icon: "/assets/laravelicon.png" },
  { name: "Flutter", icon: "/assets/fluttericon.png" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Figma", icon: "/assets/figmaicon.png" },
  { name: "Strapi", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/strapi/strapi-plain.svg" },
  { name: "Jamovi", icon: "/assets/jamoviicon.jpg" },
  { name: "WarpPLS", icon: "/assets/warpplsicon.png" },
  { name: "VB.NET", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" },
  { name: "Cisco Packet Tracer", icon: "/assets/ciscoicon.png" },
  { name: "MariaDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mariadb/mariadb-original.svg" },
  { name: "XAMPP", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-plain-wordmark.svg" },
]

export default function Portfolio() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentFilter, setCurrentFilter] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") || "dark"
    setIsDarkMode(savedTheme === "dark")

    // Apply theme to body
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")

    if (newTheme) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }

  const filterProjects = (filter: string) => {
    setCurrentFilter(filter)
  }

  // Filter proyek berdasarkan tipe yang dipilih
  const filteredProjects =
    currentFilter === "all"
      ? portfolioData.projects
      : portfolioData.projects.filter((project) => project.type === currentFilter)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleContactForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)

    setTimeout(() => {
      setIsSubmitted(false)
      const form = e.target as HTMLFormElement
      form.reset()
    }, 2000)
  }

  const openChat = () => {
    alert("Chat feature coming soon! For now, please use the contact form or email.")
  }

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Navigation */}
      <nav className="navbar" id="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">FRH</span>
          </div>

          <div className="nav-menu">
            <div className="nav-links">
              <a href="#about" className="nav-link">
                About
              </a>
              <a href="#projects" className="nav-link">
                Projects
              </a>
              <a href="#experience" className="nav-link">
                Experience
              </a>
              <a href="#contact" className="nav-link">
                Contact
              </a>
            </div>

            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
              <Sun className={`theme-icon sun-icon ${isDarkMode ? "opacity-100" : "opacity-0"}`} />
              <Moon className={`theme-icon moon-icon ${isDarkMode ? "opacity-0" : "opacity-100"}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="container">
          <div className="hero-content">
            {/* Profile Photo */}
            <div className="profile-photo">
              <div className="photo-border">
                <div className="photo-container">
                  <Image
                    src="/images/profile.jpg"
                    alt="Fajar Ramadhandi Hidayat"
                    className="profile-img"
                    width={150}
                    height={150}
                  />
                </div>
              </div>
              <div className="photo-glow"></div>
            </div>

            {/* Name */}
            <h1 className="hero-title">
              <span className="first-name">Fajar Ramadhandi </span>
              <span className="last-name gradient-text">Hidayat</span>
            </h1>

            <p className="hero-subtitle">Front-End Developer | Web Building Enthusiast | Data Analytics Explorer</p>
            <p className="hero-description">
              Building impactful digital experiences through design, code, and insight.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary">
                <Download className="w-4 h-4" />
                Download CV
              </button>
              <button className="btn btn-outline" onClick={() => scrollToSection("contact")}>
                <Mail className="w-4 h-4" />
                Contact Me
              </button>
              <button className="btn btn-outline" onClick={() => scrollToSection("projects")}>
                <ExternalLink className="w-4 h-4" />
                View Projects
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>

          <div className="about-content">
            {/* Personal Background */}
            <div className="about-main">
              <div className="card">
                <div className="card-content">
                  <div className="about-intro">
                    <h3 className="about-section-title">
                      <User className="w-5 h-5" />
                      Background
                    </h3>
                    <p className="about-description">
                      I'm a passionate second-year Information Systems student (5th semester) at UPN "Veteran" Jawa Timur, focusing on front-end development, UI/UX design, and data analytics. I have experience in building mobile and web applications using Flutter and Laravel, conducting user research and prototyping with Figma, and performing statistical analysis using Jamovi and WarpPLS. I am passionate about designing impactful, user-centered digital solutions.
                    </p>
                  </div>

                  <div className="about-details">
                    <div className="detail-item">
                      <div className="detail-icon">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="detail-content">
                        <h4>Education</h4>
                        <p>Bachelor of Information System</p>
                        <span className="detail-meta">UPN "Veteran" Jawa Timur, 3.72/4.00</span>
                        <span className="detail-meta">Jul 2023 - Present (5th Semester)</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="detail-content">
                        <h4>Location</h4>
                        <p>Surabaya, Indonesia</p>
                        <span className="detail-meta">Available for Remote Work</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div className="detail-content">
                        <h4>Interests</h4>
                        <p>Web Development, UI/UX Design</p>
                        <span className="detail-meta">Data Analytics & Research</span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon">
                        <Target className="w-5 h-5" />
                      </div>
                      <div className="detail-content">
                        <h4>Goal</h4>
                        <p>Creating Impactful Digital Solutions</p>
                        <span className="detail-meta">Bridging Design & Technology</span>
                      </div>
                    </div>
                  </div>

                  <div className="highlight-box">
                    <p className="highlight-text">🏆 Currently participating in Samsung Solve for Tomorrow 2025</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Stack - Simple Bottom Section */}
            <div className="tech-stack-simple">
              <h3 className="tech-title">
                <Code className="w-5 h-5" />
                Tech Stack & Tools
              </h3>
              <div className="tech-icons-row">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-icon-item" title={tech.name}>
                    <Image src={tech.icon || "/placeholder.svg"} alt={tech.name} width={32} height={32} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects" id="projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${currentFilter === "all" ? "active" : ""}`}
              onClick={() => filterProjects("all")}
            >
              <Filter className="w-4 h-4" />
              All
            </button>
            <button
              className={`filter-btn ${currentFilter === "web" ? "active" : ""}`}
              onClick={() => filterProjects("web")}
            >
              <Globe className="w-4 h-4" />
              Web
            </button>
            <button
              className={`filter-btn ${currentFilter === "mobile" ? "active" : ""}`}
              onClick={() => filterProjects("mobile")}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
            <button
              className={`filter-btn ${currentFilter === "software" ? "active" : ""}`}
              onClick={() => filterProjects("software")}
            >
              <HardDrive className="w-4 h-4" />
              Software
            </button>
            <button
              className={`filter-btn ${currentFilter === "research" ? "active" : ""}`}
              onClick={() => filterProjects("research")}
            >
              <Microscope className="w-4 h-4" />
              Research
            </button>
            <button
              className={`filter-btn ${currentFilter === "networking" ? "active" : ""}`}
              onClick={() => filterProjects("networking")}
            >
              <Network className="w-4 h-4" />
              Networking
            </button>
            <button
              className={`filter-btn ${currentFilter === "database" ? "active" : ""}`}
              onClick={() => filterProjects("database")}
            >
              <Database className="w-4 h-4" />
              Database
            </button>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <div key={index} className="project-card card" data-category={project.type}>
                <div className="card-content">
                  <div className="project-header">
                    <h3 className="project-title">{project.name}</h3>
                    <span className={`project-badge badge-${project.type}`}>
                      {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                    </span>
                  </div>
                  <div className="project-meta">
                    {project.role} • {project.year}
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tools">
                    {project.tools.map((tool, toolIndex) => (
                      <span key={toolIndex} className="tool-tag">
                        {tool}
                      </span>
                    ))}
                  </div>
                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} className="project-link" target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {/* Tombol Demo dihapus */}
                    {project.document && (
                      <a href={project.document} className="project-link" target="_blank" rel="noopener noreferrer">
                        <HardDrive className="w-4 h-4" />
                        Document
                      </a>
                    )}
                    {project.doi && (
                      <a href={project.doi} className="project-link" target="_blank" rel="noopener noreferrer">
                        <BookOpen className="w-4 h-4" />
                        Paper DOI
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="experience" id="experience">
        <div className="container">
          <h2 className="section-title">Experience & Achievements</h2>

          <div className="experience-content">
            <div className="timeline">
              {portfolioData.experiences.map((exp, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker">
                      <div className="timeline-dot"></div>
                      {index < portfolioData.experiences.length - 1 && <div className="timeline-line"></div>}
                    </div>
                    <div className="timeline-content">
                      <div className="card">
                        <div className="card-content">
                          <div className="timeline-header">
                            <h4 className="timeline-title">{exp.title}</h4>
                            <span className="timeline-type">{exp.type}</span>
                          </div>
                          <div className="timeline-meta">
                            {exp.role} • {exp.year}
                          </div>
                          <p className="timeline-description">{exp.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section with 3D Lanyard */}
      <section className="contact" id="contact">
        <div className="container">
          <h2 className="section-title">Let{"'"}s Connect</h2>

          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Send a Message</h3>
                  <p className="card-description">I{"'"}d love to hear about your project or just say hello!</p>
                </div>
                <div className="card-content">
                  <form onSubmit={handleContactForm}>
                    <div className="form-group">
                      <input type="text" name="name" placeholder="Your Name" className="form-input" required />
                    </div>
                    <div className="form-group">
                      <input type="email" name="email" placeholder="Your Email" className="form-input" required />
                    </div>
                    <div className="form-group">
                      <textarea
                        name="message"
                        placeholder="Your Message"
                        rows={4}
                        className="form-textarea"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <Check className="w-4 h-4" />
                          Message Sent!
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* 3D Lanyard Section */}
            <div className="contact-info">
              <div className="contact-text">
                <h3 className="contact-title">Get in Touch</h3>
                <p className="contact-description">
                  Ready to collaborate on your next project? Let{"'"}s create something amazing together!
                </p>
              </div>

              <div className="lanyard-container" style={{ height: "500px" }}>
                <Lanyard />
              </div>


              <div className="social-links">
                {portfolioData.socialLinks.map((social, index) => (
                  <a key={index} href={social.href} className="social-link">
                    {social.icon === "linkedin" && <Linkedin className="social-icon" />}
                    {social.icon === "github" && <Github className="social-icon" />}
                    {social.icon === "mail" && <Mail className="social-icon" />}
                    {social.icon === "message-circle" && <MessageCircle className="social-icon" />}
                    <span className="social-label">{social.label}</span>
                    <ExternalLink className="social-external" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">© 2025 Fajar Ramadhandi Hidayat. Built with Next.js and TypeScript.</p>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button className="floating-chat" onClick={openChat} aria-label="Open chat">
        <MessageCircle className="w-5 h-5" />
      </button>
    </>
  )
}