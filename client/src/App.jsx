 import React from "react";
 import Auth from "./pages/auth";
 import Chat from "./pages/chat";
 import Profile from "./pages/profile";
 
import { BrowserRouter, Navigate ,Route,Routes} from 'react-router-dom';
function App() {
  return (
    <div> <BrowserRouter>
    <Routes>
      
    <Route path='/auth' element={<Auth/>} />
    <Route path='/chat' element={<Chat/>} />
    <Route path='/profile' element={<Profile/>} />
    <Route path='*' element={<Navigate to="/auth"/>} />
    </Routes>
    </BrowserRouter>
    
     </div> 
  );
};

export default App