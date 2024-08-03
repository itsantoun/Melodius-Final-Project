import React, { createContext } from 'react';
import UserPool from './UserPool';
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const AccountContext = createContext();

const Account = (props) => {
  const getSession = async () => {
    return await new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser();

      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject();
          } else {
            resolve(session);
          }
        });
      } else {
        reject();
      }
    });
  };

  const authenticate = async (Username, Password) => {
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({
        Username,
        Pool: UserPool,
      });

      const authDetails = new AuthenticationDetails({
        Username,
        Password,
      });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("onSuccess: ", data);
          resolve(data);
        },
        onFailure: (err) => {
          console.error("onFailure :", err);
          reject(err);
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired: ", data);
          resolve(data);
        },
      });
    });
  };

  const logout = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
    }
  };


  const updateProfile = async (attributes) => {
    const user = UserPool.getCurrentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const attributeList = [];

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        attributeList.push(new CognitoUserAttribute({ Name: key, Value: attributes[key] }));
      }
    }

    return new Promise((resolve, reject) => {
      user.updateAttributes(attributeList, (err, result) => {
        if (err) {
          console.error('Error updating attributes:', err);
          reject(err);
        } else {
          console.log('Attributes updated successfully:', result);
          resolve(result);
        }
      });
    });
  };

  return (
    <AccountContext.Provider value={{ authenticate, getSession, logout, updateProfile }}>
      {props.children}
    </AccountContext.Provider>
  );
};

export { Account, AccountContext };
