Food Ordering App Backend
The backend is hosted on an AWS EC2 instance, using DynamoDB as the database. This read me will walk you through how to connect to the server and perform POST, GET, PUT, and PATCH requests to interact with the food orders.
Requirements
AWS EC2 Instance: The server is hosted on AWS EC2. Make sure you have access to the instance. Access is not currently restricted
DynamoDB Table: A DynamoDB table named FoodOrders is required with orderId as the partition key.
Connection Details
Server IP: 3.142.74.220
Server Port: 3000
Region: us-east-2
Steps to Connect to the Server
1. SSH into the EC2 Instance
Make sure you have the correct permissions on your PEM file and the SSH configuration set up properly.
Copy the code:
chmod 400 ~/Downloads/FoodRedo.pem

Then, connect to the EC2 instance using SSH:
Copy the code:
ssh -i ~/Downloads/FoodRedo.pem ubuntu@3.142.74.220

2. Navigate to the Server Directory
Once connected to the server, navigate to the food-ordering-app directory:
Copy the code:
cd ~/food-ordering-app/food-ordering-app1

3. Start the Server
To start the server, run the following command:
Copy the code:
node server.js

You should see the message Server running at http://localhost:3000 indicating the server is running successfully.
API Endpoints
You can interact with the server using the following curl commands:
1. POST: Create a New Order
Create a new order with orderId, items, and total:
Copy the code:
curl -X POST http://3.142.74.220:3000/order \
-H "Content-Type: application/json" \
-d '{"orderId": "001", "items": ["Burger", "Fries"], "total": 15.99}'

2. GET: Retrieve an Order by ID
Get an order using its orderId:
Copy the code:
curl -X GET http://3.142.74.220:3000/order/001

3. PUT: Update an Entire Order
Update an existing order's details:
Copy the code:
curl -X PUT http://3.142.74.220:3000/order/001 \
-H "Content-Type: application/json" \
-d '{"items": ["Pizza", "Coke"], "total": 19.99}'

4. PATCH: Modify a Specific Field of an Order
Update a specific field (e.g., total) in the order:
Copy the code:
curl -X PATCH http://3.142.74.220:3000/order/001 \
-H "Content-Type: application/json" \
-d '{"total": 20.99}'
