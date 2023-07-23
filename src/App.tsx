import './App.css'
import { Routes, Route } from 'react-router-dom'; 
import { ListDetail } from './pages/ListDetail/ListDetail.tsx';
import { Navbar } from './components/Navbar/Navbar.tsx';
import { Login } from './pages/Login/Login.tsx';
import { Register } from './pages/Register/Register.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { Events } from './pages/Events/Events.tsx';

function App() {

  return (
    <UserProvider>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/list/:userId/:id" element={<ListDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="register" element={<Register /> } />
        </Routes>
        </div>
    </UserProvider>
  )
}

export default App
