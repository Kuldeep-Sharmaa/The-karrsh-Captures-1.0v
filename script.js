const counters = document.querySelectorAll(".numb");
const observerOptions = {
  root: null, // Observes in relation to the viewport
  threshold: 0.5, // Trigger when 50% of the element is visible
};

// Function to animate the count
function animateCount(element, target) {
  let current = 0;
  const duration = 2000;
  const startTime = performance.now();

  function updateCount(timestamp) {
    const elapsed = timestamp - startTime;
    current = Math.min(target, Math.ceil((elapsed / duration) * target));
    element.textContent = current + "+";

    if (current < target) {
      requestAnimationFrame(updateCount);
    }
  }

  requestAnimationFrame(updateCount);
}

// Intersection Observer to detect when elements come into view
const observers = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target, 10);
      entry.target.textContent = entry.target.dataset.initial + "+";
      animateCount(entry.target, target);
    }
  });
}, observerOptions);

// Attach observer to each counter element
counters.forEach((counter) => {
  observers.observe(counter);
});

// Intersection observer to detect when the section is in view
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Trigger animation for each counter
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target"), 10);
          if (!counter.classList.contains("animated")) {
            // Check if the animation is already applied
            animateCount(counter, target);
            counter.classList.add("animated"); // Mark as animated
          }
        });

        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5,
  }
);

// Observe the section containing the numbers
const numbersSection = document.querySelector(".numbers");
if (numbersSection) {
  observer.observe(numbersSection);
}

// skills
document.addEventListener("DOMContentLoaded", () => {
  const skillBars = document.querySelectorAll(".skill-bar-fill");
  const skillsSection = document.querySelector(".skills-container");

  const animateSkillBars = () => {
    skillBars.forEach((bar) => {
      bar.style.transition = "none";
      bar.style.width = "0%";
      setTimeout(() => {
        bar.style.transition = "width 2s ease-in-out";
        const skillValue = bar.getAttribute("data-skill");
        bar.style.width = skillValue;
      }, 100);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(skillsSection);
});

// Function to handle filtering and active class
function handleFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  // Default category set to "Portraits"
  let defaultCategory = "Portraits";

  // Find and activate the default category button
  const defaultButton = document.querySelector(
    `.filter-button[data-category="${defaultCategory}"]`
  );
  if (defaultButton) {
    defaultButton.classList.add("active");
  }

  // Function to filter items
  function filterItems(category) {
    // Update active class on buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    document
      .querySelector(`.filter-button[data-category="${category}"]`)
      ?.classList.add("active");

    // Filter portfolio items
    portfolioItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      item.style.display =
        category === "all" || itemCategory === category ? "block" : "none";
    });
  }

  // Apply filtering for default category when the page loads
  filterItems(defaultCategory);

  // Add event listeners to all filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      filterItems(category);
    });
  });
}

// Call the function to activate filtering on page load
document.addEventListener("DOMContentLoaded", handleFilterButtons);

// Initialize filter functionality
document.addEventListener("DOMContentLoaded", handleFilterButtons);

//  loaidng images
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll(".lazy-load");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;

        // Preload the image for smooth rendering
        const imgLoader = new Image();
        imgLoader.src = src;
        imgLoader.onload = () => {
          img.src = src;
          img.classList.add("loaded");
        };
        imgLoader.onerror = () => {
          console.error("Failed to load image:", src);
        };

        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
});

// carousel
const carousel = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const cards = document.querySelectorAll(".review-card");

const visibleCards = 3;
const totalCards = cards.length;
const gap = 16;

// Clone cards to create an infinite loop effect
for (let i = 0; i < visibleCards; i++) {
  const firstClone = cards[i].cloneNode(true);
  const lastClone = cards[totalCards - 1 - i].cloneNode(true);
  carousel.appendChild(firstClone);
  carousel.prepend(lastClone);
}

const updatedCards = document.querySelectorAll(".review-card");
const updatedTotalCards = updatedCards.length;

let currentIndex = visibleCards;
carousel.style.transform = `translateX(-${
  currentIndex * (cards[0].offsetWidth + gap)
}px)`;

// Add auto-scroll functionality
let autoScrollInterval;
const startAutoScroll = () => {
  autoScrollInterval = setInterval(() => {
    nextBtn.click();
  }, 2000); // Adjust timing (e.g., 3000ms = 3 seconds)
};

const stopAutoScroll = () => {
  clearInterval(autoScrollInterval);
};

