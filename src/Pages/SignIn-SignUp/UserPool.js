import { CognitoUserPool } from "amazon-cognito-identity-js";

const poolData = {
    region: "us-east-1",
    UserPoolId: "us-east-1_aj3MKp9bc",
    ClientId:"73s3d88d9qbllortaaaa38eqdu",
}


export default new CognitoUserPool(poolData);