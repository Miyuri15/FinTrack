FinTrack - README

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xIbq4TFL)

Setup Instructions

Prerequisites
Ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- Git

Steps to Set Up the Project

1. Clone the Repository
bash
git clone https://github.com/your-username/fintrack.git
cd fintrack


2. Install Dependencies
bash
npm install


3. Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:



4. Start the Server
bash
npm start

The server will run on `http://localhost:5000`.

5. Access the Application
Open your browser and navigate to `http://localhost:5000`.

---

Project Structure

Frontend
json
{
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
}


Backend
json
{
    "dev": "nodemon server.js",
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:security": "jest tests/security",
    "test:performance": "artillery run tests/performance/load-test.yml",
    "coverage": "jest --coverage"
}


Run the Project
To run the backend and frontend concurrently:
bash
npm run start


---

Testing Instructions

Run Unit Tests
bash
npm run test:unit
npx jest tests/unit/


Run Integration Tests
bash
npm run test:integration
npx jest tests/integration/


Run Security Tests (Using ZAP & Postman Proxy)
Security testing was conducted using OWASP ZAP with Postman proxy support to detect vulnerabilities. The following steps were performed:

1. Configure Postman Proxy: 
   - Set up Postman to route API requests through a proxy.
   - Used OWASP ZAP to capture and analyze API traffic.

2. Active Scan in ZAP:
   - Conducted an active scan on API endpoints to identify vulnerabilities.
   - Checked for SQL injection, XSS, authentication flaws, and other security issues.

3. Generate Reports:
   - Security vulnerabilities were logged and documented using ZAP's reporting tool.

Since no automated security test script was created, this process was performed manually.

Run Performance Tests
Performance testing was conducted to evaluate the API’s ability to handle multiple requests simultaneously.
We used Artillery.io for load testing.
```bash
npm run test:performance
npx artillery run tests/performance/load-test.yml
```

---

API Documentation

Exchange Rates API
This project integrates an external Exchange Rates API to provide currency exchange data.

Postman API Documentation
You can find the API documentation on Postman:
[Postman API Document](https://documenter.getpostman.com/view/34096659/2sAYk7SPSE)

---

Additional Notes
- Ensure MongoDB is running before starting the application.
- Environment variables must be configured properly before running tests.
- Security testing was conducted using manual ZAP scans.
- Performance testing results should be reviewed to analyze response times and load capacity.

---

License
This project is licensed under the [MIT License](LICENSE).

---

#👩‍💻 Developed By: Miyuri