// Manual navigation: Next button
nextBtn.addEventListener("click", () => {
  stopAutoScroll(); // Stop auto-scroll temporarily
  if (currentIndex < updatedTotalCards - visibleCards) {
    currentIndex++;
    carousel.style.transition = "transform 0.5s ease-in-out";
    carousel.style.transform = `translateX(-${
      currentIndex * (cards[0].offsetWidth + gap)
    }px)`;
  }

  if (currentIndex === updatedTotalCards - visibleCards) {
    setTimeout(() => {
      carousel.style.transition = "none";
      currentIndex = visibleCards;
      carousel.style.transform = `translateX(-${
        currentIndex * (cards[0].offsetWidth + gap)
      }px)`;
    }, 500);
  }
  startAutoScroll(); // Restart auto-scroll
});

// Manual navigation: Previous button
prevBtn.addEventListener("click", () => {
  stopAutoScroll(); // Stop auto-scroll temporarily
  if (currentIndex > 0) {
    currentIndex--;
    carousel.style.transition = "transform 0.5s ease-in-out";
    carousel.style.transform = `translateX(-${
      currentIndex * (cards[0].offsetWidth + gap)
    }px)`;
  }

  if (currentIndex === 0) {
    setTimeout(() => {
      carousel.style.transition = "none";
      currentIndex = updatedTotalCards - visibleCards - 1;
      carousel.style.transform = `translateX(-${
        currentIndex * (cards[0].offsetWidth + gap)
      }px)`;
    }, 500);
  }
  startAutoScroll(); // Restart auto-scroll
});

// Handle resizing
window.addEventListener("resize", () => {
  carousel.style.transition = "none";
  carousel.style.transform = `translateX(-${
    currentIndex * (cards[0].offsetWidth + gap)
  }px)`;
});

// Start auto-scroll when the page loads
startAutoScroll();

carousel.addEventListener("mouseenter", stopAutoScroll);
carousel.addEventListener("mouseleave", startAutoScroll);

