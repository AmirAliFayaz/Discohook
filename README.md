# Discohook - Modern Discord Webhook Sender

Discohook is a powerful and flexible Discord webhook sender designed for seamless message customization and real-time previews. With a focus on user experience, it provides advanced options for creating and managing webhooks with precision.

![Discohook Preview](https://i.ibb.co/Kj93fwBY/image.png)

## Features

### Live Preview

-   Instantly view changes before sending messages.
    
-   Ensures accurate formatting and presentation.
    
-   Eliminates guesswork with real-time updates.
    
-   Interactive UI elements enhance usability and efficiency.
    
-   Provides immediate visual feedback for precise message styling.
    

### Custom Message Options

-   **Content**: Supports rich text above embeds.
    
-   **Profile Customization**: Set custom usernames and avatar URLs.
    
-   **Thread Support**: Send messages directly to Discord forum threads.
    
-   **Multi-Webhook Support**: Manage and send messages to multiple webhooks efficiently.
    
-   **Custom Formatting**: Apply markdown and rich text options for better readability.
    

### Advanced Flags

-   **Suppress Embeds**: Hide link previews for cleaner messages.
    
-   **Suppress Notifications**: Prevent mention alerts to avoid unnecessary pings.
    
-   **Custom Mentions**: Precisely control @mentions for users and roles.
    
-   **Custom Message Delays**: Schedule webhook messages to be sent at a specific time.
    
-   **Auto-delete Options**: Configure messages to automatically delete after a set duration.
    

### File Attachments

-   Upload and send images, videos, or documents with webhook messages.
    
-   Supports various file formats for maximum flexibility.
    
-   Drag-and-drop functionality for an intuitive user experience.
    
-   **Multiple File Uploads**: Send multiple attachments in a single webhook.
    
-   **Automatic File Compression**: Optimize large files for faster processing.
    

### Embed Builder

-   **Author**: Customize author name, icon, and URL.
    
-   **Body**: Define titles, descriptions, and colors.
    
-   **Fields**: Add structured name-value pairs.
    
-   **Images**: Support for thumbnails and large embedded images.
    
-   **Footer**: Include text and an icon for a polished look.
    
-   **Timestamp Integration**: Automatically add timestamps for precise logging.
    
-   **Dynamic Embeds**: Preview and fine-tune multiple embeds within a single message.
    
-   **Custom Embed Layouts**: Choose from predefined templates or create your own layout.
    
-   **Color Picker**: Select precise embed colors for branding and theme consistency.
    

### Message Loading

-   Retrieve and edit messages using a direct Discord message link.
    
-   Modify existing webhook messages efficiently.
    
-   Fetch historical messages for quick reference and reuse.
    
-   **Message History Management**: Store frequently used messages for quick access.
    
-   **Undo & Redo Support**: Easily revert message changes before sending.
    

### UI/UX Design

-   **Dark Aesthetic**: A refined color scheme with a deep background (`#09122C`) and subtle neon highlights (`#CBC3E3`).
    
-   **Smooth Animations**: Skeleton loading, elegant hover effects, and responsive transitions.
    
-   **Fully Responsive**: Optimized for both desktop and mobile devices.
    
-   **Intuitive Controls**: Drag-and-drop embed customization, real-time previews, and interactive UI elements.
    
-   **Customizable Themes**: Adjust UI colors and styles to match personal preferences.
    
-   **Minimalist Mode**: Hide unnecessary elements for a distraction-free experience.
    

### Backend & API Integration

-   Full backend implementation with dedicated API routes for webhook processing.
    
-   Secure handling of Discord webhook requests with validation to prevent abuse.
    
-   Optimized for high performance and reliability.
    
-   **Rate Limit Handling**: Intelligent request management to comply with Discord API limits.
    
-   **Logging & Debugging**: Built-in logs to monitor webhook activity and troubleshoot errors.
    
-   **API Key Support**: Enable authentication for secure access to webhook endpoints.
    
-   **Cloud Integration**: Store webhook settings and templates for use across multiple devices.
    

## Installation & Setup

### Prerequisites

Before diving in, make sure you're geared up with the essentials:

-   **[Node.js](https://nodejs.org/)** – The backbone of modern web development! (Latest LTS version recommended)
    
-   **[npm](https://www.npmjs.com/)** or **[yarn](https://yarnpkg.com/)** – Because managing dependencies manually is so last decade.
    
-   **A Discord account with webhook permissions** – No webhooks? No party! Make sure you have the proper rights.
    
    

### Installation

1.  Clone the repository:
    
    ```sh
    git clone https://github.com/yourusername/discohook.git
    cd discohook
    
    ```
    
2.  Install dependencies:
    
    ```sh
    npm install
    # or
    yarn install
    
    ```
    

### Running the Application

Start the development server:

```sh
npm run dev
# or
yarn dev

```

Alternatively, you can start the regular development mode:

```sh
npm start
# or
yarn start

```

The application should now be accessible at `http://localhost:3000/`.

### Deployment

To build and deploy the project:

```sh
npm run build
# or
yarn build

```

The compiled files will be in the `build` directory, ready for deployment on a web server.

## Why Choose Discohook?

-   Designed for efficiency and ease of use.
    
-   Highly customizable with a modern, professional interface.
    
-   Secure and optimized for performance.
    
-   **Open Source & Extensible**: Easily extend functionality with plugins and integrations.
    
-   **Actively Maintained**: Regular updates to enhance features and security.
    
-   **Comprehensive Documentation**: Detailed guides and tutorials for both beginners and advanced users.
    
-   **Community-Driven Development**: User feedback influences future updates and improvements.
    

Discohook is built to provide a seamless webhook management experience with the latest web technologies, ensuring a balance of power and simplicity. Future updates will continue to refine functionality and expand capabilities, making it the ultimate tool for Discord webhook management.
