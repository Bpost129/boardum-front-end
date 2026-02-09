// npm modules
import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

// pages
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profile from './pages/Profile/Profile'
// import Profiles from './pages/Profiles/Profiles'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import Board from './pages/Board/Board'

// components
import NavBar from './components/NavBar/NavBar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// services
import * as authService from './services/authService'
import * as profileService from './services/profileService'
import * as boardService from './services/boardService'

// styles
import './App.css'

function App() {
  const [user, setUser] = useState(authService.getUser())
  const [profile, setProfile] = useState(null)
  const [boards, setBoards] = useState([])
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const handleAuthEvt = () => {
    setUser(authService.getUser())
  }

  const handleAddBoard = async (boardFormData) => {
    const newBoard = await boardService.createBoard(boardFormData)
    setBoards([newBoard, ...boards])
    navigate(`/boards/${newBoard._id}`)
  }

  const handleUpdateBoard = async (boardFormData) => {
    const updatedBoard = await boardService.updateBoard(boardFormData)
    setBoards(b => updatedBoard._id === b._id ? updatedBoard : b)
    navigate(`/boards/${updatedBoard._id}`)
  }

  const handleDeleteBoard = async (boardId) => {
    const deletedBoard = await boardService.deleteBoard(boardId)
    setBoards(boards.filter(b => b._id !== deletedBoard._id))
    navigate('/')
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const profileData = await profileService.getProfile(user.profile)
      setProfile(profileData)
    }
    fetchProfile()
    .then(() => {
      const fetchBoards = async () => {
        const boardsData = await boardService.getAllBoards()
        setBoards(boardsData)
      }
      fetchBoards()
    })
  }, [user])

  return (
    <>
      <NavBar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route 
          path="/" 
          element={
            <Landing 
              user={user} 
              profile={profile} 
              boards={boards}
              handleAddBoard={handleAddBoard}
              handleDeleteBoard={handleDeleteBoard}
            />
          } 
        />
        {/* <Route
          path="/profiles"
          element={
            <ProtectedRoute user={user}>
              <Profiles />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} profile={profile} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:boardId"
          element={
            <ProtectedRoute user={user}>
              <Board user={user} profile={profile} handleUpdateBoard={handleUpdateBoard} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={<Signup handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/login"
          element={<Login handleAuthEvt={handleAuthEvt} />}
        />
        <Route
          path="/auth/change-password"
          element={
            <ProtectedRoute user={user}>
              <ChangePassword handleAuthEvt={handleAuthEvt} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
