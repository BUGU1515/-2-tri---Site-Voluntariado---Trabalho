const form = document.getElementById('volunteerForm');
const formMessage = document.getElementById('formMessage');
const volunteerCountElement = document.getElementById('volunteerCount');
const savedNotice = document.getElementById('savedNotice');

const STORAGE_KEY = 'volunteerRegistration';
const COUNT_KEY = 'volunteerCount';

function getSavedRegistration() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    return null;
  }
}

function getVolunteerCount() {
  return Number(localStorage.getItem(COUNT_KEY) || 0);
}

function updateCountDisplay() {
  volunteerCountElement.textContent = getVolunteerCount();
}

function showSavedNotice(registration) {
  if (registration && registration.nome) {
    savedNotice.textContent = `Bem-vindo de volta, ${registration.nome}! Sua inscrição anterior foi carregada.`;
  } else {
    savedNotice.textContent = 'Nenhuma inscrição salva ainda. Preencha o formulário para participar.';
  }
}

function fillFormWithSavedData(registration) {
  if (!registration) return;
  form.nome.value = registration.nome || '';
  form.idade.value = registration.idade || '';
  form.email.value = registration.email || '';
  form.interesse.value = registration.interesse || '';
}

function saveRegistration(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function incrementVolunteerCount() {
  const currentCount = getVolunteerCount();
  localStorage.setItem(COUNT_KEY, currentCount + 1);
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const registration = {
    nome: form.nome.value.trim(),
    idade: form.idade.value,
    email: form.email.value.trim(),
    interesse: form.interesse.value.trim(),
    inscritoEm: new Date().toLocaleDateString('pt-BR'),
  };

  saveRegistration(registration);

  const storedRegistration = getSavedRegistration();
  if (!storedRegistration || storedRegistration.email !== registration.email) {
    incrementVolunteerCount();
  }

  updateCountDisplay();
  showSavedNotice(registration);
  formMessage.textContent = `Obrigado, ${registration.nome}! Sua inscrição foi salva com sucesso.`;
  formMessage.style.color = '#005cbf';
});

window.addEventListener('DOMContentLoaded', function () {
  const saved = getSavedRegistration();
  fillFormWithSavedData(saved);
  updateCountDisplay();
  showSavedNotice(saved);
  attachInteractionHandlers();
});

function attachInteractionHandlers() {
  const buttons = Array.from(document.querySelectorAll('.btn'));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ripple effect on click
  buttons.forEach(btn => {
    btn.addEventListener('click', createRipple);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') createRipple(e);
    });
  });

  // Hero parallax movement (subtle)
  if (!prefersReduced) {
    const hero = document.getElementById('hero');
    const heroImage = hero && hero.querySelector('.hero-image');
    if (hero && heroImage) {
      hero.addEventListener('mousemove', function (e) {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tx = x * 10; // px
        const ty = y * 6;
        heroImage.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${x * 1.2}deg)`;
      });
      hero.addEventListener('mouseleave', () => {
        heroImage.style.transform = '';
      });
    }
  }
}

function createRipple(e) {
  const el = e.currentTarget || e.target;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const circle = document.createElement('span');
  circle.className = 'ripple';
  const size = Math.max(rect.width, rect.height) * 0.9;
  circle.style.width = circle.style.height = `${size}px`;
  const x = (e.clientX || (rect.left + rect.width/2)) - rect.left - size/2;
  const y = (e.clientY || (rect.top + rect.height/2)) - rect.top - size/2;
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  el.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
}
