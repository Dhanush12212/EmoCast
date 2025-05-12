import React from 'react' 
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage'  
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>} />   
          <Route path='/profile' element={<Profile/>} />   
          <Route path='/subscription' element={<Subscription/>} />   
          <Route path='/login' element={<LoginPage/>} />   
          <Route path='/register' element={<RegisterPage/>} />   
        </Routes>
      </Router>
    </div>
  )
}

export default App