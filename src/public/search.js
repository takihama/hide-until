const searchContainer = document.getElementById('searchContainer');

const searchHiddenText = document.getElementById('searchHiddenText');

const textKey = document.getElementById('textKey');

const countdownDays = document.getElementById('countdownDays');
const countdownHours = document.getElementById('countdownHours');
const countdownMinutes = document.getElementById('countdownMinutes');
const countdownSeconds = document.getElementById('countdownSeconds');

const countdownContainer = document.getElementById('countdownContainer');
const textRevealedContainer = document.getElementById('textRevealedContainer');

const searchTextTitle = document.getElementById('searchTextTitle');
const textRevealed = document.getElementById('textRevealed');

searchContainer.style.display = 'none';
textRevealedContainer.style.display = 'none';

let textUuid = '';
let timerInterval;

searchHiddenText.addEventListener('click', async () => {
  // Clear interval before searching another text
  clearInterval(timerInterval);
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
  timerInterval = setInterval(async () => {
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
