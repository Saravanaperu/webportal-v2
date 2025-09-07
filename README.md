# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment

This section explains how to deploy the application on a bare-metal Linux server using Nginx.

The `deploy.sh` script is designed to simplify the deployment process. It will check for prerequisites, build the application, and provide you with the necessary commands to configure Nginx.

### How to use

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Run the deployment script**

    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

    The script will guide you through the rest of the process. It will check if you have Node.js, npm, and Nginx installed, and if not, it will provide you with the commands to install them.

    After building the application, the script will output the commands you need to run to configure and restart Nginx. Just follow the instructions printed in your terminal.

## Backend Setup

This section explains how to set up and run the backend server.

### Prerequisites

-   Node.js and npm
-   A PostgreSQL database

### Steps

1.  **Navigate to the backend directory**

    ```bash
    cd backend
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up environment variables**

    Create a `.env` file in the `backend` directory by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Now, edit the `.env` file and provide the correct values for your environment:
    -   `DATABASE_URL`: Your PostgreSQL database connection string.
    -   `JWT_SECRET`: A long, random string for signing JSON Web Tokens.
    -   `ANGEL_API_KEY`: Your Angel One SmartAPI key.
    -   `ANGEL_CLIENT_CODE`: Your Angel One client code.
    -   `ANGEL_PASSWORD`: Your Angel One password.
    -   `ANGEL_TOTP`: The Time-based One-Time Password from your authenticator app.

4.  **Run database migrations**

    This command will create the necessary tables in your database based on the Prisma schema.

    ```bash
    npx prisma migrate dev
    ```

5.  **Start the server**

    -   For development (with auto-reloading):
        ```bash
        npm run dev
        ```

    -   For production:
        ```bash
        npm run start
        ```

    The backend server will be running on `http://localhost:3000`.
