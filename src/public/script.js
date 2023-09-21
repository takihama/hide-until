const togglePageButton = document.getElementById('togglePageButton');
const hideContainer = document.getElementById('hideContainer');
const searchContainer = document.getElementById('searchContainer');

const hideButton = document.getElementById('hideButton');
const searchHiddenText = document.getElementById('searchHiddenText');
const hiddenText = document.getElementById('hiddenText');
const textKey = document.getElementById('textKey');
const expirationTime = document.getElementById('expirationTime');
const expirationDate = document.getElementById('expirationDate');
const hiddenTextKey = document.getElementById('hiddenTextKey');
const textRevealed = document.getElementById('textRevealed');
const confirmModal = document.getElementById('confirmHideModal');
const confirmModalButton = document.getElementById('confirmModalButton');
const copyKeyButton = document.getElementById('copyKeyButton');

const countdownDays = document.getElementById('countdownDays');
const countdownHours = document.getElementById('countdownHours');
const countdownMinutes = document.getElementById('countdownMinutes');
const countdownSeconds = document.getElementById('countdownSeconds');

const countdownContainer = document.getElementById('countdownContainer');
const textRevealedContainer = document.getElementById('textRevealedContainer');
const searchTextTitle = document.getElementById('searchTextTitle');

expirationTime.defaultValue = '12:00';
expirationDate.defaultValue = new Date().toISOString().split('T')[0];

searchContainer.style.display = 'none';
textRevealedContainer.style.display = 'none';

let textUuid = '';

togglePageButton.addEventListener('click', async () => {
  hideContainer.style.display =
    hideContainer.style.display === 'none' ? '' : 'none';
  searchContainer.style.display =
    searchContainer.style.display === 'none' ? 'block' : 'none';
  togglePageButton.textContent =
    togglePageButton.textContent === 'hide' ? 'search' : 'hide';
});

hiddenTextKey.addEventListener('click', () => {
  navigator.clipboard.writeText(hiddenTextKey.textContent);
});

hideButton.addEventListener('click', async () => {
  const text = hiddenText.value;
  const time = expirationDate.value + ' ' + expirationTime.value;

  const response = await fetch('/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, expirationTime: new Date(time).toUTCString() })
  });

  if (response.ok) {
    const data = await response.json();
    // Display confirm modal
    confirmModal.style.display = 'block';
    hiddenTextKey.textContent = `${data.uuid}`;
  }
});

// Close confirm modal on confirm
confirmModalButton.addEventListener('click', () => {
  confirmModal.style.display = 'none';
});

// Close confirm modal when click outside it
window.addEventListener('click', () => {
  if (event.target === confirmModal) {
    confirmModal.style.display = 'none';
  }
});

searchHiddenText.addEventListener('click', async () => {
  textUuid = textKey.value;

  const response = await fetch(`/api/${textUuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const { expirationTime, isHidden, text } = await response.json();

    if (isHidden) {
      textRevealedContainer.style.display = 'none';
      searchTextTitle.textContent = 'text revealed in';
      updateCountdownTimer(expirationTime);
    } else {
      countdownContainer.style.display = 'none';
      textRevealedContainer.style.display = 'block';
      textRevealed.textContent = text;
      searchTextTitle.textContent = 'hidden text';
    }
  }
});

async function updateCountdownTimer(expirationDate) {
  // Update the countdown timer every second
  const timerInterval = setInterval(async () => {
    const timeRemaining =
      new Date(expirationDate).getTime() - new Date().getTime(); // in milliseconds

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      countdownDays.textContent = '-';
      countdownHours.textContent = '-';
      countdownMinutes.textContent = '-';
      countdownSeconds.textContent = '-';
      countdownContainer.style.display = 'none';
      textRevealedContainer.style.display = 'block';

      const response = await fetch(`/api/${textUuid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        textRevealed.innerHTML = data.text;
      }
      searchTextTitle.textContent = 'hidden text';
    } else {
      const days = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Update countdown elements text
      countdownDays.textContent = days;
      countdownHours.textContent = hours;
      countdownMinutes.textContent = minutes;
      countdownSeconds.textContent = seconds;
    }
  }, 1000); // Update every 1 second
}
