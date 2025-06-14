import React , { useContext } from 'react'
import './UserDashboard.css'
import { MdAccountCircle } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { MdOutlineDashboard } from "react-icons/md";
import { BsChatSquareDots } from "react-icons/bs";
import { IoLibraryOutline } from "react-icons/io5";
import { BsCameraReels } from "react-icons/bs";
import { BsFilePostFill } from "react-icons/bs";
import { Link } from 'react-router-dom';



import Status from '../SignIn-SignUp/Status';
import { AccountContext } from '../SignIn-SignUp/Account';

function UserSidebar() {

   const {currentUser} = useContext(AccountContext);

  return (

<div className='sidebar'>
   <div className='header'>
   <MdAccountCircle  />
   <Status/>
   </div>

   <div className='items'>
   {/* <Link to='/UserDashboard'><MdOutlineDashboard /> Dashboard</Link> */}
   <Link to='/Profile'><CgProfile />My Profile</Link>
   {/* <Link to='/ChatPage'><BsChatSquareDots  /> Chats</Link> */}
   <Link to='/feedPage'><BsCameraReels  /> Feeds</Link>
   <Link to='/AnnouncementsPage'><BsFilePostFill  /> Announcements</Link>
   <Link to='/My_Post'><BsFilePostFill  /> My Posts</Link>
   <Link to='/library'><IoLibraryOutline  /> Library</Link>
   {/* <button onClick={()=>signOut(db)}><IoIosLogOut  />Logout</button> */}

</div>

</div>


  )
}

export default UserSidebar