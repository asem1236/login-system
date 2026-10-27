import { Route, Routes } from "react-router-dom"
import { Home } from "./Pages/Home"
import { Login } from "./Pages/Login"
import { ResetPassword } from "./Pages/ResetPassword"
import { Email_Verify } from "./Pages/Email_Verify"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/reset-password" element = {<ResetPassword/>}/>
        <Route path="/email-verify" element = {<Email_Verify/>}/>
      </Routes>
    </div>
  )
}

export default App