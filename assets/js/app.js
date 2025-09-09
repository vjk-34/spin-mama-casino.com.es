document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const body = document.body;
  const mainNav = document.querySelector('.main-navigation');
  const mobileBreakpoint = 1024;

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = body.classList.toggle('is-mobile-menu-open');
      menuToggle.classList.toggle('is-active');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

      body.style.overflow = isOpen ? 'hidden' : '';

      if (!isOpen) {
        closeAllSubmenus(mainNav);
      }
    });
  }

  const menuItemsWithChildren = mainNav ? mainNav.querySelectorAll('.menu-item.has-children') : [];

  menuItemsWithChildren.forEach(item => {
    const link = item.querySelector(':scope > a');

    if (link) {
      link.addEventListener('click', function (event) {
        const isMobile = window.innerWidth <= mobileBreakpoint;
        const href = link.getAttribute('href');
        const isJustAnchor = href === '#';

        if (isJustAnchor || (isMobile && !item.classList.contains('submenu-open') && !isJustAnchor)) {
          event.preventDefault();
        } else if (!isMobile && isJustAnchor) {

        }

        if (isMobile) {
          const subMenuWasOpen = item.classList.contains('submenu-open');
          if (!subMenuWasOpen) {
            closeSiblingsSubmenus(item);
          }
          item.classList.toggle('submenu-open');
        }

        event.stopPropagation();
      });
    }
  });

  document.addEventListener('click', (event) => {
    if (body.classList.contains('is-mobile-menu-open')) {
      const isClickInsideNav = mainNav.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (!isClickInsideNav && !isClickOnToggle) {
        body.classList.remove('is-mobile-menu-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        closeAllSubmenus(mainNav);
      }
    }

    const openSubmenus = mainNav ? mainNav.querySelectorAll('.menu-item.has-children.submenu-open') : [];
    let clickInsideOpenSubmenu = false;
    openSubmenus.forEach(item => {
      if (item.contains(event.target)) {
        clickInsideOpenSubmenu = true;
      }
    });

    if (!clickInsideOpenSubmenu) {
      closeAllSubmenus(mainNav);
    }

  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (body.classList.contains('is-mobile-menu-open')) {
        body.classList.remove('is-mobile-menu-open');
        menuToggle.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = '';
        closeAllSubmenus(mainNav);
      } else {
        closeAllSubmenus(mainNav);
      }
    }
  });

  function closeAllSubmenus(navContainer) {
    if (!navContainer) return;
    navContainer.querySelectorAll('.menu-item.has-children.submenu-open').forEach(item => {
      item.classList.remove('submenu-open');
    });
  }

  function closeSiblingsSubmenus(currentItem) {
    const parentUl = currentItem.closest('ul');
    if (parentUl) {
      const siblings = parentUl.querySelectorAll(':scope > .menu-item.has-children.submenu-open');
      siblings.forEach(sibling => {
        if (sibling !== currentItem) {
          sibling.classList.remove('submenu-open');
        }
      });
    }
  }

  const playButtons = document.querySelectorAll('.play-button');

  const baseReferralUrl = "{{ site.Params.referralBaseUrl | default "" | safeJS }}";

  if (!baseReferralUrl) {
    console.warn('Referral URL (site.Params.referralBaseUrl) is empty in Hugo config. Play buttons might not redirect correctly.');
  }

  playButtons.forEach(button => {
    // 3. Проверяем href кнопки
    if (button.getAttribute('href') === '/play') {
      button.addEventListener('click', function (event) {
        event.preventDefault(); // 4. Отмена стандартного перехода

        // 5. Проверка URL перед редиректом
        if (!baseReferralUrl) {
          // Можно перенаправить на главную или просто ничего не делать
          // window.location.href = '/';
          return; // Просто выходим, если URL пуст
        }

        // 6. Используем URL напрямую
        window.open(baseReferralUrl, '_blank'); // Открываем готовую ссылку
      });
    }
  });

  const tocContainers = document.querySelectorAll('.toc-container');

  tocContainers.forEach(container => {
    const button = container.querySelector('.toc-toggle-button');
    const contentWrapper = container.querySelector('.toc-content-wrapper');

    if (button && contentWrapper) {
      button.addEventListener('click', () => {
        const isOpen = container.classList.toggle('is-open');
        button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        if (isOpen) {
          setTimeout(() => {
            const containerRect = container.getBoundingClientRect();
            if (containerRect.top < 0) {
              container.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 360);
        }
      });
    }
  });

});