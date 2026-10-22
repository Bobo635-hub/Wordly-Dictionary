const searchForm =document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const result = document.getElementById('result');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const word = wordInput.value.trim();
    console.log(word);
});
