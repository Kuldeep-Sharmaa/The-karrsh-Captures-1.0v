const counters = document.querySelectorAll(".numb");

// Function to animate the count
function animateCount(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 100); // Increment for smoother animation
  const duration = 2000; // Total duration in milliseconds
  const interval = duration / (target / increment);

  const counterInterval = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target; // Set final value to target
      clearInterval(counterInterval);
    } else {
      element.textContent = current; // Update value
    }
  }, interval);
}

// Intersection observer to detect when the section is in view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // For each counter, get the target value and start animation
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute("data-target"), 10);
          animateCount(counter, target);
        });
      }
    });
  },
  {
    threshold: 0.5,
  }
);

// Observe the numbers section
const numbersSection = document.querySelector(".numbers");
observer.observe(numbersSection);

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
