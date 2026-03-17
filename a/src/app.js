const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerLinks = mobileDrawer?.querySelectorAll('[data-close]');
const yearEl = document.getElementById('year');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function toggleDrawer(open) {
  if (!mobileDrawer || !mobileMenuBtn) return;

  const isOpen = mobileDrawer.classList.contains('open');
  const shouldOpen = typeof open === 'boolean' ? open : !isOpen;

  mobileDrawer.classList.toggle('open', shouldOpen);
  mobileMenuBtn.setAttribute('aria-expanded', String(shouldOpen));
  mobileDrawer.setAttribute('aria-hidden', String(!shouldOpen));

  if (shouldOpen) {
    mobileDrawer.querySelector('a')?.focus();
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => toggleDrawer());
}

if (drawerLinks) {
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => toggleDrawer(false));
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
    toggleDrawer(false);
    mobileMenuBtn?.focus();
  }
});

const form = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

const validators = {
  name: (value) => value.trim().length >= 2,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: (value) => value.trim().length >= 10,
};

function setError(inputId, message) {
  const errorEl = document.getElementById(`error-${inputId}`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearErrors() {
  ['name', 'email', 'message'].forEach((field) => setError(field, ''));
}

typeof form?.addEventListener === 'function' &&
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    let isValid = true;

    Object.keys(validators).forEach((field) => {
      if (!validators[field](payload[field] || '')) {
        isValid = false;
        const message =
          field === 'email'
            ? 'Ingresa un correo válido.'
            : `Por favor completa el campo ${field}.`;
        setError(field, message);
      }
    });

    if (!isValid) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }

    try {
      // En un proyecto real, reemplaza esta llamada con tu endpoint real.
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (success) {
        success.style.display = 'block';
      }
      form.reset();
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error enviando el formulario. Intenta nuevamente.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar mensaje';
      }
    }
  });
