// src/App.jsx

import './App.css'
import AppRoutes from './routes' // Import từ thư mục routes
import { AuthProvider } from './context/AuthContext'

function App() {
  
  return (
    <AuthProvider>
      <AppRoutes/>
    </AuthProvider>
  )
}

export default App