# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment (Full Stack)

This section explains how to deploy the entire full-stack application (frontend and backend) to a bare-metal Linux server.

### Prerequisites

Before running the deployment script, ensure your server has:
-   A Linux distribution (e.g., Ubuntu, Debian).
-   Root or `sudo` access.
-   A configured PostgreSQL database.

The deployment script will check for `Node.js`, `npm`, `Nginx`, and `pm2`, and will guide you if they are missing.

### Steps

1.  **Clone the Repository**
    Clone this repository to your server.
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set Up Backend Environment**
    The backend requires a `.env` file for its configuration and credentials.
    -   Navigate to the backend directory: `cd backend`
    -   Copy the example file: `cp .env.example .env`
    -   Edit the `.env` file (`nano .env`) and fill in your details for the `DATABASE_URL`, `JWT_SECRET`, and your Angel One API credentials.
    -   Return to the root directory: `cd ..`

3.  **Run the Deployment Script**
    The `deploy.sh` script automates the entire setup process for both the frontend and backend.
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```
    This script will:
    -   Install dependencies for both frontend and backend.
    -   Build the frontend for production.
    -   Run the backend database migrations.
    -   Start the backend server using `pm2`.
    -   Provide you with the final Nginx commands to copy, paste, and run.

4.  **Finalize Nginx Configuration**
    Follow the final instructions printed by the script to configure Nginx. This will involve copying the provided `nginx.conf` file, editing it to include your domain/IP and project path, and restarting the Nginx service.

After these steps, your full-stack trading bot application will be live.
