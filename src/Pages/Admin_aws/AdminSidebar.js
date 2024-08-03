import React , { useContext } from 'react'
import { MdAccountCircle } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { BsChatSquareDots } from "react-icons/bs";
import { IoLibraryOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';


import Status from '../SignIn-SignUp/Status';
import { AccountContext } from '../SignIn-SignUp/Account';

function AdminSidebar() {

   const {currentUser} = useContext(AccountContext);

  return (

<div className='sidebar'>
   <div className='header'>
   <MdAccountCircle  />
   <Status/>
   </div>

   <div className='items'>
   <Link to='/UserDashboard'><MdOutlineDashboard /> Dashboard</Link>
   <Link to='/ManageUsers'><CgProfile />Manage Users</Link>
   <Link to='/AddSheets'><BsChatSquareDots  />Manage Sheets</Link>
   <Link to='/library'><IoLibraryOutline  /> Library</Link>
   
</div>

</div>


  )
}

export default AdminSidebar