# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment (Full Stack)

This section explains how to perform a fully automated deployment of the application to a fresh Ubuntu server.

### Prerequisites

-   An Ubuntu server (tested on 24.04 LTS).
-   Root or `sudo` access.
-   Your domain name or server IP address.

### Automated Deployment

The `deploy.sh` script is designed to automate the entire setup process. It will install all necessary software (Nginx, PostgreSQL, Node.js, pm2), configure the database, build the applications, and set up the web server.

1.  **Clone the Repository**
    Clone this repository to your server.
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Run the Deployment Script**
    Run the script with `sudo` and pass your server's domain name or IP address as the first argument.

    ```bash
    chmod +x deploy.sh
    sudo ./deploy.sh your-domain.com
    ```

    The script will handle the rest.

3.  **Add Angel One Credentials**
    The final manual step is to add your secret Angel One API credentials to the backend's environment file.

    ```bash
    sudo nano backend/.env
    ```
    Fill in the `ANGEL_API_KEY`, `ANGEL_CLIENT_CODE`, `ANGEL_PASSWORD`, and `ANGEL_TOTP` variables.

    After saving the file, restart the backend process for the changes to take effect:
    ```bash
    sudo pm2 restart trading-bot-backend
    ```

Your application is now fully deployed and accessible at `http://your-domain.com`.

## Updating the Application

After the initial deployment, you can use the `update.sh` script to deploy new code changes from your Git repository.

### How to use

1.  **Navigate to the project directory** on your server.

2.  **Run the update script** with `sudo`.

    ```bash
    chmod +x update.sh
    sudo ./update.sh
    ```

    The script will automatically:
    -   Pull the latest code.
    -   Install any new dependencies for the frontend and backend.
    -   Re-build the frontend.
    -   Apply any new database migrations (it will automatically load the credentials from `backend/.env`).
    -   Restart the backend server and Nginx.
