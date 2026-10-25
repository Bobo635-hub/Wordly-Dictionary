const searchForm = document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const result = document.getElementById('result');
const loading = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const favouritesList = document.getElementById('favourites-list');

let favourites = [];

function displayFavourites() {
    favouritesList.innerHTML = '';

    favourites.forEach((word) => {
        const listItem = document.createElement('li');
        listItem.textContent = word;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.type = 'button';

        removeButton.addEventListener('click', () => {
            favourites = favourites.filter(
                (favourite) => favourite !== word
            );
            displayFavourites();
        });

        listItem.appendChild(removeButton);
        favouritesList.appendChild(listItem);
    });
}

displayFavourites();

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

        const response = await fetch(
            `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`
        );

        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        console.log('API data:', data);
        console.log('Pronunciation data:', data.en?.[0]);
        console.log('First entry:', data.en?.[0]);

        const entries = data.en || [];

        if (entries.length === 0) {
            throw new Error('No definitions found');
        }

        result.innerHTML = '';

        const heading = document.createElement('h2');
        heading.textContent = word;
        result.appendChild(heading);

        // Source link
        const source = document.createElement('p');
        source.textContent = 'Source: Wiktionary';

        const sourceLink = document.createElement('a');
        sourceLink.href =
            `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`;
        sourceLink.textContent = ' View source';
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';

        source.appendChild(sourceLink);
        result.appendChild(source);

        // Favourites button
        const favouriteButton = document.createElement('button');
        favouriteButton.type = 'button';

        function updateFavouriteButton() {
            favouriteButton.textContent = favourites.includes(word)
                ? 'Remove from Favourites'
                : 'Add to Favourites';
        }

        updateFavouriteButton();

        favouriteButton.addEventListener('click', () => {
            if (favourites.includes(word)) {
                favourites = favourites.filter(
                    (favourite) => favourite !== word
                );
            } else {
                favourites.push(word);
            }

            updateFavouriteButton();
            displayFavourites();
        });

        result.appendChild(favouriteButton);

        // Pronunciation button
        const audioButton = document.createElement('button');
        audioButton.textContent = '🔊 Play Pronunciation';
        audioButton.type = 'button';

        audioButton.addEventListener('click', () => {
            const audioUrl =
                data.en?.[0]?.pronunciations?.[0]?.audio?.[0]?.url;

            if (audioUrl) {
                const audio = new Audio(audioUrl);
                audio.play().catch(() => {
                    speakWord();
                });
            } else {
                speakWord();
            }
        });

        function speakWord() {
            const speech = new SpeechSynthesisUtterance(word);
            speech.lang = 'en-US';
            window.speechSynthesis.speak(speech);
        }

        result.appendChild(audioButton);

        // Definitions, synonyms, and examples
        entries.forEach((entry) => {
            if (!entry.definitions || entry.definitions.length === 0) {
                return;
            }

            const partOfSpeech = document.createElement('h3');
            partOfSpeech.textContent = entry.partOfSpeech || 'Meaning';
            result.appendChild(partOfSpeech);

            // Synonyms from Datamuse API
            const synonymsHeading = document.createElement('h4');
            synonymsHeading.textContent = 'Synonyms';
            result.appendChild(synonymsHeading);

            const synonymsText = document.createElement('p');
            synonymsText.textContent = 'Loading synonyms...';
            result.appendChild(synonymsText);

            fetch(
                `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}`
            )
                .then((synonymsResponse) => {
                    if (!synonymsResponse.ok) {
                        throw new Error('Could not load synonyms');
                    }

                    return synonymsResponse.json();
                })
                .then((synonyms) => {
                    if (synonyms.length > 0) {
                        synonymsText.textContent = synonyms
                            .slice(0, 10)
                            .map((item) => item.word)
                            .join(', ');
                    } else {
                        synonymsText.textContent =
                            'No synonyms available.';
                    }
                })
                .catch(() => {
                    synonymsText.textContent =
                        'Synonyms could not be loaded.';
                });

            // Definitions and examples — preserved
            entry.definitions.forEach((item) => {
                const definition = document.createElement('p');

                const parser = new DOMParser();
                const parsedDefinition = parser.parseFromString(
                    item.definition,
                    'text/html'
                );

                definition.textContent =
                    parsedDefinition.body.textContent.trim();

                result.appendChild(definition);

                if (item.examples && item.examples.length > 0) {
                    const exampleHeading = document.createElement('p');
                    exampleHeading.textContent = 'Example:';
                    result.appendChild(exampleHeading);

                    const example = document.createElement('p');
                    example.className = 'example';

                    const exampleText =
                        typeof item.examples[0] === 'string'
                            ? item.examples[0]
                            : item.examples[0].text || '';

                    const parsedExample = parser.parseFromString(
                        exampleText,
                        'text/html'
                    );

                    example.textContent =
                        parsedExample.body.textContent.trim();

                    if (example.textContent) {
                        result.appendChild(example);
                    }
                }
            });
        });

    } catch (error) {
        result.innerHTML = '';

        if (!navigator.onLine) {
            errorMessage.textContent =
                'You appear to be offline. Please check your internet connection.';
        } else if (error instanceof TypeError) {
            errorMessage.textContent =
                'Unable to connect to the dictionary. Please try again.';
        } else {
            errorMessage.textContent =
                'Sorry, we could not find definitions for that word. Please try another word.';
        }

        errorMessage.hidden = false;
    } finally {
        loading.hidden = true;
    }
});