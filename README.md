# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/38ee217a-1d4e-456f-924c-e9ff4953fd68

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/38ee217a-1d4e-456f-924c-e9ff4953fd68) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the backend server (in one terminal)
npm run dev:server

# Step 5: Start the frontend development server (in another terminal)
npm run dev

# Or run both simultaneously:
npm run dev:all
```

## Backend Server

The project includes a backend server that fetches courses from Udemy and Coursera. The server runs on port 3001.

**To start the backend server:**
```sh
npm run dev:server
```

**To run both frontend and backend together:**
```sh
npm run dev:all
```

The backend server provides an API endpoint at `/api/courses/external` that fetches free courses from:
- Udemy: https://www.udemy.com/courses/free/
- Coursera: https://www.coursera.org/courses?query=free

**Note:** The backend server must be running for the External Courses tab to work in the frontend.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/38ee217a-1d4e-456f-924c-e9ff4953fd68) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
