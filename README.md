# Water Quality Measuring System - Frontend

This repository contains the frontend code for the Water Quality Measuring System. The frontend is built using React and provides a user-friendly interface for interacting with the backend API.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Interface:** Intuitive interface for viewing and interacting with water quality data.
- **Charts:** Visual representation of water quality metrics.
- **Real-Time Updates:** Displays real-time data using WebSockets.
- **Authentication:** User login and registration.
- **Responsive Design:** Optimized for both desktop and mobile devices.
- **Images:** Includes images for better user experience and data representation.

## Technologies Used

- **React:** JavaScript library for building user interfaces.
- **Redux:** State management for React applications.
- **Axios:** Promise-based HTTP client for making API requests.
- **Socket.IO:** Library for real-time WebSocket communication.
- **Chart.js:** Library for rendering charts.
- **Material-UI:** React components for faster and easier web development.
- **Docker:** Containerization for easy deployment and development.
- **Images:** Used for icons, backgrounds, and illustrations.

## Setup and Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- Docker
- Docker Compose

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/davideke1/IIITH-Frontend-React.git
    cd IIITH-Frontend-React
    ```

2. Create a `.env` file in the `frontend` directory and add your environment variables:
    ```bash
    REACT_APP_API_URL=http://localhost/api
    REACT_APP_WS_URL=ws://localhost/ws
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Build and run the Docker container:
    ```bash
    docker-compose up --build
    ```

## Usage

1. Access the frontend application at `http://localhost`.
2. Log in or register to start using the application.
3. View real-time water quality data and metrics.
4. Access user-specific data and settings.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

## Images

Images are used throughout the application to enhance the user experience. These include:

- **Icons:** Used for various buttons and actions.
- **Backgrounds:** Enhances the visual appeal of the application.
- **Illustrations:** Provides better understanding and visualization of data.

Ensure that all image files are placed in the `src/assets/images` directory and are appropriately referenced in your components.
