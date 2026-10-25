const searchForm = document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const result = document.getElementById('result');
const loading = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');  

searchForm.addEventListener('submit', async (event) => {
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

        const response = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        const entries =data.en;

        if (!entries || entries.length === 0) {
            throw new Error('No definitions found');
        }

        result.innerHTML = '';

        const heading = document.createElement('h2');
        heading.textContent = word;
        result.appendChild(heading);

        entries.forEach((entry) => {
            const partOfSpeech = document.createElement('h3');
            partOfSpeech.textContent = entry.partOfSpeech || `meaning`;
            result.appendChild(partOfSpeech);

            entry.definitions.forEach((item) => {
                const definition = document.createElement('p');

                const parser = new DOMParser();
                const parsedDefinition = parser.parseFromString(item.definition, 'text/html');
                definition.textContent = parsedDefinition.body.textContent.trim();
                result.appendChild(definition);
            });
        });

    }catch (error) {
        result.textContent = '';
        errorMessage.textContent = error.message;
        errorMessage.hidden = false;
    } finally {
        loading.hidden = true;
    }
});
