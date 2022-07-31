# kanji-quiz

A simple quiz that temporarily reveals a random kanji character.

Customizable by difficulty metric, number of rounds, seconds of visibility, and difficulty level.

Powered by SvelteKit, TailwindCSS, daisyUI, and Prisma.

## Setup development server:
- Clone this repository
- Configure a connection to a PostgreSQL database (import kanjidict.sql) via an .env file (see .env.example)
- (A local PostgreSQL DB can be configured via the docker compose file)
- In the project directory, run `npm install`
- To run the development server, run `npm start dev`