# Portfolio Dashboard

A modern dashboard for managing multiple Dashlane teams (Portfolio View).
Features a slick glassmorphism design, CSV export, and persistent configuration.

## 🚀 Features

*   **Multi-Tenant Support**: Add multiple (Brand Name, API Token) pairs.
*   **Portfolio Overview**: Aggregated stats (Total Seats, Avg Health Score).
*   **Team Drill-Down**: Detailed view for each organization.
*   **CSV Export**: Flattened data export for all users.
*   **Persistent Config**: Tokens are saved locally in your browser.

## 📦 Deployment Guide (For Admins)

To provide this tool to non-technical admins without requiring them to use the terminal, we recommend **hosting the application**.

### Option 1: Vercel (Recommended)
1.  Fork or push this repository to your GitHub/GitLab.
2.  Log in to [Vercel](https://vercel.com).
3.  Click "Add New Project" and select this repository.
4.  Vercel will detect Create React App.
5.  Click **Deploy**.
6.  **Done!** Share the production URL with your admins.
    *   *Note: `vercel.json` is included to handle routing.*

### Option 2: GitLab Pages
1.  Push this code to your GitLab repository.
2.  The included `.gitlab-ci.yml` file will automatically trigger a pipeline.
3.  Once finished, go to **Deploy > Pages** in your repo settings to find your URL.
4.  **Important**: If your page is blank, you may need to set the `homepage` field in `package.json`.
    *   Open `package.json`
    *   Add `"homepage": "https://your-username.gitlab.io/your-project-name",`
    *   Add `"homepage": "https://your-username.gitlab.io/your-project-name",`
    *   Push the change.

### Option 2a: Manual GitLab Setup (No Terminal)
If you cannot use `git` commands, you can use the GitLab Website:

1.  **Create Project**: Go to GitLab and create a "New Blank Project".
2.  **Open Web IDE**: On your new project page, look for the **Edit** button (usually a blue button or dropdown) and select **Web IDE**.
3.  **Upload Files**:
    *   On your computer, open the folder containing this code.
    *   **Select** the following folders/files: `src`, `public`, `package.json`, `package-lock.json`, `.gitlab-ci.yml`, `tailwind.config.js`, `README.md`.
    *   **IMPORTANT**: Do NOT select `node_modules` or `.git`.
    *   **Drag and Drop** these selected items directly into the file tree on the left side of the Web IDE.
4.  **Commit**:
    *   Click the "Source Control" icon (looks like a branch) on the far left.
    *   Type a commit message (e.g., "Initial upload").
    *   Click **Commit to 'main'**.
5.  **Deploy**: GitLab will now see the `.gitlab-ci.yml` file and automatically start the deployment. Go to **Deploy > Pages** after a few minutes to see your link.

### Option 3: Netlify
1.  Drag and drop the `build` folder to Netlify Drop, or connect your Git repository.
2.  Ensure build command is `npm run build` and publish directory is `build`.
3.  Add a `_redirects` file with `/* /index.html 200` to `public/` folder to handle routing.

### Option 3: Local Usage (Technical)
1.  Install Node.js.
2.  Run `npm install`.
3.  Run `npm start`.

## 🛠 Tech Stack
*   React
*   Tailwind CSS (Custom Dark Theme)
*   Recharts
*   Axios
