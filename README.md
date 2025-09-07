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
