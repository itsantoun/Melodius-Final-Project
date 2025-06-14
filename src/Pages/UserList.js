// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function UserList() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           'AIzaSyAZUn8cdSpeoK2o1E0zCscLBuX3vsKi3ds'
//         );

//         // Assuming response.data.users contains the array of users
//         setUsers(response.data.users);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       <h2>User List</h2>
//       <ul>
//         {users.map((user) => (
//           <li key={user.localId}>{user.email}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default UserList;
