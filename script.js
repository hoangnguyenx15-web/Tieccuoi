document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
      header.classList.add("shadow");
    } else {
      header.classList.remove("shadow");
    }
  });
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    });
  });
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      console.log("Form submitted:", data);
      showNotification(
        "success",
        "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất."
      );
      contactForm.reset();
    });
  }
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" };
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document
    .querySelectorAll(".card, .preview-card, .gallery-item")
    .forEach((el) => {
      observer.observe(el);
    });
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navbarCollapse = document.querySelector(".navbar-collapse");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth < 992) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: !1,
        });
        bsCollapse.hide();
      }
    });
  });
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
    let currentSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        currentSection = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", updateActiveNavLink);
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("loading");
          imageObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }

  function showNotification(type, message) {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = "9999";
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      const modal = document.createElement("div");
      modal.className = "modal fade";
      modal.innerHTML = `
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content bg-transparent border-0">
                        <div class="modal-body p-0">
                            <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>
                            <img src="${this.src}" class="img-fluid rounded">
                        </div>
                    </div>
                </div>
            `;
      document.body.appendChild(modal);
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      modal.addEventListener("hidden.bs.modal", function () {
        modal.remove();
      });
    });
  });
  const yearElements = document.querySelectorAll(".current-year");
  const currentYear = new Date().getFullYear();
  yearElements.forEach((el) => {
    el.textContent = currentYear;
  });
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  const popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("load", function () {
      this.classList.add("loaded");
    });
  });
  document.addEventListener("click", function (event) {
    const navbar = document.querySelector(".navbar-collapse");
    const toggler = document.querySelector(".navbar-toggler");
    if (navbar && toggler) {
      const isClickInside =
        navbar.contains(event.target) || toggler.contains(event.target);
      if (!isClickInside && navbar.classList.contains("show")) {
        const bsCollapse = new bootstrap.Collapse(navbar, { toggle: !1 });
        bsCollapse.hide();
      }
    }
  });
});
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".gallery-filter .btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      galleryItems.forEach((item) => {
        if (filter === "all") {
          item.style.display = "block";
        } else {
          if (item.getAttribute("data-category") === filter) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        }
      });
    });
  });

  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      const img = this.querySelector("img");
      const info = this.querySelector(".gallery-item-info").innerHTML;

      const modal = document.createElement("div");
      modal.className = "modal fade modal-gallery";
      modal.innerHTML = `
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content bg-transparent border-0">
                                <div class="modal-header border-0">
                                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${img.src}" class="img-fluid">
                                    <div class="text-white mt-3">${info}</div>
                                </div>
                            </div>
                        </div>
                    `;
      document.body.appendChild(modal);
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      modal.addEventListener("hidden.bs.modal", function () {
        modal.remove();
      });
    });
  });

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
      alert("Tính năng đang được phát triển. Cảm ơn bạn đã quan tâm!");
    });
  }
});
console.log(
  "%cDiamond Palace Wedding Center",
  "color: #f43f5e; font-size: 24px; font-weight: bold;"
);
console.log("%cWebsite developed with ❤️", "color: #666; font-size: 12px;");
