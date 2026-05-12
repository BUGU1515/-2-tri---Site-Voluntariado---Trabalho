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
});
