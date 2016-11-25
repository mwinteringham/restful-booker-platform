# restful-booker-platform
A platform of multiple node based web services for training others on how to explore and test web service platforms

# Requirements
- Docker 1.12.0
- Docker Compose 1.8.0

# Installation
1. Clone the repo
2. Navigate into the restful-booker-platform root folder
3. Run ```docker-compose build``` to generate images
4. Run ```docker-compose up``` to start the platform
5. Navigate to http://localhost:3003 to access the site (Login is admin/password)

## Logging
Logging is available for each of the services for you to view when a service has been called. Once you have discovered the IP and Port for a specific service, simply update the port number from 3xxx to 9xxx and you will be presented with a live feed of the services log.
# Testing

#### Tools and Tech used 

1. CUCUCMBER  -> to define test in BDD
2. PAGE OBJECT
3. PAGE FACORY
4. WEBDRIVER  -> to interact with ui
5. HAMCREST  -> for assertion
6. WebdriverManager -> To download all driver into .m2 folder

#### How to run

Run run_acceptanceTest.sh on root directory -> this will do docker up and runs tests 
or 
Run RunnerTest in test folder