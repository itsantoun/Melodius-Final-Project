import React, { useState, useEffect } from 'react';

function ManageUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch('http://localhost:3001/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const deleteUser = (userId) => {
      fetch(`http://localhost:3001/deleteUser/${userId}`, {
          method: 'DELETE',
      })
      .then(response => response.json())
      .then(data => {
          console.log(data.message);
          // Remove the deleted user from the users state
          setUsers(users.filter(user => user.id !== userId));
      })
      .catch(error => {
          console.error('Error deleting user:', error);
      });
  };

  const disableAccount = (userId) => {
        fetch(`http://localhost:3001/disableAccount/${userId}`, {
            method: 'PUT',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Update the user's account status in the users state
            setUsers(users.map(user => user.id === userId ? { ...user, accountStatus: 'disabled' } : user));
        })
        .catch(error => {
            console.error('Error disabling account:', error);
        });
    };

    return (
        <div>
            <h2>Manage Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.userType}</td>
                            <td>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                                <button onClick={() => disableAccount(user.id)}>Disable</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ManageUsers;
