This document provides important information regarding the dependencies used in this React application.

Dependencies
This project utilizes the following external libraries:

Font Awesome: For scalable vector icons.
Recharts: A composable charting library built on React components.

Installation
To ensure a smooth setup and avoid any issues with missing dependencies, please follow the installation steps below.

1. Clone the Repository (if applicable)
If this project is hosted on a version control system like Git, first clone the repository:

git clone <your-repository-url>
cd <your-project-directory>

2. Install Node.js and npm/Yarn
Ensure you have Node.js and a package manager (npm or Yarn) installed on your system.

Node.js & npm: Download from nodejs.org

Yarn: Install via npm: npm install -g yarn

3. Install Project Dependencies
Navigate to your project's root directory in your terminal and run one of the following commands to install all required dependencies, including Font Awesome and Recharts:

Using npm:

npm install

Using Yarn:

yarn install

4. Install Specific Libraries (if not included in package.json)
While npm install or yarn install should cover all dependencies listed in your package.json, if for any reason Font Awesome or Recharts are not installed, you can add them manually using the following commands:

Install Recharts:

npm install recharts
# OR
yarn add recharts

Install Font Awesome (example for React Font Awesome package, assuming free icons):

npm install --save @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
# OR
yarn add @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome

Note: The Font Awesome installation above is for the React-specific package and common free solid icons. If you use different icon sets (e.g., free-regular-svg-icons, free-brands-svg-icons) or a different setup, please adjust the commands accordingly.

Running the Application
After installing all dependencies, you can typically start the development server using:

npm start
# OR
yarn start

This will usually open the application in your browser at http://localhost:3000 (or another specified port).

If you encounter any issues during the setup or installation, please feel free to reach out for assistance.
