import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Cpu, Loader2, AlertTriangle } from 'lucide-react'
import Markdown from '../components/markdown/Markdown'
import { Ollama } from 'ollama/browser'

// Use environment variable for API Key
// Use environment variable for API Key (supports both Vite native and explicit define)
const OLLAMA_API_KEY = import.meta.env.VITE_OLLAMA_API_KEY || VITE_OLLAMA_API_KEY || ''
const OLLAMA_HOST = window.location.origin + '/ollama-cloud' // Use local proxy to resolve CORS
// const OLLAMA_HOST = 'https://ollama.com' // Use local proxy to resolve CORS

export default function OllamaChat() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Connected to gpt-oss:20b-cloud via Ollama JS. How can I help?' }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const messagesEndRef = useRef(null)

    // Scroll handling
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('OLLAMA_API_KEY duar', OLLAMA_API_KEY);
        if (!input.trim() || isLoading) return

        const userMessage = input
        setInput('')
        setError('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        // Add empty assistant message
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])

        try {
            const ollama = new Ollama({
                host: OLLAMA_HOST,
                headers: {
                    Authorization: "Bearer " + OLLAMA_API_KEY,
                },
            })

            const response = await ollama.chat({
                model: "gpt-oss:20b-cloud",
                messages: [
                    ...messages.filter(m => !m.content.startsWith('Connected to')),
                    { role: 'user', content: userMessage }
                ],
                stream: true,
            })

            let assistantMessage = ''
            for await (const part of response) {
                assistantMessage += part.message.content
                setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].content = assistantMessage
                    return newMessages
                })
            }

        } catch (error) {
            console.error('Error:', error)
            const errorMsg = error.message || 'Error connecting to Ollama Cloud.'
            setError(errorMsg)
            setMessages(prev => {
                const newMsgs = [...prev]
                // Remove the empty assistant message if it stayed empty or indicate error
                if (newMsgs[newMsgs.length - 1].content === '') {
                    newMsgs[newMsgs.length - 1].content = `**Error:** ${errorMsg}`
                }
                return newMsgs
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="app-container">
            <div className="glass-panel" style={{ '--glass-border': 'rgba(0, 210, 255, 0.2)', '--primary': '#00d2ff', '--primary-glow': 'rgba(0, 210, 255, 0.5)' }}>
                <header className="chat-header">
                    <div className="logo">
                        <div className="logo-icon" style={{ background: '#00d2ff', padding: '4px', borderRadius: '8px', display: 'flex' }}>
                            <Cpu size={20} color="#fff" />
                        </div>
                        <h1>Ollama Cloud <span className='bg-clip-text' style={{ background: '#00d2ff', color: 'transparent', backgroundClip: 'text' }}>EX</span></h1>
                    </div>
                    <div className="status-indicator">
                        <span className="dot" style={{ background: '#00d2ff', boxShadow: '0 0 8px #00d2ff' }}></span>
                        Connected
                    </div>
                </header>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-row ${msg.role}`}>
                            <div className="avatar" style={msg.role === 'assistant' ? { background: '#00d2ff' } : {}}>
                                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className="message-bubble" style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #00d2ff, #0078ff)' } : {}}>
                                {msg.role === 'assistant' ? <Markdown text={msg.content} /> : msg.content}
                            </div>
                        </div>
                    ))}
                    {error && (
                        <div className="message-row assistant">
                            <div className="avatar" style={{ background: '#ff9900' }}>
                                <AlertTriangle size={20} />
                            </div>
                            <div className="message-bubble" style={{ borderColor: '#ff9900', color: '#ff9900', border: '1px solid', background: 'rgba(255, 153, 0, 0.1)' }}>
                                {error}
                            </div>
                        </div>
                    )}
                    {isLoading && messages[messages.length - 1]?.content === '' && (
                        <div className="message-row assistant">
                            <div className="avatar" style={{ background: '#00d2ff' }}>
                                <Bot size={20} />
                            </div>
                            <div className="message-bubble loading">
                                <Loader2 className="spinner" size={16} />
                                Typing...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="chat-input-area">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={!OLLAMA_API_KEY ? "Warning: VITE_OLLAMA_API_KEY not set" : "Ask gpt-oss:20b-cloud..."}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!input.trim() || isLoading} style={{ background: '#00d2ff' }}>
                        {isLoading ? <Loader2 size={20} className="spinning" /> : <Send size={20} />}
                    </button>
                </form>
            </div>
        </div>
    )
}
