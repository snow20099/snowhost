"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Send, X, Minimize2, Paperclip, Smile, File, XCircle, Bot, Loader2 } from "lucide-react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"

type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  files?: {
    name: string
    url: string
    size: number
    type: string
  }[]
}

type QuickQuestion = {
  id: string
  text: string
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<
    {
      name: string
      url: string
      size: number
      type: string
    }[]
  >([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3MB in bytes

  // Quick questions that users can select
  const quickQuestions: QuickQuestion[] = [
    { id: "contact", text: "What is the contact address?" },
    { id: "price", text: "What is the price?" },
    { id: "agent", text: "I need an agent member" },
  ]

  // Predefined answers for quick questions
  const predefinedAnswers: Record<string, string> = {
    contact:
      "Our contact address is: 123 Server Street, Cloud City, CC 10101. You can also reach us via email at support@snowhost.com or by phone at +1 (555) 123-4567.",
    price:
      "Our pricing varies based on your needs. Basic plans start at $5.99/month. For gaming servers, Minecraft starts at $8.99/month, CS2 at $12.99/month. Would you like me to provide more specific pricing information for a particular service?",
    agent:
      "I'll connect you with one of our customer service representatives right away. Please provide a brief description of your issue, and someone will be with you shortly. Alternatively, you can call us directly at +1 (555) 123-4567 during business hours.",
  }

  useEffect(() => {
    // Add initial welcome message after a delay
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            id: "welcome",
            content: "👋 Hi there! How can I help you today?",
            sender: "agent",
            timestamp: new Date(),
          },
        ])
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim() && uploadedFiles.length === 0) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setUploadedFiles([])

    // Show typing indicator
    setIsTyping(true)

    try {
      // Call our API route that interfaces with Gemini
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      })

      const data = await response.json()

      // Add AI response
      setIsTyping(false)
      let responseText = data.response

      // Add file acknowledgment if files were uploaded
      if (userMessage.files && userMessage.files.length > 0) {
        responseText += ` I've received your ${userMessage.files.length > 1 ? "files" : "file"} and will review ${userMessage.files.length > 1 ? "them" : "it"}.`
      }

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        content: responseText,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      console.error("Error fetching AI response:", error)

      // Fallback to predefined responses if API call fails
      setIsTyping(false)
      const fallbackResponses = [
        "Thanks for your message! I'll look into that for you.",
        "I understand your concern. Let me check that for you.",
        "Great question! Here's what you need to know...",
        "I'd be happy to help you with that. Could you provide more details?",
        "Let me connect you with a specialist who can better assist you with this.",
      ]

      let responseText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]

      // Add file acknowledgment if files were uploaded
      if (userMessage.files && userMessage.files.length > 0) {
        responseText += ` I've received your ${userMessage.files.length > 1 ? "files" : "file"} and will review ${userMessage.files.length > 1 ? "them" : "it"}.`
      }

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        content: responseText,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
    }
  }

  const handleQuickQuestion = (questionId: string) => {
    // Add the question as a user message
    const question = quickQuestions.find((q) => q.id === questionId)?.text || ""

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Show typing indicator
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false)

      // Use predefined answer
      const answer = predefinedAnswers[questionId] || "I'll look into that for you."

      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        content: answer,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).slice(0, 3) // Limit to 3 files max

    newFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 3MB limit.`,
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string
        setUploadedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            url: fileUrl,
            size: file.size,
            type: file.type,
          },
        ])
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const renderFilePreview = (file: { name: string; url: string; size: number; type: string }) => {
    const isImage = file.type.startsWith("image/")

    return (
      <div key={file.name} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-md mb-2 relative group">
        {isImage ? (
          <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
            <img src={file.url || "/placeholder.svg"} alt={file.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="h-10 w-10 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <File className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
        </div>
        <button
          onClick={() => removeFile(file.name)}
          className="absolute -top-1 -right-1 bg-background rounded-full shadow-sm"
        >
          <XCircle className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-4 right-4 z-40"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              size="icon"
              data-chat-button
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              height: isMinimized ? "auto" : "500px",
              width: isMinimized ? "300px" : "380px",
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-4 right-4 z-40 bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 border-b border-border/50 bg-blue-600/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-blue-100 dark:bg-blue-900">
                    <AvatarFallback className="text-blue-600 dark:text-blue-300">
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">SnowHost Support</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-600/10"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-600/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.sender === "agent" && (
                          <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 bg-blue-100 dark:bg-blue-900">
                            <AvatarFallback className="text-blue-600 dark:text-blue-300">
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.sender === "user" ? "bg-blue-600 text-white" : "bg-secondary"
                          }`}
                        >
                          {msg.content && <p className="text-sm">{msg.content}</p>}

                          {msg.files && msg.files.length > 0 && (
                            <div className={`mt-2 space-y-2 ${msg.sender === "user" ? "text-white" : ""}`}>
                              {msg.files.map((file) => (
                                <div
                                  key={file.name}
                                  className={`flex items-center gap-2 p-2 rounded-md ${msg.sender === "user" ? "bg-blue-700" : "bg-secondary/70"}`}
                                >
                                  {file.type.startsWith("image/") ? (
                                    <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                                      <img
                                        src={file.url || "/placeholder.svg"}
                                        alt={file.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className={`h-10 w-10 rounded flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-blue-800" : "bg-secondary/90"}`}
                                    >
                                      <File className="h-5 w-5" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium truncate">{file.name}</p>
                                    <p
                                      className={`text-xs ${msg.sender === "user" ? "text-blue-100" : "text-muted-foreground"}`}
                                    >
                                      {formatFileSize(file.size)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs opacity-70 mt-1">
                            {msg.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0 bg-blue-100 dark:bg-blue-900">
                          <AvatarFallback className="text-blue-600 dark:text-blue-300">
                            <Bot className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-secondary rounded-lg p-3 max-w-[70%]">
                          <div className="flex space-x-1">
                            <div
                              className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Questions */}
                  {messages.length === 1 && (
                    <div className="px-4 pb-2">
                      <p className="text-xs text-muted-foreground mb-2">Frequently asked questions:</p>
                      <div className="flex flex-col gap-2">
                        {quickQuestions.map((question) => (
                          <Button
                            key={question.id}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto py-2 text-xs"
                            onClick={() => handleQuickQuestion(question.id)}
                          >
                            {question.text}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Previews */}
                  {uploadedFiles.length > 0 && (
                    <div className="px-4 max-h-24 overflow-y-auto">
                      {uploadedFiles.map((file) => renderFilePreview(file))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="p-4 border-t border-border/50">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="flex-1 bg-background/50 border-border/50 rounded-full"
                      />
                      <div className="flex gap-1">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 hover:bg-blue-600/10 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-600/10 rounded-full">
                              <Smile className="h-5 w-5" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-lg bg-background" align="end">
                            <Picker
                              data={data}
                              onEmojiSelect={handleEmojiSelect}
                              theme="light"
                              set="native"
                              skinTonePosition="none"
                              previewPosition="none"
                              className="emoji-picker-custom"
                            />
                          </PopoverContent>
                        </Popover>

                        <Button
                          onClick={handleSendMessage}
                          className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                          size="icon"
                          disabled={isTyping}
                        >
                          {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add this before the final return statement */}
      {useEffect(() => {
        // Add custom styles for emoji picker
        const style = document.createElement("style")
        style.textContent = `
          .emoji-picker-custom em-emoji-picker {
            --background-color: hsl(var(--background));
            --border-color: hsl(var(--border));
            --category-button-color: hsl(var(--muted-foreground));
            --category-button-active-color: hsl(var(--primary));
            --text-color: hsl(var(--foreground));
          }
        `
        document.head.appendChild(style)

        return () => {
          document.head.removeChild(style)
        }
      }, [])}
    </>
  )
}

