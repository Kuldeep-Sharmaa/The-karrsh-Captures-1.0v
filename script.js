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
