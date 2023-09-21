const togglePageButton = document.getElementById('togglePageButton');

togglePageButton.addEventListener('click', async () => {
  hideContainer.style.display =
    hideContainer.style.display === 'none' ? '' : 'none';
  searchContainer.style.display =
    searchContainer.style.display === 'none' ? 'block' : 'none';
  togglePageButton.textContent =
    togglePageButton.textContent === 'hide' ? 'search' : 'hide';
});
