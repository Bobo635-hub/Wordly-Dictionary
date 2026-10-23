const searchForm =document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const result = document.getElementById('result');
const loading = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');

searchForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const word = wordInput.value.trim();
if (word === '') {
        return;
    }

    result.innerHTML = '';
    loading.hidden = false;
    errorMessage.hidden = true;

    try {
        result.textContent = `Searching for "${word}"...`;

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found. Please try again.');
        }
        const data = await response.json();
      
        console.log(data);
    } catch (error) {
        result.textContent = '';
        errorMessage.textContent = error.message;
        errorMessage.hidden = false;
    } finally {
        loading.hidden = true;
    }
});