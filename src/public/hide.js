const hideContainer = document.getElementById('hideContainer');

const hideButton = document.getElementById('hideButton');
const hiddenText = document.getElementById('hiddenText');

const expirationTime = document.getElementById('expirationTime');
const expirationDate = document.getElementById('expirationDate');
const hiddenTextKey = document.getElementById('hiddenTextKey');
const confirmModal = document.getElementById('confirmHideModal');
const confirmModalButton = document.getElementById('confirmModalButton');
const copyKeyButton = document.getElementById('copyKeyButton');

expirationTime.defaultValue = '12:00';
expirationDate.defaultValue = new Date().toISOString().split('T')[0];

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
