
<h1 align=center>Creative Assets Display</h1>

<p align=justified>This is a React application that displays creative assets from Directus and provides functionalities such as filtering, copying content, and downloading images.</p>

## Features

- Display creative assets with images, messages, and use cases.
- Filter assets based on program and tags.
- Copy message content to clipboard.
- View and download images in a modal.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/creative-assets.git
    cd creative-assets
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following environment variables:

    ```env
    REACT_APP_DIRECTUS_URL=https://directus.crio.do
    DIRECTUS_EMAIL=your-email
    DIRECTUS_PASSWORD=your-password
    ```

4. Start the development server:

    ```bash
    npm start
    ```

   The application will be available at `http://localhost:3000`.

## Deployment

To deploy the application using Vercel:

1. Install the Vercel CLI:

    ```bash
    npm install -g vercel
    ```

2. Log in to Vercel:

    ```bash
    vercel login
    ```

3. Deploy the application:

    ```bash
    vercel
    ```

4. Set up environment variables in Vercel:

   Go to your Vercel dashboard, select your project, and add the following environment variables in the "Settings" tab:

    - `REACT_APP_DIRECTUS_URL`
    - `DIRECTUS_EMAIL`
    - `DIRECTUS_PASSWORD`

5. Redeploy the application from the Vercel dashboard.

## Usage

- **Filter Assets:** Use the buttons to filter assets by program and the dropdown to filter by tags.
- **Copy Content:** Click on the message to copy its content to the clipboard.
- **View and Download Images:** Click on an image to view it in a modal and download it.
