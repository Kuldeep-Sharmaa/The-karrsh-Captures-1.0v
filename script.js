// Select all elements with the class 'numb'
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
    threshold: 0.5, // Trigger when 50% of the section is visible
  }
);

// Observe the numbers section
const numbersSection = document.querySelector(".numbers");
observer.observe(numbersSection);

// skills
document.addEventListener("DOMContentLoaded", () => {
  const skillBars = document.querySelectorAll(".skill-bar-fill");
  const skillsSection = document.querySelector(".skills-container");
  let animationStarted = false; // Flag to prevent multiple triggers

  const animateSkillBars = () => {
    skillBars.forEach((bar) => {
      const skillValue = bar.getAttribute("data-skill");
      bar.style.width = "0"; // Reset the width to 0 before starting
      setTimeout(() => {
        bar.style.width = skillValue;
      }, 200); // Slight delay for smooth animation
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
      animationStarted = true; // Prevent multiple animations
      animateSkillBars();

      // Reset the flag when the section is out of view
      setTimeout(() => {
        animationStarted = false;
      }, 2000); // Adjust based on your animation duration
    }
  };

  window.addEventListener("scroll", handleScroll);
});

// flitter
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    document.querySelectorAll(".portfolio-item").forEach((item) => {
      if (
        category === "all" ||
        item.getAttribute("data-category") === category
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});
// active class
// Select all filter buttons
const filterButtons = document.querySelectorAll(".filter-button");

// Add event listeners to all buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove the active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Add the active class to the clicked button
    button.classList.add("active");

    // Filter the portfolio items based on the selected category
    const category = button.getAttribute("data-category");
    filterPortfolioItems(category);
  });
});

// Function to filter portfolio items
function filterPortfolioItems(category) {
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  portfolioItems.forEach((item) => {
    const itemCategory = item.getAttribute("data-category");

    if (category === "all" || itemCategory === category) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
}
