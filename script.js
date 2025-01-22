// Select all elements with the class "numb"
const counters = document.querySelectorAll(".numb");

// Function to animate the count
function animateCount(element, target) {
  let current = 0; // Initial value
  const duration = 3000; // Total duration in milliseconds
  const startTime = performance.now(); // Start time of animation

  function updateCount(timestamp) {
    const elapsed = timestamp - startTime; // Time elapsed since animation start
    current = Math.min(
      target,
      Math.ceil((elapsed / duration) * target) // Calculate current value
    );

    element.textContent = current + "+"; // Update the element text

    if (current < target) {
      requestAnimationFrame(updateCount); // Continue animation
    }
  }

  requestAnimationFrame(updateCount); // Start the animation
}

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
  let animationStarted = false;
  const animateSkillBars = () => {
    skillBars.forEach((bar) => {
      const skillValue = bar.getAttribute("data-skill");
      bar.style.width = "0";
      setTimeout(() => {
        bar.style.width = skillValue;
      }, 200);
    });
  };

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const handleScroll = () => {
    if (isElementInViewport(skillsSection) && !animationStarted) {
      animationStarted = true;
      animateSkillBars();

      // Reset the flag when the section is out of view
      setTimeout(() => {
        animationStarted = false;
      }, 2000);
    }
  };

  window.addEventListener("scroll", handleScroll);
});

// Function to handle filtering and active class
function handleFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  // Add event listeners to all filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      // Update active class on filter buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter portfolio items based on category
      portfolioItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        item.style.display =
          category === "all" || itemCategory === category ? "block" : "none";
      });

      // Center filtered items
      const visibleItems = Array.from(portfolioItems).filter(
        (item) =>
          item.style.display === "block" ||
          item.style.display === "inline-block"
      );

      if (visibleItems.length > 0) {
        // Center the grid containing visible items
        const firstItem = visibleItems[0];
        firstItem.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    });
  });
}

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