// services
document.addEventListener("DOMContentLoaded", function () {
  const serviceDetails = {
    studio: {
      title: "Studio Portraits",
      image: "images/services/studio.svg",
      description: `<div class="service-description">
  <p>
    Elevate your personal or professional image with our 
    <strong>luxury studio portrait photography</strong>. Whether you need a corporate headshot, 
    a model portfolio, or a timeless portrait, we ensure a high-end, magazine-quality finish. 
    Our expert photographers use premium lighting and artistic direction to bring out your best self.
  </p>

  <!-- What's Included Section -->
  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Personalized Consultation:</strong> Wardrobe, styling, and pose guidance tailored to your needs.</li>
    <li><strong>Professional Studio Setup:</strong> High-end lighting and backgrounds for a premium look.</li>
    <li><strong>Live Previews & Adjustments:</strong> Instant feedback to refine your shots in real-time.</li>
    <li><strong>Expert Retouching:</strong> Flawless yet natural edits to enhance your final images.</li>
  </ul>

  <!-- Why Choose Us Section -->
  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Fast turnaround with high-resolution digital images</li>
    <li>Custom packages for individuals, couples, and groups</li>
    <li>Ultra-high-resolution images perfect for print and digital use</li>
    <li>Instant previews and real-time adjustments</li>
  </ul> 
 <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
 <p class="contact-text mt-3">
    Ready to capture your best self? Let’s create something extraordinary together
  </p>

<a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Studio Session</a>



</div>
`,
    },
    landscapes: {
      title: "Landscape Photography",
      image: "images/services/landscapes.svg",
      description: `
   <div class="service-description">
  <p>
    Capture the beauty of nature with our <strong>stunning landscape photography</strong>. 
    Whether for editorial, commercial, or personal projects, our expert photographers 
    craft breathtaking visuals that bring outdoor scenery to life with unparalleled depth and clarity.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>On-Location Expertise:</strong> Scouted locations for perfect compositions.</li>
    <li><strong>Golden Hour & Aerial Shots:</strong> Maximizing natural light for dramatic effects.</li>
    <li><strong>Ultra-High Resolution:</strong> Crisp, detailed images for large-scale prints.</li>
    <li><strong>Post-Production Mastery:</strong> Advanced editing for a polished, cinematic feel.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Award-winning landscape photography expertise</li>
    <li>Exclusive access to stunning, off-the-beaten-path locations</li>
    <li>Cutting-edge gear for unparalleled image clarity</li>
    <li>Customizable packages for editorial, commercial, and fine art use</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
  <p class="contact-text mt-3">
    Capture the world through a new lens. Let’s create something extraordinary.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Landscape Session</a>
</div>

    `,
    },
    food: {
      title: "Food & Drinks Photography",
      image: "images/services/food.svg",
      description: `
    <div class="service-description">
  <p>
    Make your food and beverages <strong>look as delicious as they taste</strong> with our high-end food photography. 
    From gourmet dishes to artisanal cocktails, we bring out the textures, colors, and emotions that make your creations irresistible.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Styled Food Photography:</strong> Artistic plating, composition, and lighting.</li>
    <li><strong>Custom Set Design:</strong> Unique backgrounds and props tailored to your brand.</li>
    <li><strong>Color & Detail Enhancement:</strong> Professional editing for vibrant, true-to-life images.</li>
    <li><strong>Optimized for Marketing:</strong> Perfect for menus, advertisements, and social media.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Experienced in high-end culinary photography</li>
    <li>Collaborations with top chefs and restaurants</li>
    <li>Studio and on-location shoots available</li>
    <li>Ultra-HD resolution for digital and print use</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
  <p class="contact-text mt-3">
    Let's turn your dishes into visual masterpieces. Book your session today.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Food Shoot</a>
</div>


    `,
    },
    product: {
      title: "Product Photography",
      image: "images/services/product.svg",
      description: `
     <div class="service-description">
  <p>
    Showcase your products with <strong>premium, high-resolution imagery</strong> designed to increase engagement and sales. 
    Whether for e-commerce, advertising, or catalogs, we ensure every detail is captured with precision.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>High-Resolution Product Shots:</strong> Crisp, clear, and detailed images.</li>
    <li><strong>360° Product Photography:</strong> Interactive views to showcase every angle.</li>
    <li><strong>Creative Flat Lays & Lifestyle Shots:</strong> Styled compositions for a dynamic look.</li>
    <li><strong>Expert Retouching:</strong> Perfected colors and textures for maximum appeal.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Specialized in high-end product photography</li>
    <li>Perfect for online stores, catalogs, and advertising</li>
    <li>Fast turnaround time with bulk shoot options</li>
    <li>Optimized images for print and digital use</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
  <p class="contact-text mt-3">
    Let’s bring your products to life with world-class imagery.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Product Shoot</a>
</div>

    `,
    },
    media: {
      title: "Social Media Content Shoots",
      image: "images/services/media.svg",
      description: `
     <div class="service-description">
  <p>
    Elevate your brand’s online presence with <strong>high-impact social media content</strong>. 
    Our creative photography captures attention-grabbing visuals designed to engage audiences and enhance your digital storytelling.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Brand-Aligned Content:</strong> Tailored visuals that fit your brand identity.</li>
    <li><strong>Reels & Story Captures:</strong> Short-form content designed for maximum engagement.</li>
    <li><strong>On-Trend Aesthetics:</strong> Styled shots curated for Instagram, Facebook, and beyond.</li>
    <li><strong>Optimized for Digital Platforms:</strong> High-quality images resized for various social channels.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Expertise in viral and trend-driven content creation</li>
    <li>Fast turnaround for consistent social media posting</li>
    <li>Creative direction for impactful brand storytelling</li>
    <li>Content strategy consultation available</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
  <p class="contact-text mt-3">
    Let’s create viral-worthy content for your brand. Book your session today!
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Social Media Shoot</a>
</div>

    `,
    },
    realestate: {
      title: "Real Estate Photography",
      image: "images/services/realestate.svg",
      description: `
     <div class="service-description">
  <p>
    Showcase properties with <strong>stunning, high-definition real estate photography</strong>. 
    Whether for listings, brochures, or marketing campaigns, we capture spaces with perfect lighting and composition to attract buyers and renters.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Interior & Exterior Photography:</strong> Professionally framed shots highlighting key features.</li>
    <li><strong>Aerial Drone Photography:</strong> Capturing breathtaking views and layouts.</li>
    <li><strong>Virtual Tours & 360° Walkthroughs:</strong> Immersive experiences for online listings.</li>
    <li><strong>HDR Editing:</strong> Enhancing clarity, brightness, and realism.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Expertise in real estate marketing visuals</li>
    <li>Fast delivery for property listings</li>
    <li>Advanced editing for magazine-quality results</li>
    <li>Tailored shoots for agents, developers, and homeowners</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
  <p class="contact-text mt-3">
    Let’s turn listings into sold properties with premium photography.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Real Estate Shoot</a>
</div>

    `,
    },
    preweddings: {
      title: "Pre-Wedding Photography",
      image: "images/services/pre_wedding.svg",
      description: `
     <div class="service-description">
  <p>
    Celebrate your love story with <strong>intimate and breathtaking pre-wedding photography</strong>. 
    Our romantic shoots capture emotions, chemistry, and the unique essence of your journey together.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Scenic Location Shoots:</strong> Destination-style photography for a cinematic touch.</li>
    <li><strong>Wardrobe & Styling Assistance:</strong> Expert guidance for the perfect look.</li>
    <li><strong>Creative Storytelling:</strong> Posing and direction to bring your love story to life.</li>
    <li><strong>Fine Art Editing:</strong> Dreamy, high-end retouching for timeless imagery.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Specialized in luxury and destination pre-weddings</li>
    <li>Experienced in natural and cinematic storytelling</li>
    <li>Tailored concepts for every couple</li>
    <li>High-resolution imagery for prints and albums</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>
  <p class="contact-text mt-3">
    Let’s create a love story that lasts forever. Book your pre-wedding shoot today!
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Pre-Wedding Shoot</a>
</div>

    `,
    },
    weddings: {
      title: "Studio Portraits",
      image: "images/services/wedding.svg",
      description: `<div class="service-description">
  <p>
    Celebrate love with <strong>timeless wedding photography</strong> that captures every emotion, detail, and moment of your special day. 
    From intimate ceremonies to grand celebrations, we create breathtaking imagery that tells your unique love story with elegance and authenticity.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Pre-Wedding Consultation:</strong> Personalized planning to understand your vision and preferences.</li>
    <li><strong>Full-Day Coverage:</strong> From bridal preparations to the final dance, we document it all.</li>
    <li><strong>Cinematic Couple & Candid Shots:</strong> Artistic portraits and natural moments that reflect genuine emotions.</li>
    <li><strong>High-End Editing & Retouching:</strong> Magazine-quality enhancements while maintaining a natural look.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Specialists in luxury and destination wedding photography</li>
    <li>Storytelling approach to create a cinematic wedding album</li>
    <li>Cutting-edge gear for high-resolution, vibrant imagery</li>
    <li>Tailored packages for every couple’s unique journey</li>
  </ul>

   <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>

  <p class="contact-text mt-3">
    Your wedding is a once-in-a-lifetime event. Let’s capture every cherished moment beautifully.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Wedding Photography</a>
</div>

`,
    },
    fashion: {
      title: "Fashion Photography",
      image: "images/services/fashion.svg",
      description: `
     <div class="service-description">
  <p>
    Define style with <strong>high-fashion editorial photography</strong> that blends art, creativity, and sophistication. 
    Whether it's for designer campaigns, lookbooks, or magazine spreads, we craft compelling visuals that showcase fashion in its finest form.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Creative Concept Development:</strong> Mood boards, styling, and art direction tailored to your vision.</li>
    <li><strong>Professional Studio & On-Location Shoots:</strong> Luxury settings that elevate every frame.</li>
    <li><strong>High-Fashion Retouching:</strong> Flawless post-production for editorial-quality results.</li>
    <li><strong>Expert Model Direction:</strong> Dynamic posing and movement for striking visuals.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Industry-leading expertise in high-end fashion campaigns</li>
    <li>Cutting-edge lighting and composition techniques</li>
    <li>Tailored photography for designers, brands, and influencers</li>
    <li>Seamless execution with an elite creative team</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>

  <p class="contact-text mt-3">
    Ready to make a statement? Let’s create bold and iconic imagery together.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Fashion Shoot</a>
</div>

    `,
    },
    event: {
      title: "Event Photography",
      image: "images/services/event.svg",
      description: `
      <div class="service-description">
  <p>
    Relive your most cherished moments with <strong>expert event photography</strong> that captures emotions, energy, and unforgettable memories. 
    From grand celebrations to intimate gatherings, we preserve every detail with authenticity and style.
  </p>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-check-to-slot modal-icon"></i>
    <h4 class="service-included">What’s Included?</h4>
  </div>
  <ul class="service-modal-list">
    <li><strong>Candid & Documentary-Style Shots:</strong> Natural, unposed moments that tell a story.</li>
    <li><strong>Professional Lighting & Composition:</strong> Perfectly framed shots, even in challenging conditions.</li>
    <li><strong>On-Site Coverage:</strong> Full event documentation from start to finish.</li>
    <li><strong>Quick Turnaround:</strong> Rapid delivery of edited images for immediate sharing.</li>
  </ul>

  <div class="modal-header-wrapper">
    <i class="fa-solid fa-award modal-icon"></i>
    <h4 class="service-why-choose">Why Choose Us?</h4>
  </div>
  <ul class="service-modal-list">
    <li>Experience in high-profile and large-scale events</li>
    <li>Discreet and professional approach to capture genuine emotions</li>
    <li>High-resolution images for digital and print use</li>
    <li>Custom packages for weddings, corporate events, and private celebrations</li>
  </ul>

  <div class="trust-section mt-4" id="trustSection">
      <h3 class="service-included">
        <i class="fas fa-shield-alt"></i> Trust & Quality Assurance
      </h3>
      <div class="trust-icons">
        <div class="trust-item">
          <i class="fas fa-check-circle icon"></i>
          <span class="text">100% Satisfaction Guarantee</span>
        </div>
        <div class="trust-item">
          <i class="far fa-calendar-alt icon"></i>
          <span class="text">Flexible Scheduling</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-star icon"></i>
          <span class="text">Rated 5 Stars by Clients</span>
        </div>
      </div>
    </div>


  <p class="contact-text mt-3">
    Your moments deserve to be remembered forever. Let’s capture them with perfection.
  </p>

  <a id="contactLink" href="./contact-TKC/" class="btn btn-primary rounded-pill mt-3">Book Your Event Photography</a>
</div>

    `,
    },
  };

  document.querySelectorAll(".service-box").forEach((service) => {
    service.addEventListener("click", function () {
      const serviceKey = this.getAttribute("data-service");
      if (serviceDetails[serviceKey]) {
        document.getElementById("serviceModalLabel").textContent =
          serviceDetails[serviceKey].title;
        document.getElementById("serviceImage").src =
          serviceDetails[serviceKey].image;
        document.getElementById("serviceDescription").innerHTML =
          serviceDetails[serviceKey].description;
        document.getElementById("contactLink").href = "./contact-TKC/";

        // Calling the function to activate the animation
        addTrustAnimation();
      }
    });
  });
});
function addTrustAnimation() {
  const trustSection = document.getElementById("trustSection");
  if (!trustSection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        trustSection.classList.add("show");
      } else {
        trustSection.classList.remove("show");
      }
    },
    { threshold: 0.9 }
  );

  observer.observe(trustSection);
}

