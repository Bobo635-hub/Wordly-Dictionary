# Wordly-Dictionary
 A  Single Page Application (SPA) dictionary built with HTML, CSS , Javascript and the free dictionary API
Wordly Dictionary SPA

#About the Project

 Wordly Dictionary is a single-page web application (SPA) that allows users to search for English words and view their definitions, parts of speech, examples, and pronunciation.

 The application uses the Wiktionary REST API to retrieve word definitions and JavaScript to display the results dynamically without reloading the page.

#Features

- Word Search: Search for English words.
- Definitions: View definitions and parts of speech.
- Examples: Display example sentences when available from the API.
- Pronunciation: Listen to word pronunciation using available audio or browser text-to-speech.
- Favorite Words: Add words to a favourites list and remove them when needed.
- Loading Indicator: Show a loading message while searching.
- Error Handling: Display helpful messages when a word cannot be found or the connection fails.
- Responsive Design: Works on desktop and mobile screens.
- Word of the Day: Displays a featured word.

#Technologies Used

- HTML
- CSS
- JavaScript
- Wiktionary REST API
- Web Speech API

#Getting Started

Prerequisites

A modern web browser and an internet connection.

Installation

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Open "index.html" using Live Server, or another local web server.
4. Enter a word in the search field to view its definitions.

API

Word definitions are retrieved from the Wiktionary REST API:

"https://en.wiktionary.org/api/rest_v1/page/definition/{word}"

Replace "{word}" with the English word you want to search for.

Project Structure

Wordly-Dictionary/
├── index.html
├── style.css
├── script.js
└── README.md

How Favorites Work

Favorite words are stored in a JavaScript array while the application is running. They can be added and removed, but the list resets when the page is refreshed.

Future Improvements

- Save favorite words between sessions.
- Add more pronunciation options.
- Include additional dictionary information where available.

#Author
 Rachel Wanjohi
 Developed as a Software Engineering project.

#License

This project is intended for educational purposes.