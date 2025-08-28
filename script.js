class Slider {
  constructor() {
    this.video = document.getElementById("video");
    this.slider = document.querySelector(".slider");
    this.slides = document.querySelectorAll(".slide");
    this.headings = document.querySelectorAll(".hero-title");
    this.container = document.querySelector(".container");
    this.width = window.innerWidth;
    this.activeIndex = 0;
    this.interval = null;
    this.animationTimeout = null;

    this.init();
  }

  init() {
    this.slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        this.setActiveSlide(index);
      });
    });

    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
    });

    this.startAutoSlide();
  }

  setActiveSlide(index) {
    this.stopAutoSlide();

    this.slides.forEach((slide) => {
      slide.classList.remove("active-slide");
    });

    this.headings.forEach((heading) => {
      heading.classList.remove("active-title");
    });

    this.activeIndex = index;
    this.slides[this.activeIndex].classList.add("active-slide");
    this.headings[this.activeIndex].classList.add("active-title");

    this.changeBackground();

    this.restartAutoSlide();

    if (this.width < 1024) {
      this.scrollToActiveSlide();
    }
  }

  scrollToActiveSlide() {
    const activeSlide = this.slides[this.activeIndex];
    const slider = this.slider;

    const scrollPosition =
      activeSlide.offsetLeft -
      (slider.offsetWidth - activeSlide.offsetWidth) / 2;

    slider.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });
  }

  changeBackground() {
    if (this.activeIndex > 0) {
      this.video.style.display = "none";
      const activeSlide = this.slides[this.activeIndex];
      const bgImage = activeSlide.querySelector("img").src;
      this.container.style.backgroundImage = `url(${bgImage})`;
    } else {
      this.video.style.display = "block";
    }
  }

  startAutoSlide() {
    this.resetProgressBar();

    this.interval = setInterval(() => {
      this.nextSlide();
    }, 6500);
  }

  stopAutoSlide() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    document.querySelectorAll(".timeline").forEach((bar) => {
      bar.style.width = "0%";
      bar.style.transition = "none";
    });
  }

  restartAutoSlide() {
    this.stopAutoSlide();

    this.animationTimeout = setTimeout(() => {
      this.resetProgressBar();
      this.startAutoSlide();
    }, 50);
  }

  resetProgressBar() {
    if (this.width <= 425) {
      this.slides.forEach((slide, index) => {
        const progressBar = slide.querySelector(".timeline");
        if (index < this.activeIndex) {
          progressBar.style.width = "100%";
          progressBar.style.transition = "none";
        } else if (index === this.activeIndex) {
          progressBar.style.width = "0%";
          void progressBar.offsetWidth;
          progressBar.style.transition = "width 6s linear";
          progressBar.style.width = "100%";
        } else {
          progressBar.style.width = "0%";
          progressBar.style.transition = "none";
        }
      });
    } else {
      const activeProgressBar =
        this.slides[this.activeIndex].querySelector(".timeline");
      activeProgressBar.style.transition = "none";
      activeProgressBar.style.width = "0%";

      void activeProgressBar.offsetWidth;

      activeProgressBar.style.transition = "width 6s linear";
      activeProgressBar.style.width = "100%";
    }
  }

  nextSlide() {
    this.stopAutoSlide();

    this.activeIndex = (this.activeIndex + 1) % this.slides.length;

    this.slides.forEach((slide) => {
      slide.classList.remove("active-slide");
    });

    this.slides[this.activeIndex].classList.add("active-slide");

    this.headings.forEach((heading) => {
      heading.classList.remove("active-title");
    });

    this.headings[this.activeIndex].classList.add("active-title");

    this.changeBackground();

    this.restartAutoSlide();

    if (this.width <= 1024) {
      this.scrollToActiveSlide();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Slider();
});
