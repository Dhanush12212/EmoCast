import React from 'react' 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage'  
import Profile from './pages/ProfilePage';
import Subscription from './pages/Subscription';
import LoginPage from './components/Authentication/LoginPage';
import RegisterPage from './components/Authentication/RegisterPage';
import Video from './pages/VideoPage';

function App() {
  return ( 
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>} />   
        <Route path='/profile' element={<Profile/>} />   
        <Route path='/subscription' element={<Subscription/>} />   
        <Route path='/login' element={<LoginPage/>} />   
        <Route path='/register' element={<RegisterPage/>} /> 
        <Route path='/video/:id' element={ <Video/> } />
      </Routes>
    </Router> 
  )
}

export default App