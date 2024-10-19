# Final Fullstack FoodApp

This project is a full-stack food ordering application that uses a **React.js** frontend and an **AWS-based** backend, utilizing **DynamoDB** for the database. It supports functionalities such as managing orders, and creating, updating, and deleting items.

****

### Features
- **React Frontend:** A responsive and user-friendly interface for ordering food.
- **AWS Backend:** Uses AWS services like EC2, DynamoDB for data storage, and S3 for storing static assets.
- **Order Management:** Users can create, update, and delete food orders in real-time.
- **DynamoDB:** A NoSQL database for storing food items, orders, and customer information.

****

### Installation

To get started with the project, follow the steps below.

****

#### Backend Setup

1. **Clone the repository**:
    ```bash
    git clone https://github.com/kwakuduah12/final-fullstack-foodapp.git
    ```
    This command will copy the entire project to your local machine.

****

2. **Navigate to the project directory**:
    ```bash
    cd final-fullstack-foodapp
    ```
    Now, you are in the project folder.

****

3. **Start the EC2 instance (if using AWS)**:
   Ensure your EC2 instance is up and running. Use the following command in your AWS console or terminal to start the instance:
    ```bash
    aws ec2 start-instances --instance-ids <your-instance-id>
    ```
    Replace `<your-instance-id>` with your actual EC2 instance ID.

****

4. **Connect to EC2 using SSH**:
    ```bash
    ssh -i <path-to-your-key-pair> ubuntu@<your-ec2-public-ip>
    ```
    Replace `<path-to-your-key-pair>` with the path to your SSH key, and `<your-ec2-public-ip>` with the public IP address of your EC2 instance.

****

5. **Install necessary dependencies on the server**:
    ```bash
    sudo apt-get update
    sudo apt-get install nodejs npm
    ```
    This will install Node.js and npm, which are necessary to run the backend server.

****

6. **Install project dependencies**:
    Once you're inside the project directory, run:
    ```bash
    npm install
    ```
    This will install all the Node.js dependencies specified in the `package.json` file.

****

7. **Run the server**:
    After the installation is complete, you can start the backend server:
    ```bash
    node server.js
    ```
    The server will now be running and listening for requests.
    Should see Server running at http://localhost:3000


****

#### Frontend Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```
    Enter the frontend folder where the React app is located.

****

2. **Install frontend dependencies**:
    ```bash
    npm install
    ```
    This will install all the React dependencies for the frontend application.

****

3. **Start the frontend application**:
    ```bash
    npm start
    ```
    The frontend React application will now be running on `http://localhost:3000`.

****

### AWS Setup

1. **DynamoDB Table Creation**:
   You need to create a DynamoDB table to store the order data. You can create the table manually via the AWS Console or run the following command using AWS CLI:
    ```bash
    aws dynamodb create-table \
        --table-name Orders \
        --attribute-definitions \
            AttributeName=OrderId,AttributeType=S \
        --key-schema AttributeName=OrderId,KeyType=HASH \
        --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
    ```
    This command creates a table called **Orders** with a primary key `OrderId`.

****

### Environment Variables

You need to configure environment variables for AWS keys and other project settings. Create an `.env` file in the root of your project and add the following:

```bash
AWS_ACCESS_KEY_ID=<your-aws-access-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
DYNAMODB_TABLE_NAME=Orders
REGION=us-east-2