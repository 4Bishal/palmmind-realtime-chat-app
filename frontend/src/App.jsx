import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/register" element={<div>Register Page</div>} />
      <Route path="/chat" element={<div>Chat Page</div>} />
    </Routes>
  )
}

export default App
