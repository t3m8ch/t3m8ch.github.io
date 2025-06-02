// Презентация "Специалист по машинному обучению" - JavaScript

class Presentation {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = document.querySelectorAll(".slide").length;
    this.slides = document.querySelectorAll(".slide");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.homeBtn = document.getElementById("home-btn");
    this.currentSlideSpan = document.getElementById("current-slide");
    this.totalSlidesSpan = document.getElementById("total-slides");
    this.slideDotsContainer = document.querySelector(".slide-dots");

    this.init();
  }

  init() {
    // Устанавливаем общее количество слайдов
    this.totalSlidesSpan.textContent = this.totalSlides;

    // Создаем точки навигации
    this.createSlideDots();

    // Добавляем обработчики событий
    this.addEventListeners();

    // Показываем первый слайд
    this.showSlide(0);
  }

  createSlideDots() {
    this.slideDotsContainer.innerHTML = "";

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("click", () => this.goToSlide(i));
      this.slideDotsContainer.appendChild(dot);
    }

    // Активируем первую точку
    this.slideDotsContainer.children[0].classList.add("active");
  }

  addEventListeners() {
    // Кнопки навигации
    this.prevBtn.addEventListener("click", () => this.previousSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());
    this.homeBtn.addEventListener("click", () => this.goToSlide(0));

    // Клавиатурная навигация
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          this.previousSlide();
          break;
        case "ArrowRight":
        case "ArrowDown":
        case " ": // Пробел
          e.preventDefault();
          this.nextSlide();
          break;
        case "Home":
          e.preventDefault();
          this.goToSlide(0);
          break;
        case "End":
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;
        case "Escape":
          e.preventDefault();
          this.goToSlide(0);
          break;
      }
    });

    // Свайпы для мобильных устройств
    this.addTouchNavigation();
  }

  addTouchNavigation() {
    let startX = 0;
    let startY = 0;
    const threshold = 50; // Минимальное расстояние для свайпа

    document.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;

        const deltaX = startX - endX;
        const deltaY = startY - endY;

        // Проверяем, что горизонтальный свайп больше вертикального
        if (
          Math.abs(deltaX) > Math.abs(deltaY) &&
          Math.abs(deltaX) > threshold
        ) {
          if (deltaX > 0) {
            // Свайп влево - следующий слайд
            this.nextSlide();
          } else {
            // Свайп вправо - предыдущий слайд
            this.previousSlide();
          }
        }
      },
      { passive: true },
    );
  }

  showSlide(index) {
    // Удаляем активные классы со всех слайдов
    this.slides.forEach((slide, i) => {
      slide.classList.remove("active", "prev");
      if (i < index) {
        slide.classList.add("prev");
      }
    });

    // Активируем текущий слайд
    this.slides[index].classList.add("active");

    // Обновляем точки навигации
    this.updateDots(index);

    // Обновляем счетчик слайдов
    this.currentSlideSpan.textContent = index + 1;

    // Обновляем состояние кнопок
    this.updateButtons(index);

    // Сохраняем текущий слайд
    this.currentSlide = index;
  }

  updateDots(activeIndex) {
    const dots = this.slideDotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === activeIndex);
    }
  }

  updateButtons(index) {
    // Обновляем состояние кнопки "Назад"
    if (index === 0) {
      this.prevBtn.disabled = true;
      this.prevBtn.classList.add("disabled");
    } else {
      this.prevBtn.disabled = false;
      this.prevBtn.classList.remove("disabled");
    }

    // Обновляем состояние кнопки "Вперед"
    if (index === this.totalSlides - 1) {
      this.nextBtn.disabled = true;
      this.nextBtn.classList.add("disabled");
      this.nextBtn.innerHTML = 'Конец <span class="arrow">✓</span>';
    } else {
      this.nextBtn.disabled = false;
      this.nextBtn.classList.remove("disabled");
      this.nextBtn.innerHTML = 'Вперед <span class="arrow">→</span>';
    }
  }

  nextSlide() {
    if (this.currentSlide < this.totalSlides - 1) {
      this.goToSlide(this.currentSlide + 1);
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.goToSlide(this.currentSlide - 1);
    }
  }

  goToSlide(index) {
    if (index >= 0 && index < this.totalSlides) {
      this.showSlide(index);
    }
  }

  // Методы для программного управления
  goToFirstSlide() {
    this.goToSlide(0);
  }

  goToLastSlide() {
    this.goToSlide(this.totalSlides - 1);
  }

  getCurrentSlide() {
    return this.currentSlide;
  }

  getTotalSlides() {
    return this.totalSlides;
  }
}

// Дополнительные функции для улучшения UX
class PresentationEnhancements {
  constructor(presentation) {
    this.presentation = presentation;
    this.init();
  }

