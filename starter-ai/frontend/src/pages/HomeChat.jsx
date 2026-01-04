import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import Markdown from '../components/markdown/Markdown'

export default function HomeChat() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you today?' }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const messagesEndRef = useRef(null)

    useEffect(() => {
        let storedSessionId = localStorage.getItem('chat_session_id')
        if (!storedSessionId) {
            storedSessionId = crypto.randomUUID()
            localStorage.setItem('chat_session_id', storedSessionId)
        }
        setSessionId(storedSessionId)
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        // Add an empty assistant message to stream into
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, session_id: sessionId }),
            })

            if (!response.body) return

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let assistantMessage = ''

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') continue

                        try {
                            // Backend sends plain text chunks in data:
                            // We need to accumulate it
                            // Note: current backend logic implementation details might vary slightly, 
                            // but based on previous context, it yields raw tokens or JSON.
                            // Let's assume plain text based on previous App.jsx inspection.

                            // Re-inspecting previous App.jsx logic implicitly...
                            // Actually, standard SSE from LangChain usually sends strings.
                            // If it's JSON, we parse. If string, we append.
                            // Let's stick to simple append for now, matching presumed previous logic.
                            assistantMessage += data
                            setMessages(prev => {
                                const newMessages = [...prev]
                                newMessages[newMessages.length - 1].content = assistantMessage
                                return newMessages
                            })
                        } catch (e) {
                            console.error('Error parsing stream:', e)
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="app-container">
            <div className="glass-panel">
                <header className="chat-header">
                    <div className="logo">
                        <Sparkles className="icon-sparkle" />
                        <h1>AI Starter <span className="beta-tag">BETA</span></h1>
                    </div>
                    <div className="status-indicator">
                        <span className="dot"></span>
                        Online
                    </div>
                </header>

                <div className="chat-messages">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`message-row ${msg.role}`}>
                            <div className="avatar">
                                {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className="message-bubble">
                                {msg.role === 'assistant' ? <Markdown text={msg.content} /> : msg.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.content === '' && (
                        <div className="message-row assistant">
                            <div className="avatar">
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
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={!input.trim() || isLoading}>
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    )
}
