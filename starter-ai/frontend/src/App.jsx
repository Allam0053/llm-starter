import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import HomeChat from './pages/HomeChat'
import OllamaChat from './pages/OllamaChat'

// Simple CSS for the navigation, can be moved to App.css or module
const navStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 1000,
    padding: '1rem',
    display: 'flex',
    gap: '1rem'
}

const linkStyle = {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    backdropFilter: 'blur(5px)',
    background: 'rgba(0,0,0,0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)'
}

function Navigation() {
    return (
        <nav style={navStyle}>
            <Link to="/" style={linkStyle}>Home (Python)</Link>
            <Link to="/ollama" style={linkStyle}>Ollama (Direct)</Link>
        </nav>
    )
}

function App() {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/" element={<HomeChat />} />
                <Route path="/ollama" element={<OllamaChat />} />
            </Routes>
        </Router>
    )
}

export default App
