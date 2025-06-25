# Tourism Project

This repository contains the code for a small tourism admin interface. The application is built with React using the Vite build tool and TailwindCSS.

## Installation

Dependencies are managed with **npm**. To set up the project, install the packages from the `frontend` directory:

```bash
cd frontend
npm install
```

## Development server

After installing the dependencies, start the local development server:

```bash
npm run dev
```

### Environment variables

The frontend expects the API base URL to be provided via a Vite environment
variable named `VITE_API_URL`. Create a `.env` file in the `frontend` directory
based on the included `.env.example` and adjust the URL if necessary:

```bash
cp frontend/.env.example frontend/.env
```

The default value points to a local backend running on port `8080`.

The app will be served with hot module reload at the URL printed in the console.

## Project structure

```
/ (project root)
├── frontend/        React application built with Vite
│   ├── public/      Static assets
│   ├── src/         Application source code
│   └── ...          Configuration and documentation files
└── README.md        This file
```

The React app's source code includes components, contexts, hooks and pages under `frontend/src`. Additional documentation can be found in the `frontend` folder.

For a more detailed introduction to the React setup, see [`frontend/README.md`](frontend/README.md).
