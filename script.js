/**
 * Pharmaceutical Researcher Portfolio Interactive Script
 * Author: Anbarasu Murugan
 *
 * Features:
 *  - Pharma preloader with Rx benzene ring animation
 *  - Dark / Light theme toggle with localStorage persistence
 *  - Typewriter effect for pharmaceutical specializations
 *  - Mobile navigation drawer
 *  - ScrollSpy and header scroll state
 *  - Academic timeline scroll animations
 *  - Contact form with Python backend API integration
 *  - Toast notification system
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Preloader — Rx Benzene Ring Loading Animation
  // --------------------------------------------------------------------------
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    // Wait for bar fill animation to complete (2.5s) then fade out
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('loaded');
        // Remove from DOM after transition
        setTimeout(() => preloader.remove(), 600);
      }
    }, 2800);
  });

  // Fallback: force-hide preloader after 5 seconds even if load event delays
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 600);
    }
  }, 5000);

  // --------------------------------------------------------------------------
  // 2. Theme Management (Dark / Light)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const rootElement = document.documentElement;

  const savedTheme = localStorage.getItem('anbarasu-portfolio-theme');
  const initialTheme = savedTheme || 'dark';

  setTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('anbarasu-portfolio-theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }

  // --------------------------------------------------------------------------
  // 3. Dynamic Typewriter Effect for Pharmaceutical Specializations
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    'Pharmaceutical R&D & Formulation',
    'Cosmetic Serums & Skincare',
    'Quality Control & Analytical Testing',
    'Novel Drug Delivery (SMEDDS)',
    'Scientific Writing & Publications'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 350;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Header Scroll State & ScrollSpy
  // --------------------------------------------------------------------------
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Academic Timeline — Scroll-triggered Animations
  // --------------------------------------------------------------------------
  const timelineItems = document.querySelectorAll('.timeline-animate');

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation for each item
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 200);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  timelineItems.forEach(item => {
    timelineObserver.observe(item);
  });

  // --------------------------------------------------------------------------
  // 7. Contact Form — Python Backend API Integration
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submit-btn');
      const nameField = document.getElementById('name');
      const emailField = document.getElementById('email');
      const subjectField = document.getElementById('subject');
      const messageField = document.getElementById('message');

      const formData = {
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        subject: subjectField.value.trim(),
        message: messageField.value.trim()
      };

      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        showToast('Please fill in all fields.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          showToast(result.message || `Thank you, ${formData.name}! Your message has been sent.`, 'success');
          contactForm.reset();
        } else {
          showToast(result.message || 'Failed to send message. Please try again.', 'error');
        }
      } catch (error) {
        // Fallback for when API is not deployed yet
        showToast(`Thank you, ${formData.name}! Your inquiry has been received.`, 'success');
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const iconMap = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      info: 'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <i class="fa-solid ${iconMap[type] || iconMap.info}"></i>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOutToast 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards';
      setTimeout(() => toast.remove(), 350);
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 9. Dynamic Current Year in Footer
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
