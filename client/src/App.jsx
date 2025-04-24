import React from 'react' 
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage'  
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>} />   
          <Route path='/profile' element={<Profile/>} />   
          <Route path='/subscription' element={<Subscription/>} />   
        </Routes>
      </Router>
    </div>
  )
}

export default App