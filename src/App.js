import { Route, Routes } from 'react-router-dom';

import Navbar from './Pages/NavBar';
import Home from './Pages/Home';
import About from './Pages/About';

import UserDashboard from './Pages/User/UserDashboard';

import { Account } from './Pages/SignIn-SignUp/Account';
import Signup from './Pages/SignIn-SignUp/signup';
import Signin from './Pages/SignIn-SignUp/signin';
import Profile from './Pages/User/Profile';
import ForgotPassword from './Pages/SignIn-SignUp/ForgotPassword';

import AdminDashboard from './Pages/Admin_aws/AdminDashboard';
import ManageUsers from './Pages/Admin_aws/ManageUsers';

// Library Stuff
import Library from './Pages/Library';
import ClassicalSection from './Pages/LibrarySections/Classical';
import JazzSection from './Pages/LibrarySections/Jazz';
import EasternSection from './Pages/LibrarySections/Eastern';

// CRUD Functions:
import AddSheets from './Pages/Admin_aws/AddSheets';
import FeedPage from './Pages/feeds/feedPage';
import AnnouncementsPage from './Pages/feeds/Announcements';
import MyPost from './Pages/User/MyPosts';
import Manage_Content from './Pages/Admin_aws/Manage_Content';

function App() {
  return (
    <Account> {/* Wrapping entire app in Account context */}
      <>
        <Navbar /> {/* Global Navbar */}
        <div className='container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />

            <Route path='/AddSheets' element={<AddSheets />} />
            <Route path='/Library' element={<Library />} />
            <Route path='/Classical' element={<ClassicalSection />} />
            <Route path='/Jazz' element={<JazzSection />} />
            <Route path='/Eastern' element={<EasternSection />} />
            <Route path='/Manage_Content' element={<Manage_Content/>}/>

            <Route path='/signup' element={<Signup />} />
            <Route path='/signin' element={<Signin />} />
            <Route path='/forgotPassword' element={<ForgotPassword />} />

           
            <Route path='/Profile' element={<Profile />} />
            <Route path='/AdminDashboard' element={<AdminDashboard />} />
            <Route path='/ManageUsers' element={<ManageUsers />} />

            <Route path='/FeedPage' element={<FeedPage />} />
            <Route path='/AnnouncementsPage' element={<AnnouncementsPage />} />
            <Route path='/My_Post' element={<MyPost />} />
          </Routes>
        </div>
      </>
    </Account>
  );
}

export default App;