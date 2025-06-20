import React from 'react' 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage'  
import Profile from './pages/ProfilePage';
import Subscription from './pages/Subscription';
import LoginPage from './components/Authentication/LoginPage';
import RegisterPage from './components/Authentication/RegisterPage';
import VideoPage from './pages/VideoPage'; 
import ShortsPage from './pages/ShortsPage';
import AuthorProfile from './pages/AuthorProfile';
import WatchLater from './components/Video/WatchLater';

function App() {
  return ( 
    <Router>
      <Routes>
        {/* <Route path='/' element={<LandingPage/>} />    */}
        <Route path='/' element={<WatchLater/>} />   
        <Route path='/channel/:channelId' element={<AuthorProfile/>} />   
        <Route path='/profile' element={<Profile/>} />   
        <Route path='/subscription' element={<Subscription/>} />   
        <Route path='/shorts' element={<ShortsPage/>} />   
        <Route path='/login' element={<LoginPage/>} />   
        <Route path='/register' element={<RegisterPage/>} /> 
        <Route path='/videos/:id' element={ <VideoPage/> } />
        <Route path='/videos/category/:id' element={ <VideoPage/> } />
        <Route path="/search/:query" element={<LandingPage />} /> 
        
      </Routes>
    </Router> 
  )
}

export default App