  init() {
    this.addProgressIndicator();
    this.addSlideTransitions();
    this.addAutoAdvance();
    this.addFullscreenSupport();
  }

  addProgressIndicator() {
    // Создаем индикатор прогресса
    const progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    progressBar.innerHTML = '<div class="progress-fill"></div>';

    const style = document.createElement("style");
    style.textContent = `
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--color-border);
                z-index: 1001;
            }

            .progress-fill {
                height: 100%;
                background: var(--color-primary);
                transition: width var(--duration-normal) var(--ease-standard);
                width: 0;
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(progressBar);

    // Обновляем прогресс при смене слайдов
    const originalShowSlide = this.presentation.showSlide.bind(
      this.presentation,
    );
    this.presentation.showSlide = (index) => {
      originalShowSlide(index);
      const progress = ((index + 1) / this.presentation.getTotalSlides()) * 100;
      progressBar.querySelector(".progress-fill").style.width = `${progress}%`;
    };
  }

  addSlideTransitions() {
    // Добавляем анимации появления элементов
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Применяем анимации к элементам
    document
      .querySelectorAll(
        ".specialist-card, .application-card, .education-card, .ethics-item, .state-item",
      )
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
      });
  }

  addAutoAdvance() {
    let autoAdvanceTimer = null;
    const autoAdvanceDelay = 30000; // 30 секунд

    const startAutoAdvance = () => {
      clearTimeout(autoAdvanceTimer);
      autoAdvanceTimer = setTimeout(() => {
        if (
          this.presentation.getCurrentSlide() <
          this.presentation.getTotalSlides() - 1
        ) {
          this.presentation.nextSlide();
          startAutoAdvance();
        }
      }, autoAdvanceDelay);
    };

    const stopAutoAdvance = () => {
      clearTimeout(autoAdvanceTimer);
    };

    // Запускаем автопрогресс
    startAutoAdvance();

    // Останавливаем автопрогресс при взаимодействии пользователя
    ["click", "keydown", "touchstart"].forEach((event) => {
      document.addEventListener(event, stopAutoAdvance, { once: true });
    });
  }

  addFullscreenSupport() {
    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.className = "btn btn--outline fullscreen-btn";
    fullscreenBtn.innerHTML = "⛶";
    fullscreenBtn.title = "Полноэкранный режим";

    const style = document.createElement("style");
    style.textContent = `
            .fullscreen-btn {
                position: fixed;
                top: var(--space-20);
                left: var(--space-20);
                z-index: 1000;
                padding: var(--space-8);
                width: 40px;
                height: 40px;
                font-size: var(--font-size-lg);
            }

            @media (max-width: 768px) {
                .fullscreen-btn {
                    top: var(--space-10);
                    left: var(--space-10);
                }
            }
        `;

    document.head.appendChild(style);
    document.body.appendChild(fullscreenBtn);

    fullscreenBtn.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
    });
  }
}

// Инициализация презентации
document.addEventListener("DOMContentLoaded", () => {
  // Создаем экземпляр презентации
  const presentation = new Presentation();

  // Добавляем улучшения
  const enhancements = new PresentationEnhancements(presentation);

  // Глобальный доступ к презентации для отладки
  window.presentation = presentation;

  // Информация о горячих клавишах
  console.log(`
    🎯 Презентация "Специалист по машинному обучению" загружена!

    Управление:
    ← → ↑ ↓     Навигация по слайдам
    Пробел      Следующий слайд
    Home        Первый слайд
    End         Последний слайд
    Escape      Вернуться к началу

    Свайпы работают на мобильных устройствах.
    `);
});

// Дополнительные утилиты
const PresentationUtils = {
  // Экспорт презентации в PDF (требует внешнюю библиотеку)
  exportToPDF: async function () {
    console.log(
      "Функция экспорта в PDF не реализована. Используйте браузерную печать.",
    );
    window.print();
  },

  // Получение статистики просмотра
  getViewStats: function () {
    return {
      currentSlide: window.presentation?.getCurrentSlide() + 1 || 1,
      totalSlides: window.presentation?.getTotalSlides() || 0,
      progress:
        Math.round(
          ((window.presentation?.getCurrentSlide() + 1) /
            window.presentation?.getTotalSlides()) *
            100,
        ) || 0,
    };
  },

  // Переход к слайду по названию (поиск по заголовку)
  goToSlideByTitle: function (title) {
    const slides = document.querySelectorAll(".slide h2");
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].textContent.toLowerCase().includes(title.toLowerCase())) {
        window.presentation?.goToSlide(i);
        return true;
      }
    }
    console.warn(`Слайд с заголовком "${title}" не найден`);
    return false;
  },
};

// Экспортируем утилиты в глобальную область
window.PresentationUtils = PresentationUtils;