// Calling function to activate observer
addTrustAnimation();

// portfolio
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll(".portfolio-image");
  const navItems = document.querySelectorAll(".sidebar li");
  const sidebar = document.querySelector(".sidebar");
  const imageContainer = document.querySelector(".image-container");

  let isClickScrolling = false;

  // Show/hide sidebar based on container visibility
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sidebar.classList.add("visible");
        } else {
          sidebar.classList.remove("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(imageContainer);

  // Helper: Set the active category
  function setActiveCategory(index) {
    navItems.forEach((item, i) => {
      item.classList.toggle("active", i === index);
    });
  }

  // Core ScrollSpy Logic using container midpoint and top/bottom checks
  function updateActiveCategory() {
    if (isClickScrolling) return; // Skip updates if a click-based scroll is active

    const containerScroll = imageContainer.scrollTop;
    const containerHeight = imageContainer.clientHeight;
    const scrollHeight = imageContainer.scrollHeight;

    // Near top: force first category
    if (containerScroll < 50) {
      setActiveCategory(0);
      return;
    }
    // Near bottom: force last category
    const scrollFromBottom = scrollHeight - (containerScroll + containerHeight);
    if (scrollFromBottom < 50) {
      setActiveCategory(images.length - 1);
      return;
    }
    // Otherwise, use the container's midpoint to determine the closest image
    const containerMid = containerScroll + containerHeight / 2;
    let currentIndex = 0;
    let minDist = Infinity;
    images.forEach((img, i) => {
      const imgMid = img.offsetTop + img.offsetHeight / 2;
      const dist = Math.abs(containerMid - imgMid);
      if (dist < minDist) {
        minDist = dist;
        currentIndex = i;
      }
    });
    setActiveCategory(currentIndex);
  }

  // Listen for scroll events on the container
  imageContainer.addEventListener("scroll", updateActiveCategory);

  // Click event: when a sidebar item is tapped
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Immediately set clicked category as active
      setActiveCategory(index);
      // Lock scroll updates during smooth scroll
      isClickScrolling = true;
      // Scroll smoothly to the target image and center it in the view
      images[index].scrollIntoView({ behavior: "smooth", block: "center" });
      // Re-enable scrollspy after a sufficient delay (adjust as needed)
      setTimeout(() => {
        isClickScrolling = false;
        updateActiveCategory();
      }, 1500);
    });
  });

  // Initialize active category
  updateActiveCategory();
});
