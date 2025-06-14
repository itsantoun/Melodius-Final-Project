// import React, { useState, useEffect } from 'react';
// import UserSidebar from '../User/UserSidebar';
// import './manageUser.css';

// function ManageUsers() {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = () => {
//         fetch('http://localhost:3001/users')
//             .then(response => response.json())
//             .then(data => {
//                 setUsers(data);
//             })
//             .catch(error => {
//                 console.error('Error fetching users:', error);
//             });
//     };

//     const deleteUser = (userId) => {
//         if (window.confirm('Are you sure you want to delete this user?')) {
//             fetch(`http://localhost:3001/deleteUser/${userId}`, {
//                 method: 'DELETE',
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data.message);
//                 setUsers(users.filter(user => user.id !== userId));
//             })
//             .catch(error => {
//                 console.error('Error deleting user:', error);
//             });
//         }
//     };

//     const disableAccount = (userId) => {
//         if (window.confirm('Are you sure you want to disable this account?')) {
//             fetch(`http://localhost:3001/disableAccount/${userId}`, {
//                 method: 'PUT',
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data.message);
//                 setUsers(users.map(user => user.id === userId ? { ...user, accountStatus: 'disabled' } : user));
//             })
//             .catch(error => {
//                 console.error('Error disabling account:', error);
//             });
//         }
//     };

//     return (
//         <div className="manage-users">
//             <UserSidebar />
//             <h2>Manage Users</h2>
//             <table className="manage-users__table">
//                 <thead className="manage-users__thead">
//                     <tr>
//                         <th className="manage-users__th">ID</th>
//                         <th className="manage-users__th">First Name</th>
//                         <th className="manage-users__th">Last Name</th>
//                         <th className="manage-users__th">Email</th>
//                         <th className="manage-users__th">Type</th>
//                         <th className="manage-users__th">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map(user => (
//                         <tr key={user.id} className="manage-users__tr">
//                             <td className="manage-users__td">{user.id}</td>
//                             <td className="manage-users__td">{user.firstName}</td>
//                             <td className="manage-users__td">{user.lastName}</td>
//                             <td className="manage-users__td">{user.email}</td>
//                             <td className="manage-users__td">{user.userType}</td>
//                             <td className="manage-users__td">
//                                 <button className="manage-users__button" onClick={() => deleteUser(user.id)}>Delete</button>
//                                 <button className="manage-users__button" onClick={() => disableAccount(user.id)}>Disable</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default ManageUsers;


import React, { useState, useEffect } from 'react';
import UserSidebar from '../User/UserSidebar';
import './manageUser.css';

function ManageUsers() {
    const [users, setUsers] = useState([]); // Initialize users as an empty array
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true); // Start loading
            setError(null); // Clear previous errors

            const response = await fetch('http://localhost:3001/users'); // Fetch users
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                throw new Error('API did not return an array'); // Ensure response is an array
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again later.');
        } finally {
            setLoading(false); // End loading
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                setError(null); // Clear previous errors

                const response = await fetch(`http://localhost:3001/deleteUser/${userId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.message);
                setUsers(users.filter(user => user.id !== userId)); // Remove user from state
            } catch (error) {
                console.error('Error deleting user:', error);
                setError('Failed to delete the user. Please try again.');
            }
        }
    };

    const disableAccount = async (userId) => {
        if (window.confirm('Are you sure you want to disable this account?')) {
            try {
                setError(null); // Clear previous errors

                const response = await fetch(`http://localhost:3001/disableAccount/${userId}`, {
                    method: 'PUT',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data.message);
                setUsers(users.map(user => 
                    user.id === userId ? { ...user, accountStatus: 'disabled' } : user
                ));
            } catch (error) {
                console.error('Error disabling account:', error);
                setError('Failed to disable the account. Please try again.');
            }
        }
    };

    return (
        <div className="manage-users">
            <UserSidebar />
            <h2>Manage Users</h2>

            {loading && <p>Loading users...</p>} {/* Show loading message */}
            {error && <p className="error">{error}</p>} {/* Show error message */}
            {!loading && users.length === 0 && !error && <p>No users found.</p>} {/* Show fallback if no users */}

            {users.length > 0 && (
                <table className="manage-users__table">
                    <thead className="manage-users__thead">
                        <tr>
                            <th className="manage-users__th">ID</th>
                            <th className="manage-users__th">First Name</th>
                            <th className="manage-users__th">Last Name</th>
                            <th className="manage-users__th">Email</th>
                            <th className="manage-users__th">Type</th>
                            <th className="manage-users__th">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="manage-users__tr">
                                <td className="manage-users__td">{user.id}</td>
                                <td className="manage-users__td">{user.firstName}</td>
                                <td className="manage-users__td">{user.lastName}</td>
                                <td className="manage-users__td">{user.email}</td>
                                <td className="manage-users__td">{user.userType}</td>
                                <td className="manage-users__td">
                                    <button
                                        className="manage-users__button"
                                        onClick={() => deleteUser(user.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="manage-users__button"
                                        onClick={() => disableAccount(user.id)}
                                    >
                                        Disable
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ManageUsers;