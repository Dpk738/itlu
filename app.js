/* ==========================================================================
   ITLU - BRAND LOGIC & INTERACTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INITIALIZE LUCIDE ICONS
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. SMOOTH SCROLLING (LENIS)
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Prevent scrolling when modals are open
    window.lockScroll = () => lenis.stop();
    window.unlockScroll = () => lenis.start();
  } else {
    // Fallback for scrolling lock
    window.lockScroll = () => document.body.style.overflow = 'hidden';
    window.unlockScroll = () => document.body.style.overflow = '';
  }

  // 2.5 PRELOADER & INITIAL SCROLL LOCK
  if (window.lockScroll) {
    window.lockScroll();
  }

  const hidePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('fade-out');
      document.body.classList.remove('loading');
      if (window.unlockScroll) {
        window.unlockScroll();
      }
    }
  };

  let pageLoaded = false;
  let timerFinished = false;

  const checkAndHide = () => {
    if (pageLoaded && timerFinished) {
      hidePreloader();
    }
  };

  // Enforce a minimum display time of 1.5s (1500ms) for the preloader
  setTimeout(() => {
    timerFinished = true;
    checkAndHide();
  }, 1500);

  // Check if fully loaded
  if (document.readyState === 'complete') {
    pageLoaded = true;
    checkAndHide();
  } else {
    window.addEventListener('load', () => {
      pageLoaded = true;
      checkAndHide();
    });
  }

  // 3. SCROLL PROGRESS INDICATOR
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
      progressEl.style.width = scrolled + '%';
    }

    // Header Shrink Logic
    const header = document.querySelector('.header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // 4. PARALLAX EFFECTS ON HERO & CATERING
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset;
    
    // Hero Background Parallax: scales down from 1.15 to 1.0 and moves slower (parallax)
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg) {
      const scale = Math.max(1.0, 1.15 - scrollPos * 0.0004);
      const yPos = scrollPos * 0.15;
      heroBg.style.transform = `scale(${scale}) translateY(${yPos}px)`;
    }

    // Hero Text & Trust Indicators Parallax Fade
    const heroText = document.querySelector('.hero-text-block');
    const heroTrust = document.querySelector('.hero-trust-indicators');
    
    if (heroText) {
      const textY = scrollPos * 0.35;
      const textOpacity = Math.max(0, 1 - scrollPos / 600);
      heroText.style.transform = `translateY(${textY}px)`;
      heroText.style.opacity = `${textOpacity}`;
    }
    
    if (heroTrust) {
      const trustY = scrollPos * 0.2;
      const trustOpacity = Math.max(0, 1 - scrollPos / 400);
      heroTrust.style.transform = `translateY(${trustY}px)`;
      heroTrust.style.opacity = `${trustOpacity}`;
    }

    // Catering Parallax Background
    const cateringBg = document.querySelector('.catering-bg-parallax');
    if (cateringBg) {
      const parent = document.querySelector('.catering-section');
      const rect = parent.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate how far the section is scrolled into view
      if (rect.top < viewHeight && rect.bottom > 0) {
        const speed = 0.2;
        const yOffset = (rect.top - viewHeight) * speed;
        cateringBg.style.transform = `scale(1.1) translateY(${yOffset * -1}px)`;
      }
    }
  });

  // 5. INTERSECTION OBSERVER - SCROLL REVEALS
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .fade-up');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Trigger animation once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // 6. MENU DATABASE
  const menuData = {
    "Tiffins": [
      { name: "Neyyi Karam Dosa", price: "₹140", desc: "A golden crispy dosa layered with spicy red chili chutney and loaded with fresh melted ghee.", img: "Assets/itlu_image _database/622745287_17992400642871362_8422361011651136067_n.jpg" },
      { name: "Idli Platter", price: "₹120", desc: "A colorfully curated plate of piping hot idlis representing regional vegetable infusions (beetroot, carrot, spinach).", img: "Assets/itlu_image _database/625157085_18055613045675993_7522438250471273845_n.jpg" },
      { name: "Poori Kesari Bath", price: "₹150", desc: "Crispy fried pooris served with spicy aloo kurma and sweet, aromatic ghee-laden rava Kesari.", img: "Assets/itlu_image _database/625213789_17964886113001916_7923004845353311576_n.jpg" },
      { name: "Kothimeera Idli Fry", price: "₹110", desc: "Crispy pan-fried idli wedges tossed in fresh ground coriander paste and home-ground spices.", img: "Assets/itlu_image _database/626765265_18052124294474099_218046159160644053_n.jpg" }
    ],
    "Soups": [
      { name: "Tomato Dhaniya Shorba", price: "₹110", desc: "A classic warm soup crafted with fresh tomatoes, coriander stems, cumin, and toasted spices.", img: "Assets/itlu_image _database/620383878_17877541518467740_4650319118009245970_n.jpg" },
      { name: "Ammamma Shorba", price: "₹120", desc: "Traditional regional soup prepared with seasonal country vegetables and traditional wellness spices.", img: "Assets/itlu_image _database/521967058_17968097015926779_6309576831323596186_n.jpg" }
    ],
    "Appetizers": [
      { name: "Paneer Tikka on Leaf", price: "₹240", desc: "Cottage cheese chunks marinated in stone-ground spices, grilled to perfection, and served on banana leaves.", img: "Assets/itlu_image _database/618708352_17872199406508938_1509936812273140897_n.jpg" },
      { name: "Kaju Paneer Pakoda", price: "₹220", desc: "Spiced paneer batons and select cashew nuts coated in gram flour batter and crispy fried.", img: "Assets/itlu_image _database/541584508_17972499878926779_5609532283301448626_n.jpg" },
      { name: "Gobi Manchurian", price: "₹180", desc: "Crispy cauliflower florets tossed with garlic, chilies, soy sauce, and scallions for a traditional Indo-Chinese twist.", img: "Assets/itlu_image _database/504139045_17962792343926779_8812153317127234739_n.webp" }
    ],
    "Mains": [
      { name: "Chinthamani Paneer Iguru", price: "₹280", desc: "Fresh paneer blocks slow-cooked in a tangy, spicy tamarind and dry red chili reduction from Tamil Nadu.", img: "Assets/itlu_image _database/623864433_18094447376311453_1220227685774927103_n.jpg" },
      { name: "Raagi Dosa Special", price: "₹160", desc: "Nutritious and light finger millet crepe cooked crisp with a filling of regional potato mash.", img: "Assets/itlu_image _database/627678870_18143400640462096_7656673626411368872_n.jpg" }
    ],
    "Ammamma Specials": [
      { name: "Gutti Vankaya Koora", price: "₹250", desc: "Tender brinjals stuffed with roasted peanut, sesame, and coconut spice paste, slow-cooked in thick gravy.", img: "Assets/itlu_image _database/521967058_17968097015926779_6309576831323596186_n.jpg" },
      { name: "Pappu Charu", price: "₹190", desc: "Comforting thick yellow lentils cooked with tamarind, tomatoes, garlic, and tempered with ghee and mustard.", img: "Assets/itlu_image _database/547901672_17973724025926779_818756234925879880_n.jpg" }
    ],
    "Special Pulaos": [
      { name: "Mushroom Potlam Pulao", price: "₹290", desc: "Spiced button mushrooms and long-grain rice sealed inside a banana leaf pouch (Potlam) and steamed.", img: "Assets/itlu_image _database/623879003_18194995093340756_9215689106230934377_n.jpg" },
      { name: "Heritage Veg Pulao", price: "₹260", desc: "Fragrant rice cooked in brass vessels with local greens, whole spices, and hand-selected vegetables.", img: "Assets/itlu_image _database/543582091_17973129800926779_8413220345255205412_n.jpg" }
    ],
    "Indian Breads": [
      { name: "Malabar Parotta", price: "₹60", desc: "Flaky, layered soft flour bread prepared on flat iron grills, typical of the Malabar coast.", img: "Assets/itlu_image _database/618681070_17910697440297636_4352926319813957010_n.jpg" },
      { name: "Butter Roti", price: "₹50", desc: "Whole wheat hand-stretched bread baked inside our clay tandoor and brushed with fresh farm butter.", img: "Assets/itlu_image _database/618681070_17910697440297636_4352926319813957010_n.jpg" }
    ],
    "Rice & Noodles": [
      { name: "Itlu Special Noodles", price: "₹220", desc: "Hakka style wheat noodles tossed with crisp matchstick vegetables and light dark soy reduction.", img: "Assets/itlu_image _database/624746402_17995950401857411_9140474541877899926_n.jpg" },
      { name: "Jeera Rice", price: "₹180", desc: "Pristine basmati rice tossed gently with golden browned cumin seeds and fresh clarified ghee.", img: "Assets/itlu_image _database/543582091_17973129800926779_8413220345255205412_n.jpg" }
    ],
    "Jain Specials": [
      { name: "Jain Paneer Iguru", price: "₹280", desc: "Cottage cheese prepared with custom tomatoes, capsicums, cashew gravy, entirely free of onions and garlic.", img: "Assets/itlu_image _database/623864433_18094447376311453_1220227685774927103_n.jpg" },
      { name: "Jain Neyyi Dosa", price: "₹140", desc: "Golden dosa cooked crisp with clarified butter, served with coconut and tomato-mint chutneys.", img: "Assets/itlu_image _database/622745287_17992400642871362_8422361011651136067_n.jpg" }
    ],
    "Snacks": [
      { name: "Kothimeera Idli Fry", price: "₹110", desc: "Crispy pan-fried idli wedges tossed in fresh ground coriander paste and home-ground spices.", img: "Assets/itlu_image _database/626765265_18052124294474099_218046159160644053_n.jpg" },
      { name: "Crispy Potato Wedges", price: "₹130", desc: "Local hand-cut potatoes double fried and dusted with gunpowder spice mix.", img: "Assets/itlu_image _database/626639672_18183675904367959_2478811893397135274_n.jpg" }
    ],
    "Desserts": [
      { name: "Special Fruit Custard", price: "₹150", desc: "A velvety, vanilla-infused chilled milk reduction containing seasonal chopped fruits and pomegranate gems.", img: "Assets/itlu_image _database/625564216_18084035713945599_5734772208631499046_n.jpg" },
      { name: "Apricot Delight", price: "₹160", desc: "A classic Hyderabadi delicacy made of stewed apricots, layered with creamy custard, and sponge cake crumbs.", img: "Assets/itlu_image _database/489347014_17956920731926779_6466617081249076745_n.webp" }
    ],
    "Beverages": [
      { name: "Traditional Filter Coffee", price: "₹60", desc: "Strong chicory-blend coffee brewed in traditional brass filters, frothed with steaming milk.", img: "Assets/itlu_image _database/534727094_2182478875586307_8932786903368024872_n.jpg" },
      { name: "Fresh Buttermilk", price: "₹50", desc: "Chilled yogurt churned with green chilies, ginger, curry leaves, and coriander.", img: "Assets/itlu_image _database/503952803_17962915355926779_9109115171340283320_n.jpg" }
    ],
    "Kids Menu": [
      { name: "Teddy Bear Dosa", price: "₹130", desc: "A cute, teddy-bear shaped plain crispy dosa served with fruit jam and mild white coconut chutney.", img: "Assets/itlu_image _database/618493326_17858577678535459_148182619040415358_n.jpg" },
      { name: "Mild French Fries", price: "₹110", desc: "Crispy golden potato fingers served with non-spicy tomato sauce.", img: "Assets/itlu_image _database/624790918_18111095539646925_3133543974521645206_n.jpg" }
    ]
  };

  // Render Category preview (Showcase Grid)
  const renderPreviewCategory = (category) => {
    const grid = document.getElementById('menu-preview-grid');
    if (!grid) return;
    
    // Smooth transition fade out
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
      grid.innerHTML = '';
      
      const items = menuData[category] || [];
      items.forEach((item) => {
        const el = document.createElement('div');
        el.className = 'menu-preview-item';
        el.innerHTML = `
          <img src="${item.img}" alt="${item.name}" class="menu-item-img">
          <div class="menu-item-details">
            <div class="menu-item-header">
              <h4 class="menu-item-name">${item.name}</h4>
              <span class="menu-item-price">${item.price}</span>
            </div>
            <p class="menu-item-desc">${item.desc}</p>
          </div>
        `;
        grid.appendChild(el);
      });
      
      // Fade back in
      grid.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
    }, 200);
  };

  // Initialize category preview
  renderPreviewCategory('Tiffins');

  // Preview Category tabs click handlers
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const cat = e.target.getAttribute('data-category');
      renderPreviewCategory(cat);
    });
  });

  // Category trigger clicks inside cards
  document.querySelectorAll('.select-category-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const cat = e.target.getAttribute('data-category');
      const targetTab = document.querySelector(`.category-tab[data-category="${cat}"]`);
      if (targetTab) {
        targetTab.click();
      }
    });
  });

  // 7. POPULATE FULL EDITORIAL MENU MODAL
  const modalContentEl = document.getElementById('menu-modal-content');
  if (modalContentEl) {
    let htmlContent = '';
    
    // Structure items by section mapping
    const sectionMapping = {
      "Tiffins": { id: "m-tiffins", title: "Traditional Tiffins" },
      "Soups": { id: "m-soups", title: "Shorbas & Soups" },
      "Appetizers": { id: "m-appetizers", title: "Appetizers" },
      "Mains": { id: "m-mains", title: "Mains & Curries" },
      "Ammamma Specials": { id: "m-specials", title: "Ammamma Specials" },
      "Special Pulaos": { id: "m-pulaos", title: "Itlu Signature Pulaos" },
      "Indian Breads": { id: "m-breads", title: "Indian Flatbreads" },
      "Rice & Noodles": { id: "m-rice", title: "Rice & Noodles" },
      "Jain Specials": { id: "m-jain", title: "Jain Specials" },
      "Snacks": { id: "m-snacks", title: "Savoury Snacks" },
      "Desserts": { id: "m-desserts", title: "Delectable Desserts" },
      "Beverages": { id: "m-beverages", title: "Beverages" },
      "Kids Menu": { id: "m-kids", title: "Young Diners Menu" }
    };
    
    Object.keys(sectionMapping).forEach((categoryKey) => {
      const mapped = sectionMapping[categoryKey];
      const items = menuData[categoryKey] || [];
      
      htmlContent += `
        <div class="menu-modal-section" id="${mapped.id}">
          <div class="menu-section-header">
            <h3 class="menu-section-title">${mapped.title}</h3>
            <div class="menu-section-line"></div>
          </div>
          <div class="menu-modal-grid">
      `;
      
      items.forEach((item) => {
        htmlContent += `
          <div class="menu-item-row">
            <div class="menu-item-row-header">
              <span class="menu-item-row-name">${item.name}</span>
              <div class="menu-item-row-dots"></div>
              <span class="menu-item-row-price">${item.price}</span>
            </div>
            <p class="menu-item-row-desc">${item.desc}</p>
          </div>
        `;
      });
      
      htmlContent += `
          </div>
        </div>
      `;
    });
    
    modalContentEl.innerHTML = htmlContent;
  }

  // Handle Full Menu Modal Active Sidebar Links while scrolling
  const menuSections = document.querySelectorAll('.menu-modal-section');
  const sidebarLinks = document.querySelectorAll('.sidebar-tab');
  
  if (modalContentEl) {
    modalContentEl.addEventListener('scroll', () => {
      let current = '';
      
      menuSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollVal = modalContentEl.scrollTop + 100;
        
        if (scrollVal >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
      
      sidebarLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
          link.classList.add('active');
        }
      });
    });
  }

  // Menu Sidebar Tabs clicking to smooth scroll inside modal
  sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      sidebarLinks.forEach(l => l.classList.remove('active'));
      e.target.classList.add('active');
      
      const targetId = e.target.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection && modalContentEl) {
        modalContentEl.scrollTo({
          top: targetSection.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  // 8. TESTIMONIAL CAROUSEL SLIDER LOGIC
  const slides = document.querySelectorAll('.review-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  let carouselInterval;
  
  const showSlide = (idx) => {
    slides.forEach(s => s.classList.remove('active'));
    indicators.forEach(i => i.classList.remove('active'));
    
    slides[idx].classList.add('active');
    indicators[idx].classList.add('active');
    
    const carousel = document.getElementById('reviews-carousel');
    if (carousel) {
      carousel.style.transform = `translateX(-${idx * 100}%)`;
    }
    currentSlide = idx;
  };
  
  const nextSlide = () => {
    let next = currentSlide + 1;
    if (next >= slides.length) next = 0;
    showSlide(next);
  };
  
  const startCarousel = () => {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, 5000);
  };
  
  const stopCarousel = () => {
    if (carouselInterval) clearInterval(carouselInterval);
  };

  startCarousel();

  // Handle Carousel Indicator Clicks
  indicators.forEach((ind) => {
    ind.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'));
      showSlide(idx);
      startCarousel(); // Reset interval
    });
  });

  // Pause carousel on hover
  const carouselWrapper = document.querySelector('.reviews-carousel-wrapper');
  if (carouselWrapper) {
    carouselWrapper.addEventListener('mouseenter', stopCarousel);
    carouselWrapper.addEventListener('mouseleave', startCarousel);
  }

  // 9. HEADER MOBILE NAVIGATION OVERLAY
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-item');

  const toggleMobileNav = () => {
    const isActive = mobileOverlay.classList.toggle('active');
    mobileBtn.classList.toggle('active');
    if (isActive) {
      window.lockScroll();
    } else {
      window.unlockScroll();
    }
  };

  if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleMobileNav);
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
      mobileBtn.classList.remove('active');
      window.unlockScroll();
    });
  });

  // 10. PREMIUM MODAL POPUP TRIGGERS
  const setupModal = (triggerClass, modalId, closeId) => {
    const triggers = document.querySelectorAll(triggerClass);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);
    
    if (!modal) return;
    
    const openModal = () => {
      modal.classList.add('active');
      window.lockScroll();
    };
    
    const closeModal = () => {
      modal.classList.remove('active');
      window.unlockScroll();
      // Reset forms inside if any
      const form = modal.querySelector('form');
      if (form) form.reset();
      const successMsg = modal.querySelector('.form-success-message');
      if (successMsg) successMsg.style.display = 'none';
      if (form) form.style.display = 'block';
    };
    
    triggers.forEach(t => t.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    
    // Close modal on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  };

  setupModal('.open-menu-modal', 'menu-modal', 'close-menu-modal');
  setupModal('.open-reserve-modal', 'reserve-modal', 'close-reserve-modal');

  // 11. INTERACTIVE FORM VALIDATIONS & SUCCESS FLOW
  
  // Reservation Form
  const reserveForm = document.getElementById('reservation-form');
  const reserveSuccess = document.getElementById('reserve-success');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic input capture
      const name = document.getElementById('r-name').value;
      const phone = document.getElementById('r-phone').value;
      const guests = document.getElementById('r-guests').value;
      const date = document.getElementById('r-date').value;
      const time = document.getElementById('r-time').value;
      
      console.log('Booked Table:', { name, phone, guests, date, time });
      
      // Transition display to success message
      reserveForm.style.display = 'none';
      reserveSuccess.style.display = 'block';
    });
  }

  // Catering Inquiry Form
  const cateringForm = document.getElementById('catering-form');
  const cateringSuccess = document.getElementById('catering-success');
  if (cateringForm) {
    cateringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('c-name').value;
      const phone = document.getElementById('c-phone').value;
      const guests = document.getElementById('c-guests').value;
      const type = document.getElementById('c-type').value;
      
      console.log('Catering Inquiry:', { name, phone, guests, type });
      
      cateringForm.style.display = 'none';
      cateringSuccess.style.display = 'block';
    });
  }

  // Magnetic Buttons effect for luxury CTAs
  const magneticButtons = document.querySelectorAll('.btn-magnetic');
  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
});
