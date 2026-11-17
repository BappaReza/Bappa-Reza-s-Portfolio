/* Simple interactions for Bappa's portfolio website. */
document.addEventListener("DOMContentLoaded", function () {
  var page = document.documentElement;
  var header = document.querySelector(".site-header");
  var menu = document.getElementById("navLinks");
  var menuButton = document.getElementById("menuToggle");
  var themeButton = document.getElementById("themeToggle");
  var topButton = document.getElementById("backToTop");
  var navLinks = document.querySelectorAll(".nav-link");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Theme button
  var savedTheme = localStorage.getItem("bappa-portfolio-theme");
  if (savedTheme === "light" || savedTheme === "dark") page.dataset.theme = savedTheme;

  function updateThemeButton() {
    var lightMode = page.dataset.theme === "light";
    themeButton.setAttribute("aria-label", lightMode ? "Switch to dark theme" : "Switch to light theme");
    themeButton.title = lightMode ? "Switch to dark theme" : "Switch to light theme";
  }

  themeButton.addEventListener("click", function () {
    var newTheme = page.dataset.theme === "light" ? "dark" : "light";
    page.dataset.theme = newTheme;
    localStorage.setItem("bappa-portfolio-theme", newTheme);
    updateThemeButton();
  });
  updateThemeButton();

  // Mobile menu
  function closeMenu() {
    menu.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }

  menuButton.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    menuButton.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      closeMenu();
    });
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  // Typing text in the hero section
  var typedText = document.getElementById("typedText");
  var roles = ["Software Engineering Student", "Aspiring Software Developer", "Problem Solver", "Mathematics & Physics Tutor"];
  var roleNumber = 0;
  var letterNumber = 0;
  var deleting = false;

  function typeRole() {
    var role = roles[roleNumber];
    typedText.textContent = role.substring(0, letterNumber);

    if (!deleting && letterNumber < role.length) {
      letterNumber++;
      setTimeout(typeRole, 75);
    } else if (!deleting) {
      deleting = true;
      setTimeout(typeRole, 1350);
    } else if (letterNumber > 0) {
      letterNumber--;
      setTimeout(typeRole, 35);
    } else {
      deleting = false;
      roleNumber = (roleNumber + 1) % roles.length;
      setTimeout(typeRole, 300);
    }
  }

  if (reduceMotion) typedText.textContent = roles[0];
  else typeRole();

  // Fade cards into view
  var revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (items, observer) {
      items.forEach(function (item) {
        if (item.isIntersecting) {
          item.target.classList.add("visible");
          observer.unobserve(item.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add("visible"); });
  }

  // Header, active link, and back-to-top button
  var sections = document.querySelectorAll("main section[id]");
  function updateScrollItems() {
    var currentSection = "home";
    var scrollPosition = window.scrollY + 150;
    header.classList.toggle("scrolled", window.scrollY > 25);
    topButton.classList.toggle("visible", window.scrollY > 500);

    sections.forEach(function (section) {
      if (scrollPosition >= section.offsetTop) currentSection = section.id;
    });
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + currentSection;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", updateScrollItems, { passive: true });
  topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
  updateScrollItems();

  // Project filter buttons
  var filterButtons = document.querySelectorAll(".filter-button");
  var projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var selectedFilter = button.dataset.filter;
      filterButtons.forEach(function (otherButton) {
        var active = otherButton === button;
        otherButton.classList.toggle("active", active);
        otherButton.setAttribute("aria-pressed", String(active));
      });
      projectCards.forEach(function (card) {
        var showCard = selectedFilter === "all" || card.dataset.category === selectedFilter;
        card.classList.toggle("is-hidden", !showCard);
      });
    });
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  // Project and certificate modal
  var projectDetails = {
    hotel: ["Hotel Reservation System", "A Java desktop application concept connected to a MySQL database. It covers room management, reservations, check-in/check-out, and billing.", ["Java", "Java Swing", "MySQL", "JDBC"]],
    gantbya: ["Gantbya", "A bus transportation application concept for route calculation, fare management, and QR-based payment.", ["Transportation", "Route planning", "QR payment"]],
    linkdekho: ["LinkDekho", "A Bangla-focused phishing link detection concept that explains suspicious links and online safety risks.", ["Cyber safety", "Bangla UX", "Web concept"]],
    home: ["Smart Home Automation and Energy Optimization", "A capstone project idea about smart-home automation and better energy use.", ["Capstone", "Automation", "Energy optimization"]],
    traffic: ["Traffic Signal Optimization Algorithm", "An algorithm concept for better traffic signal timing and smoother traffic flow.", ["Algorithms", "Optimization", "Smart mobility"]],
    guessing: ["Guessing Game", "A simple number guessing game where players use hints to find the randomly selected answer.", ["Game logic", "GitHub project"]]
  };
  var certificates = {
    level1: ["Basic Japanese Language Course - Level 1", "assets/japanese-level-1.jpg", "Daffodil Institute of Languages and Culture · Score: 81% · Issued 13 April 2025."],
    level2: ["Basic Japanese Language Course - Level 2", "assets/japanese-level-2.jpg", "Daffodil Institute of Languages and Culture · Score: 81% · Issued 9 August 2025."]
  };
  var modal = document.getElementById("projectModal");
  var modalTitle = document.getElementById("modalTitle");
  var modalDescription = document.getElementById("modalDescription");
  var modalTags = document.getElementById("modalTags");
  var modalEyebrow = document.getElementById("modalEyebrow");
  var modalImage = document.getElementById("modalCertificateImage");
  var lastButton;

  function openModal(title, description, tags, image, button) {
    lastButton = button;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalTags.innerHTML = "";
    tags.forEach(function (tag) {
      var tagElement = document.createElement("span");
      tagElement.textContent = tag;
      modalTags.appendChild(tagElement);
    });
    if (image) {
      modalImage.src = image;
      modalImage.hidden = false;
    } else {
      modalImage.hidden = true;
      modalImage.removeAttribute("src");
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastButton) lastButton.focus();
  }

  document.querySelectorAll(".details-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var details = projectDetails[button.dataset.project];
      if (details) {
        modalEyebrow.textContent = "PROJECT OVERVIEW";
        openModal(details[0], details[1], details[2], "", button);
      }
    });
  });
  document.querySelectorAll("[data-certificate]").forEach(function (button) {
    button.addEventListener("click", function () {
      var certificate = certificates[button.dataset.certificate];
      if (certificate) {
        modalEyebrow.textContent = "CERTIFICATE PREVIEW";
        openModal(certificate[0], certificate[2], [], certificate[1], button);
      }
    });
  });
  modal.querySelectorAll("[data-close-modal]").forEach(function (button) { button.addEventListener("click", closeModal); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });

  // Contact form validation
  var contactForm = document.getElementById("contactForm");
  var feedback = document.getElementById("formFeedback");
  function showError(field, message) {
    var error = field.parentElement.querySelector(".field-error");
    error.textContent = message;
    field.classList.toggle("invalid", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
  }
  contactForm.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () { showError(field, ""); });
  });
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = contactForm.elements.name;
    var email = contactForm.elements.email;
    var subject = contactForm.elements.subject;
    var message = contactForm.elements.message;
    showError(name, name.value.trim().length < 2 ? "Please enter your name." : "");
    showError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Please enter a valid email.");
    showError(subject, subject.value.trim().length < 3 ? "Please add a subject." : "");
    showError(message, message.value.trim().length < 10 ? "Please write at least 10 characters." : "");
    var valid = !contactForm.querySelector(".invalid");
    feedback.className = "form-feedback " + (valid ? "" : "error");
    feedback.textContent = valid ? "Sending your message..." : "Please check the highlighted fields and try again.";
    if (!valid) return;

    var submitButton = contactForm.querySelector(".submit-button");
    submitButton.disabled = true;
    fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Unable to send message");
        return response.json();
      })
      .then(function () {
        feedback.className = "form-feedback success";
        feedback.textContent = "Thank you! Your message has been sent. I will reply by email soon.";
        contactForm.reset();
      })
      .catch(function () {
        feedback.className = "form-feedback error";
        feedback.textContent = "We could not send your message right now. Please email me directly instead.";
      })
      .finally(function () {
        submitButton.disabled = false;
      });
  });

  // Small portfolio assistant and calculator
  function startAssistant() {
    var style = document.createElement("style");
    style.textContent = ".portfolio-assistant{position:fixed;right:15px;bottom:15px;z-index:180;font-family:'DM Sans',sans-serif}.assistant-launcher{width:58px;height:58px;padding:0;border:1px solid rgba(139,92,246,.65);border-radius:50%;overflow:hidden;background:#fff;box-shadow:0 14px 35px rgba(0,0,0,.35);cursor:pointer;transition:transform .2s}.assistant-launcher:hover{transform:translateY(-3px)}.assistant-launcher img{width:100%;height:100%;object-fit:cover}.assistant-panel{position:absolute;right:0;bottom:72px;display:flex;flex-direction:column;width:min(370px,calc(100vw - 32px));height:min(560px,calc(100vh - 120px));overflow:hidden;border:1px solid var(--line);border-radius:18px;background:var(--panel);box-shadow:0 24px 70px rgba(0,0,0,.42);opacity:0;visibility:hidden;transform:translateY(12px) scale(.97);transition:opacity .2s,transform .2s,visibility .2s}.portfolio-assistant.open .assistant-panel{opacity:1;visibility:visible;transform:translateY(0) scale(1)}.assistant-header{display:flex;align-items:center;justify-content:space-between;padding:16px 17px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,rgba(124,58,237,.18),rgba(6,182,212,.1))}.assistant-header strong{display:block;color:var(--text);font:600 15px 'Space Grotesk',sans-serif}.assistant-header small{color:var(--muted);font-size:10px}.assistant-close{border:0;color:var(--muted);background:transparent;cursor:pointer;font-size:22px}.assistant-messages{flex:1;overflow-y:auto;padding:16px}.assistant-message{max-width:88%;margin:0 0 11px;padding:10px 12px;border-radius:12px;color:var(--text);background:rgba(130,150,190,.1);font-size:12px;line-height:1.65;white-space:pre-wrap}.assistant-message.user{margin-left:auto;background:linear-gradient(135deg,rgba(124,58,237,.8),rgba(6,182,212,.65));color:#fff}.assistant-message.thinking{animation:thinkingPulse 1s infinite;color:var(--muted)}@keyframes thinkingPulse{0%,100%{opacity:.45}50%{opacity:1}}.assistant-suggestions{display:flex;gap:6px;overflow-x:auto;padding:0 14px 10px}.assistant-suggestions button{flex:0 0 auto;border:1px solid var(--line);border-radius:999px;padding:6px 9px;color:var(--muted);background:transparent;cursor:pointer;font-size:10px}.assistant-form{display:flex;gap:7px;padding:11px;border-top:1px solid var(--line)}.assistant-form input{min-width:0;flex:1;border:1px solid var(--line);border-radius:9px;padding:10px;color:var(--text);background:var(--bg);outline:none;font:inherit;font-size:12px}.assistant-form button{border:0;border-radius:9px;padding:0 13px;color:#fff;background:#7c3aed;cursor:pointer}@media(max-width:520px){.portfolio-assistant{right:16px;bottom:16px}.assistant-panel{bottom:68px}}";
    style.textContent += ".assistant-launcher{touch-action:none;width:76px;height:76px;cursor:grab}.assistant-launcher:active{cursor:grabbing}.assistant-launcher img{pointer-events:none;user-select:none;-webkit-user-drag:none}";
    document.head.appendChild(style);

    var assistant = document.createElement("aside");
    assistant.className = "portfolio-assistant";
    assistant.innerHTML = '<div class="assistant-panel" role="dialog" aria-labelledby="assistantTitle"><div class="assistant-header"><div><strong id="assistantTitle">Bappa\'s AI assistant</strong><small>Portfolio guide</small></div><button class="assistant-close" type="button" aria-label="Close assistant">×</button></div><div class="assistant-messages" aria-live="polite"></div><div class="assistant-suggestions"><button type="button">Who is Bappa?</button><button type="button">List his skills</button><button type="button">Calculate 12 × 8</button></div><form class="assistant-form"><input type="text" aria-label="Ask the portfolio assistant" placeholder="Ask about Bappa or solve a calculation..." autocomplete="off"><button type="submit" aria-label="Send question">↑</button></form></div><button class="assistant-launcher" type="button" aria-label="Open portfolio assistant" aria-expanded="false"><img src="assets/ai-agent.png" alt="Open AI assistant"></button>';
    document.body.appendChild(assistant);

    var panel = assistant.querySelector(".assistant-panel");
    var launcher = assistant.querySelector(".assistant-launcher");
    var input = assistant.querySelector("input");
    var messages = assistant.querySelector(".assistant-messages");
    var savedOffset = Number(localStorage.getItem("bappa-assistant-horizontal-position"));
    var dragOffset = isFinite(savedOffset) ? savedOffset : 0;
    var dragging = false;
    var dragMoved = false;
    var dragStartX = 0;
    var dragStartOffset = 0;
    assistant.style.transform = "translateX(" + dragOffset + "px)";

    // Move the assistant from left to right. Its bottom position never changes.
    function limitDragOffset(offset) {
      var buttonWidth = launcher.offsetWidth;
      var minimum = -(window.innerWidth - buttonWidth - 24);
      var maximum = 24;
      return Math.max(minimum, Math.min(maximum, offset));
    }

    launcher.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartOffset = dragOffset;
      launcher.setPointerCapture(event.pointerId);
    });
    launcher.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var distance = event.clientX - dragStartX;
      if (Math.abs(distance) > 3) dragMoved = true;
      dragOffset = limitDragOffset(dragStartOffset + distance);
      assistant.style.transform = "translateX(" + dragOffset + "px)";
    });
    launcher.addEventListener("pointerup", function (event) {
      if (!dragging) return;
      dragging = false;
      launcher.releasePointerCapture(event.pointerId);
      localStorage.setItem("bappa-assistant-horizontal-position", String(dragOffset));
    });
    launcher.addEventListener("pointercancel", function () { dragging = false; });

    function addMessage(text, type) {
      var message = document.createElement("div");
      message.className = "assistant-message" + (type === "user" ? " user" : "");
      message.textContent = text;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
      return message;
    }

    function showAssistant(open) {
      assistant.classList.toggle("open", open);
      launcher.setAttribute("aria-expanded", String(open));
      panel.setAttribute("aria-modal", String(open));
      if (open) input.focus();
    }

    function answer(question) {
      var text = question.toLowerCase();
      var math = question.replace(/^(calculate|compute|solve|what is)\s*/i, "").replace(/[×x]/g, "*").trim();
      if (/^\d+(\s*[+\-*\/]\s*\d+)+$/.test(math)) {
        var parts = math.match(/\d+|[+\-*\/]/g);
        var result = Number(parts[0]);
        for (var i = 1; i < parts.length; i += 2) {
          var number = Number(parts[i + 1]);
          if (parts[i] === "+") result += number;
          if (parts[i] === "-") result -= number;
          if (parts[i] === "*") result *= number;
          if (parts[i] === "/") result /= number;
        }
        return math + " = " + result;
      }
      if (text.includes("skill") || text.includes("technology")) return "His skills include C, C++, Java, HTML, CSS, JavaScript, MySQL, SQL, JDBC, Java Swing, data structures, algorithms, OOP, and DBMS.";
      if (text.includes("project") || text.includes("work")) return "His projects include Hotel Reservation System, Gantbya, LinkDekho, Smart Home Automation, Traffic Signal Optimization, and Guessing Game.";
      if (text.includes("education") || text.includes("study") || text.includes("university")) return "Bappa is studying Software Engineering at Daffodil International University. He expects to graduate in 2028.";
      if (text.includes("contact") || text.includes("email") || text.includes("phone")) return "You can contact Bappa at 253-35-731@diu.edu.bd or +880 1684-251623.";
      if (text.includes("teach") || text.includes("tutor")) return "Bappa teaches Mathematics and Physics and helps classmates prepare for exams.";
      return "Bappa is a Software Engineering student who enjoys software development, problem-solving, and teaching.";
    }

    launcher.addEventListener("click", function () {
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      showAssistant(!assistant.classList.contains("open"));
    });
    assistant.querySelector(".assistant-close").addEventListener("click", function () { showAssistant(false); });
    addMessage("Hi! Ask me about Bappa's portfolio");
    assistant.querySelector(".assistant-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var question = input.value.trim();
      if (!question) return;
      addMessage(question, "user");
      input.value = "";
      var thinkingMessage = addMessage("Thinking...");
      thinkingMessage.classList.add("thinking");
      setTimeout(function () {
        thinkingMessage.textContent = answer(question);
        thinkingMessage.classList.remove("thinking");
      }, 700);
    });
    assistant.querySelectorAll(".assistant-suggestions button").forEach(function (button) {
      button.addEventListener("click", function () {
        input.value = button.textContent;
        assistant.querySelector(".assistant-form").requestSubmit();
      });
    });
  }

  startAssistant();
  document.getElementById("currentYear").textContent = new Date().getFullYear();
});

