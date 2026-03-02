'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import './styles.css'

// Types
interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  attachedFile?: {
    name: string
    type: string
    data: string
  }
  reasoning?: string[]
}

interface ChatState {
  messages: Message[]
  isProcessing: boolean
  processingStep: number
  reasoningLog: string[]
  conversationId?: string
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState<'welcome' | 'chat'>('welcome')
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isProcessing: false,
    processingStep: 0,
    reasoningLog: [],
    conversationId: undefined
  })
  const [inputValue, setInputValue] = useState('')
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; data: string } | null>(null)
  
  const chatAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Recent cases for sidebar
  const recentCases = [
    { id: 1, title: 'Rent increase dispute – Glebe', date: 'Today, 2:14 PM' },
    { id: 2, title: 'Broken heater – urgent repairs', date: 'Yesterday, 10:30 AM' },
    { id: 3, title: 'Bond return – St Peters unit', date: '12 Jan 2025' }
  ]

  // Scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    if (chatAreaRef.current) {
      setTimeout(() => {
        chatAreaRef.current?.scrollTo({
          top: chatAreaRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }, 50)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages, chatState.reasoningLog, scrollToBottom])

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result as string
      setAttachedFile({
        name: file.name,
        type: file.type,
        data: data
      })
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

// Send message to Elastic Agent API
const sendMessage = async () => {
  const messageContent = inputValue.trim()
  if (!messageContent && !attachedFile) return

  // Create user message
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content: messageContent,
    attachedFile: attachedFile || undefined
  }

  // Reset input
  setInputValue('')
  setAttachedFile(null)
  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto'
  }

  // Switch to chat view and add message
  setCurrentView('chat')
  setChatState(prev => ({
    ...prev,
    messages: [...prev.messages, userMessage],
    isProcessing: true,
    processingStep: 1,
    reasoningLog: []
  }))

  try {
    // Prepare the request body
    const requestBody: {
      message: string
      attachedFile?: { name: string; type: string; data: string }
      conversationId?: string
    } = { message: messageContent }
    
    if (attachedFile) {
      requestBody.attachedFile = {
        name: attachedFile.name,
        type: attachedFile.type,
        data: attachedFile.data
      }
    }

    if (chatState.conversationId) {
      requestBody.conversationId = chatState.conversationId
    }

    // Call the API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    const data = await response.json()

    // Animate through the reasoning steps one by one
    const steps = data.reasoning || []
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      setChatState(prev => ({
        ...prev,
        processingStep: i + 2,
        reasoningLog: [...prev.reasoningLog, steps[i]]
      }))
    }

    // Small delay before showing response
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: data.response,
      reasoning: data.reasoning || []
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage],
      isProcessing: false,
      processingStep: 0,
      conversationId: data.conversationId || prev.conversationId
    }))

  } catch (error) {
    console.error('Error sending message:', error)
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      content: `I apologize, but I encountered an error processing your request: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact NSW Fair Trading directly for assistance.`
    }
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, errorMessage],
      isProcessing: false,
      processingStep: 0
    }))
  }
}

  // Handle input keydown
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (!chatState.isProcessing) {
        sendMessage()
      }
    }
  }

  // Handle textarea resize
  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
    event.target.style.height = 'auto'
    event.target.style.height = Math.min(event.target.scrollHeight, 150) + 'px'
  }

  // Toggle reasoning view
  const [expandedReasoning, setExpandedReasoning] = useState<string | null>(null)

  // Start new chat
  const startNewChat = () => {
    setCurrentView('welcome')
    setChatState({
      messages: [],
      isProcessing: false,
      processingStep: 0,
      reasoningLog: [],
      conversationId: undefined
    })
    setInputValue('')
    setAttachedFile(null)
    setExpandedReasoning(null)
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  return (
    <>
      {/* Demo Controls */}
      <div className="demo-controls">
        <button 
          className={`demo-btn ${currentView === 'welcome' ? 'active' : ''}`}
          onClick={startNewChat}
        >
          Welcome
        </button>
        <button 
          className={`demo-btn ${chatState.isProcessing ? 'active' : ''}`}
          disabled
        >
          Processing
        </button>
        <button 
          className={`demo-btn ${currentView === 'chat' && !chatState.isProcessing && chatState.messages.length > 0 ? 'active' : ''}`}
          disabled
        >
          Result
        </button>
      </div>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <div className="app-shell">
        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <div className="logo-wrap">
              <div className="logo-icon">gA</div>
              <div className="logo-text">
                <span className="guard">guard</span><span className="ai-part">AIn</span>
              </div>
            </div>
            <div className="logo-tagline">NSW Tenant Assistant</div>
          </div>

          <button className="btn-new-chat" onClick={startNewChat}>
            + New Chat
          </button>

          <div className="sidebar-section-label">Recent Cases</div>
          <div className="cases-list">
            {recentCases.map(caseItem => (
              <div 
                key={caseItem.id} 
                className="case-item"
                onClick={() => {
                  if (window.innerWidth < 768) setSidebarOpen(false)
                  setCurrentView('chat')
                }}
              >
                <div className="case-dot"></div>
                <div className="case-info">
                  <div className="case-title">{caseItem.title}</div>
                  <div className="case-date">{caseItem.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="sidebar-footer-info">
              Disclaimer: This system provides information for reference only. Consult a qualified legal professional for your specific situation. <br/><strong>NSW Fair Trading</strong>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          {/* Topbar (Mobile) */}
          <div className="topbar">
            <button className="btn-hamburger" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div className="topbar-title">guardAIn</div>
          </div>

          {/* Chat Area */}
          <div className="chat-area" ref={chatAreaRef}>
            {currentView === 'welcome' ? (
              /* Welcome Screen */
              <div className="welcome-screen">
                <div className="welcome-logo-ring">gA</div>
                <h1 className="welcome-heading">NSW Tenancy Information System</h1>
                <p className="welcome-sub">
                  This system provides information related to NSW tenancy legislation for reference purposes. 
                  Consult a qualified legal professional for specific legal advice regarding your situation.
                </p>
                <div className="capability-chips">
                  <div className="chip">Lease Reviews</div>
                  <div className="chip">Repair Requests</div>
                  <div className="chip">Rent Increase Checks</div>
                  <div className="chip">Bond Disputes</div>
                  <div className="chip">Official Documents</div>
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="messages-list">
                {chatState.messages.map((message) => (
                  <div key={message.id} className={`msg-row ${message.role}`}>
                    {message.role === 'ai' && (
                      <div className="avatar ai-avatar">AI</div>
                    )}
                    {message.role === 'user' ? (
                      <div className="bubble user">
                        {message.attachedFile && (
                          <div style={{ marginBottom: '8px', fontSize: '0.85rem', opacity: 0.9 }}>
                            📎 {message.attachedFile.name}
                          </div>
                        )}
                        {message.content}
                      </div>
                    ) : (
                      <div className="ai-response-wrap">
                        {message.reasoning && (
                          <>
                            <div 
                              className="collapsed-reasoning"
                              onClick={() => setExpandedReasoning(
                                expandedReasoning === message.id ? null : message.id
                              )}
                            >
                              View Analysis Details ({message.reasoning.length} steps)
                            </div>
                            <div className={`expanded-reasoning ${expandedReasoning === message.id ? 'open' : ''}`}>
                              <div className="expanded-reasoning-inner">
                                {message.reasoning.map((step, idx) => (
                                  <div key={idx} className="log-line">
                                    <span className="log-arrow">&gt;</span>
                                    <span className="log-num"> {idx + 1}.</span> {step}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        <div className="bubble ai" dangerouslySetInnerHTML={{ __html: message.content }} />
                        <div className="action-card">
                          <div className="action-card-label">Reference Materials</div>
                          <div className="action-btns">
                            <button 
                              className="btn-action primary"
                              onClick={() => alert('Drafting email to your agent…')}
                            >
                              Consult Legal Professional
                            </button>
                            <button 
                              className="btn-action secondary"
                              onClick={() => alert('Creating official dispute document…')}
                            >
                              NSW Fair Trading Resources
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Processing State */}
                {chatState.isProcessing && (
                  <div className="msg-row ai">
                    <div className="avatar ai-avatar">AI</div>
                    <div className="processing-box">
                      <div className="processing-header">
                        <div className="processing-spinner"></div>
                        <div className="processing-title">guardAIn is analysing your case…</div>
                      </div>
                      
                      <div className="step-progress">
                        <div className={`step-node ${chatState.processingStep >= 1 ? 'active' : ''} ${chatState.processingStep > 1 ? 'done' : ''}`}>
                          <div className="step-circle">1</div>
                          <div className="step-label">Thinking</div>
                        </div>
                        <div className={`step-connector ${chatState.processingStep > 1 ? 'filled' : ''} ${chatState.processingStep === 1 ? 'active' : ''}`}></div>
                        
                        <div className={`step-node ${chatState.processingStep >= 2 ? 'active' : ''} ${chatState.processingStep > 2 ? 'done' : ''}`}>
                          <div className="step-circle">2</div>
                          <div className="step-label">Reasoning</div>
                        </div>
                        <div className={`step-connector ${chatState.processingStep > 2 ? 'filled' : ''} ${chatState.processingStep === 2 ? 'active' : ''}`}></div>
                        
                        <div className={`step-node ${chatState.processingStep >= 3 ? 'active' : ''} ${chatState.processingStep > 3 ? 'done' : ''}`}>
                          <div className="step-circle">3</div>
                          <div className="step-label">Verifying</div>
                        </div>
                      </div>

                      <div className="reasoning-log">
                        {chatState.reasoningLog.map((line, idx) => (
                          <div key={idx} className="log-line visible">
                            <span className="log-arrow">&gt;</span>
                            <span className="log-num"> {idx + 1}.</span> {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Bar */}
          <div className="input-bar-wrap">
            <div className={`input-bar ${chatState.isProcessing ? 'disabled' : ''}`}>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <button 
                className="btn-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={chatState.isProcessing}
              >
                +
              </button>
              <textarea
                ref={textareaRef}
                className="chat-input"
                placeholder={attachedFile ? `📎 ${attachedFile.name} attached — describe your issue…` : "Describe your tenancy situation..."}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                disabled={chatState.isProcessing}
                rows={1}
              />
              <button 
                className="btn-send"
                onClick={sendMessage}
                disabled={chatState.isProcessing}
              >
                →
              </button>
            </div>
            <div className="input-disclaimer">
              Disclaimer: This system provides information for reference only and is not a substitute for professional legal counsel. 
              Consult a qualified legal practitioner for specific advice. Contact NSW Fair Trading for official guidance.
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
