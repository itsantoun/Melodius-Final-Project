import { Route, Routes} from 'react-router-dom';

import Navbar from './Pages/NavBar';
import Home from './Pages/Home';
import About from './Pages/About'

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

function App() {
  // const location = useLocation();

  return (
    
    <>
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Navbar' element={<Account><Navbar /></Account>} />
          <Route path='/about' element={<About />} />


          <Route path='/AddSheets' element={<AddSheets />} />
          <Route path='/Library' element={<Library />} />
          <Route path='/Classical' element={<ClassicalSection />} />
          <Route path='/Jazz' element={<JazzSection />} />
          <Route path='/Eastern' element={<EasternSection />} />
          
          
          <Route path='/signup' element={<Account><Signup /></Account> } />
          <Route path='/signin' element={<Account><Signin /></Account>} />
          <Route path='/forgotPassword' element={<ForgotPassword />} />
          
         
         
          <Route path='/UserDashboard' element={ <Account> <UserDashboard /> </Account> } />
          <Route path='/Profile' element={ <Account> <Profile /> </Account> } />
          <Route path='/AdminDashboard' element={ <Account> <AdminDashboard /> </Account> } />
          <Route path='/ManageUsers' element={ <Account> <ManageUsers /> </Account> } />
         
          <Route path='/FeedPage' element={<Account> <FeedPage /> </Account>} />
          <Route path='/AnnouncementsPage' element={<Account> <AnnouncementsPage /> </Account>} />
          <Route path='/My_Post' element={<Account><MyPost /></Account>} />

         
          
          
          
        </Routes>
      </div>
    </>
  );
}

export default App;
