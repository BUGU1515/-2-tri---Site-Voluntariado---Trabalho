const form = document.getElementById('volunteerForm');
const formMessage = document.getElementById('formMessage');
const volunteerCountElement = document.getElementById('volunteerCount');
const savedNotice = document.getElementById('savedNotice');
const savedDetails = document.getElementById('savedDetails');
const introScreen = document.querySelector('.intro-screen');
const enterSiteButton = document.getElementById('enterSiteButton');
const quizForm = document.getElementById('quizForm');
const quizResult = document.getElementById('quizResult');

const STORAGE_KEY = 'volunteerRegistration';
const COUNT_KEY = 'volunteerCount';
let currentSavedRegistration = null;

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
    savedNotice.textContent = 'Inscrição salva. Comece a digitar igual ao último cadastro para ver o histórico.';
  } else {
    savedNotice.textContent = 'Nenhuma inscrição salva ainda. Preencha o formulário para participar.';
  }
}

function isPrefixMatch(value, savedValue) {
  const typed = String(value).trim().toLowerCase();
  const saved = String(savedValue || '').trim().toLowerCase();
  return typed.length > 0 && saved.startsWith(typed);
}

function handleFormHistoryInput() {
  if (!currentSavedRegistration) {
    savedDetails.textContent = '';
    return;
  }

  const matched =
    isPrefixMatch(form.nome.value, currentSavedRegistration.nome) ||
    isPrefixMatch(form.idade.value, currentSavedRegistration.idade) ||
    isPrefixMatch(form.email.value, currentSavedRegistration.email) ||
    isPrefixMatch(form.interesse.value, currentSavedRegistration.interesse);

  if (matched) {
    displaySavedDetails(currentSavedRegistration);
  } else {
    savedDetails.textContent = '';
  }
}

function displaySavedDetails(registration) {
  if (!registration || !registration.nome) {
    savedDetails.textContent = '';
    return;
  }

  savedDetails.innerHTML = `
    <p>Nome: ${registration.nome}</p>
    <p>Idade: ${registration.idade}</p>
    <p>E-mail: ${registration.email}</p>
    <p>Por que quer participar: ${registration.interesse}</p>
  `;
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

  const previousRegistration = getSavedRegistration();
  saveRegistration(registration);

  if (!previousRegistration || previousRegistration.email !== registration.email) {
    incrementVolunteerCount();
  }

  updateCountDisplay();
  showSavedNotice(registration);
  currentSavedRegistration = registration;
  displaySavedDetails(registration);
  form.reset();
  formMessage.textContent = `Obrigado, ${registration.nome}! Sua inscrição foi salva com sucesso.`;
  formMessage.style.color = '#005cbf';
});

window.addEventListener('DOMContentLoaded', function () {
  const saved = getSavedRegistration();
  currentSavedRegistration = saved;
  updateCountDisplay();
  showSavedNotice(saved);
  attachInteractionHandlers();

  if (enterSiteButton) {
    enterSiteButton.addEventListener('click', function () {
      if (introScreen) {
        introScreen.classList.add('intro-hidden');
      }
    });
  }

  if (quizForm) {
    quizForm.addEventListener('submit', handleQuizSubmit);
  }
});

function handleQuizSubmit(event) {
  event.preventDefault();

  const answers = new FormData(quizForm);
  const correct = {
    q1: 'b',
    q2: 'c',
    q3: 'a',
  };

  let score = 0;
  for (const key of Object.keys(correct)) {
    if (answers.get(key) === correct[key]) {
      score += 1;
    }
  }

  const message = score === 3
    ? 'Parabéns! Você acertou todas as perguntas.'
    : `Você acertou ${score} de 3. Continue aprendendo sobre o projeto e a conservação ambiental.`;

  if (quizResult) {
    quizResult.textContent = message;
  }
}

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

  // Reveal saved history when typing the same text as last registration
  ['nome', 'idade', 'email', 'interesse'].forEach(fieldName => {
    const field = form[fieldName];
    if (field) {
      field.addEventListener('input', handleFormHistoryInput);
    }
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
