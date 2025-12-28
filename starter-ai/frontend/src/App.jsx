import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react'
import Markdown from './components/markdown/Markdown'

function App() {
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
            const response = await fetch('http://localhost:8000/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, session_id: sessionId }),
            })

            if (!response.body) return

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                buffer += chunk

                // Process SSE events
                const lines = buffer.split('\n')
                // Keep the last partial line in the buffer
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('event: dataUpdate')) {
                        // Skip event line, next line is data
                        continue
                    }
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '') continue // End of stream or empty
                        if (data.startsWith('error:')) {
                            // Handle error
                            setMessages(prev => {
                                const newMsgs = [...prev]
                                const last = newMsgs[newMsgs.length - 1]
                                last.content = "Error generating response."
                                return newMsgs
                            })
                        } else {
                            // Standard content update
                            const content = data.replace(/\\n/g, '\n')
                            setMessages(prev => {
                                const newMsgs = [...prev]
                                const lastMsgIndex = newMsgs.length - 1
                                const lastMsg = newMsgs[lastMsgIndex]
                                const updatedMsg = { ...lastMsg, content: lastMsg.content + content }
                                newMsgs[lastMsgIndex] = updatedMsg
                                return newMsgs
                            })
                        }
                    }
                }
            }

        } catch (error) {
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
                        <h1>AI Starter</h1>
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

export default App
