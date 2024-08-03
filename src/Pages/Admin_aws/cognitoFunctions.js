// cognitoFunctions.js

import { CognitoIdentityServiceProvider } from 'aws-sdk';

const listUsers = async () => {
  try {
    // Initialize the AWS SDK with your credentials and region
    const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' }); // Update the region if necessary

    // Specify the parameters for listing users
    const params = {
      UserPoolId: "us-east-1_aj3MKp9bc", // Update with your UserPoolId
    };

    // Call the listUsers method to retrieve the list of users
    const data = await cognito.listUsers(params).promise();

    // Return the list of users
    return data.Users;
  } catch (error) {
    // Handle errors if any
    console.error('Error listing users:', error);
    throw error;
  }
};

export { listUsers };
