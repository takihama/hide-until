const hideButton = document.getElementById('hideButton');
const searchHiddenText = document.getElementById('searchHiddenText');
const hiddenText = document.getElementById('hiddenText');
const textKey = document.getElementById('textKey');
const expirationTime = document.getElementById('expirationTime');
const expirationDate = document.getElementById('expirationDate')
const hiddenTextKey = document.getElementById('result');
const resultKey = document.getElementById('resultKey');
const confirmModal = document.getElementById('confirmHideModal');
const confirmModalButton = document.getElementById('confirmModalButton');

expirationTime.defaultValue = '12:00';
expirationDate.defaultValue = new Date().toISOString().split('T')[0];;

hideButton.addEventListener('click', async () => {
  const text = hiddenText.value;
  const time = expirationDate.value + ' ' + expirationTime.value;

  const response = await fetch('/api/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, expirationTime: time })
  });

  if (response.ok) {
    const data = await response.json();
    // Display confirm modal
    confirmModal.style.display = "block";
    hiddenTextKey.textContent = `Text hidden witha key: ${data.uuid}`;
  }
});

// Close confirm modal on confirm
confirmModalButton.addEventListener('click', () => {
  confirmModal.style.display = 'none';
})

// Close confirm modal when click outside it
window.addEventListener('click', () => {
  if (event.target === confirmModal) {
    confirmModal.style.display = 'none';
  }
})

searchHiddenText.addEventListener('click', async () => {
  const key = textKey.value;

  const response = await fetch(`/api/${key}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const data = await response.json();
    textExpirationTime = data.expirationTime;
    if (data.expirationTime) {
      updateCountdownTimer(textExpirationTime);
    }

    if (data.isHidden) {
      resultKey.textContent = `Text hidden until ${new Date(
        data.expirationTime
      ).toLocaleString()}`;
    } else {
      resultKey.textContent = `Text hidden ${data.text || ''}`;
    }
  } else {
    resultKey.textContent = 'Error finding hidden text.';
  }
});

function updateCountdownTimer(expirationDate) {
  const countdownElement = document.getElementById('timer');

  // Update the countdown timer every second
  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const expirationTime = new Date(expirationDate).getTime();

    const timeRemaining = expirationTime - now;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      countdownElement.style.display = 'block';
      countdownElement.textContent = 'Expired';
    } else {
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Format the time as HH:MM:SS
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      countdownElement.textContent = formattedTime;
      countdownElement.style.display = 'none';
    }
  }, 1000); // Update every 1 second
}
