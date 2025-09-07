# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deployment

This section explains how to deploy the application on a bare-metal Linux server using Nginx.

### Prerequisites

-   A Linux server with root or sudo access.
-   Node.js and npm installed on the server.
-   Nginx installed on the server.

### Steps

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Run the deployment script**

    The `deploy.sh` script will install the dependencies and build the application for production.

    ```bash
    ./deploy.sh
    ```

    The production-ready files will be in the `dist` directory.

3.  **Configure Nginx**

    A sample Nginx configuration is provided in the `nginx.conf` file. You will need to copy this configuration to your Nginx configuration directory and customize it for your server.

    a.  **Copy the configuration:**

        ```bash
        sudo cp nginx.conf /etc/nginx/sites-available/your-app
        ```

    b.  **Customize the configuration:**

        Edit the `/etc/nginx/sites-available/your-app` file and replace the placeholders:
        -   `your_domain.com`: Replace with your server's domain name or IP address.
        -   `/path/to/your/app/dist`: Replace with the absolute path to the `dist` directory of your application.

    c.  **Enable the site:**

        ```bash
        sudo ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
        ```

    d.  **Test the Nginx configuration:**

        ```bash
        sudo nginx -t
        ```

    e.  **Restart Nginx:**

        If the test is successful, restart Nginx to apply the changes.

        ```bash
        sudo systemctl restart nginx
        ```

4.  **Access your application**

    Your application should now be accessible at `http://your_domain.com`.
