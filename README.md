[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)

Setup Instructions
Prerequisites
Node.js (v16 or higher)

MongoDB (v5 or higher)

Git

Steps
Clone the Repository:

bash

git clone https://github.com/your-username/fintrack.git
cd fintrack
Install Dependencies:

bash

npm install
Set Up Environment Variables:

Create a .env file in the root directory.

Add the following variables:

env

PORT=5000
MONGODB_URI=mongodb://localhost:27017/fintrack
JWT_SECRET=your_jwt_secret_key
EXCHANGE_RATES_API_KEY=your_exchange_rates_api_key
Start the Server:

bash

npm start
The server will run on http://localhost:5000.

Access the Application:

Open your browser and navigate to http://localhost:5000.

"start": "concurrently \"npm run dev --prefix backend\" \"npm start --prefix frontend\"",
"test": "jest",
"test:unit": "jest tests/unit",
"test:integration": "jest tests/integration",
"test:security": "jest tests/security",
"test:performance": "artillery run tests/performance/load-test.yml",
"coverage": "jest --coverage"

--Frontend--
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"


--Backend--
    "dev": "nodemon server.js",
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:security": "jest tests/security",
    "test:performance": "artillery run tests/performance/load-test.yml",
    "coverage": "jest --coverage"

--Testing Run--
npm run test:unit / npx jest tests/unit/
npm run test:integration / npx jest tests/integration/
npm run test:security / npx jest tests/security/
npm run test:performanace / npx jest tests/performanace/

API supports
Exchange Rates API for providing currency exchange data.

POSTMAN API Document - https://documenter.getpostman.com/view/34096659/2sAYk7SPSE