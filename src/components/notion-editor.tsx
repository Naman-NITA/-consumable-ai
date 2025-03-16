"use client"

import * as React from "react"
import {
  Bold,
  Code,
  Italic,
  Link2,
  MessageSquare,
  MoreHorizontal,
  Strikethrough,
  Type,
  Underline,
  X,
  ActivityIcon as Function,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  text: string
  timestamp: Date
  selection: {
    text: string
    start: number
    end: number
  }
  user: {
    name: string
    initials: string
  }
}

interface TextNode {
  id: string
  text: string
  format?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    code?: boolean
    equation?: boolean
    link?: string
    color?: string
  }
  commentId?: string
}
const sampleContent = [
  { id: "1", text: "Consumable AI is a digital marketing company helping brands grow organically in a competitive landscape." },
  { id: "2", text: "\n\n" },
  { id: "3", text: "With rising ad costs and stricter privacy regulations like GDPR, CCPA, and Apple's updates, traditional paid marketing is becoming less effective." },
  { id: "4", text: "\n\n" },
  { id: "5", text: "Our AI-powered SEO automation platform enables enterprise and D2C businesses to scale organic growth 10x faster and 10x cheaper." },
  { id: "6", text: "\n" },
  { id: "7", text: "Consumable AI Agents automate technical SEO, keyword research, and content optimization, ensuring maximum visibility and engagement." },
]

const colorOptions = [
  { name: "Default", value: "inherit" },
  { name: "Red", value: "#e03131" },
  { name: "Orange", value: "#f76707" },
  { name: "Yellow", value: "#f59f00" },
  { name: "Green", value: "#37b24d" },
  { name: "Blue", value: "#1c7ed6" },
  { name: "Purple", value: "#7048e8" },
  { name: "Pink", value: "#f06595" },
]

export function NotionEditor() {
  const [textNodes, setTextNodes] = React.useState<TextNode[]>(sampleContent)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [selection, setSelection] = React.useState<{
    text: string
    nodeId: string
    start: number
    end: number
  } | null>(null)
  const [hoveredCommentId, setHoveredCommentId] = React.useState<string | null>(null)
  const editorRef = React.useRef<HTMLDivElement>(null)

  const handleSelection = () => {
    const sel = window.getSelection()
    if (!sel || !editorRef.current) return

    const range = sel.getRangeAt(0)
    const text = range.toString().trim()

    if (text) {
      // Find the node that contains the selection
      const nodeElement = range.startContainer.parentElement
      const nodeId = nodeElement?.getAttribute("data-node-id")

      if (nodeId) {
        setSelection({
          text,
          nodeId,
          start: range.startOffset,
          end: range.endOffset,
        })
      }
    } else {
      setSelection(null)
    }
  }

  const addComment = (commentText: string) => {
    if (!selection) return

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: commentText,
      timestamp: new Date(),
      selection: {
        text: selection.text,
        start: selection.start,
        end: selection.end,
      },
      user: {
        name: "Naman 22UPE073",
        initials: "N",
      },
    }

    // Update the text node to reference this comment
    const updatedNodes = textNodes.flatMap((node) => {
      if (node.id === selection.nodeId) {
        // Split the node at selection points
        const beforeText = node.text.substring(0, selection.start)
        const selectedText = node.text.substring(selection.start, selection.end)
        const afterText = node.text.substring(selection.end)

        const result = []

        // Add text before selection if it exists
        if (beforeText) {
          result.push({
            id: Math.random().toString(36).substr(2, 9),
            text: beforeText,
            format: node.format,
          })
        }

        // Add the selected text with comment reference
        result.push({
          id: Math.random().toString(36).substr(2, 9),
          text: selectedText,
          format: node.format,
          commentId: newComment.id,
        })

        // Add text after selection if it exists
        if (afterText) {
          result.push({
            id: Math.random().toString(36).substr(2, 9),
            text: afterText,
            format: node.format,
          })
        }

        return result
      }
      return [node]
    })

    setTextNodes(updatedNodes)
    setComments([...comments, newComment])
    setSelection(null)
  }

  const deleteComment = (commentId: string) => {
    // Remove the comment
    setComments(comments.filter((comment) => comment.id !== commentId))

    // Remove the comment reference from text nodes
    const updatedNodes = textNodes.map((node) => {
      if (node.commentId === commentId) {
        return {
          ...node,
          commentId: undefined,
        }
      }
      return node
    })

    setTextNodes(updatedNodes)
  }

  const formatText = (format: string, value?: string) => {
    if (!selection) return

    // Find the node to format
    const updatedNodes = textNodes.flatMap((node) => {
      if (node.id === selection.nodeId) {
        // Split the node at selection points
        const beforeText = node.text.substring(0, selection.start)
        const selectedText = node.text.substring(selection.start, selection.end)
        const afterText = node.text.substring(selection.end)

        const result = []

        // Add text before selection if it exists
        if (beforeText) {
          result.push({
            id: Math.random().toString(36).substr(2, 9),
            text: beforeText,
            format: node.format,
            commentId: node.commentId,
          })
        }

        // Add the selected text with formatting
        const newFormat = { ...node.format } || {}

        switch (format) {
          case "bold":
            newFormat.bold = true
            break
          case "italic":
            newFormat.italic = true
            break
          case "underline":
            newFormat.underline = true
            break
          case "strikethrough":
            newFormat.strikethrough = true
            break
          case "code":
            newFormat.code = true
            break
          case "equation":
            newFormat.equation = true
            break
          case "color":
            newFormat.color = value
            break
        }

        result.push({
          id: Math.random().toString(36).substr(2, 9),
          text: selectedText,
          format: newFormat,
          commentId: node.commentId,
        })

        // Add text after selection if it exists
        if (afterText) {
          result.push({
            id: Math.random().toString(36).substr(2, 9),
            text: afterText,
            format: node.format,
            commentId: node.commentId,
          })
        }

        return result
      }
      return [node]
    })

    setTextNodes(updatedNodes)
    setSelection(null)
  }

  const getCommentIdForNode = (node: TextNode) => {
    return node.commentId || null
  }

  const renderTextNode = (node: TextNode) => {
    let classes = ""
    const style: React.CSSProperties = {}

    // Apply formatting
    if (node.format) {
      if (node.format.bold) classes += " font-bold"
      if (node.format.italic) classes += " italic"
      if (node.format.underline) classes += " underline"
      if (node.format.strikethrough) classes += " line-through"
      if (node.format.code) classes += " font-mono bg-muted px-1 rounded"
      if (node.format.equation) classes += " font-mono text-blue-500"
      if (node.format.color) style.color = node.format.color
    }

    // Apply comment highlighting
    if (node.commentId) {
      const isHovered = hoveredCommentId === node.commentId
      classes += isHovered
        ? " bg-yellow-200 dark:bg-yellow-900 transition-colors duration-200"
        : " bg-yellow-100/80 dark:bg-yellow-900/30 transition-colors duration-200"
    }

    return (
      <span
        key={node.id}
        data-node-id={node.id}
        data-comment-id={node.commentId}
        className={cn(classes, "transition-all duration-300")}
        style={style}
        onMouseEnter={() => {
          if (node.commentId) {
            setHoveredCommentId(node.commentId)
          }
        }}
        onMouseLeave={() => {
          if (node.commentId) {
            setHoveredCommentId(null)
          }
        }}
      >
        {node.text}
      </span>
    )
  }

  return (
    <div className="grid grid-cols-[1fr,300px] gap-4 h-[calc(100vh-8rem)] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
      <div className="relative p-6 overflow-y-auto bg-gray-950 text-gray-200">
        {selection && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-gray-800 p-1.5 rounded-lg shadow-lg border border-gray-700 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
              onClick={() => formatText("bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
              onClick={() => formatText("italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
              onClick={() => formatText("underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
              onClick={() => formatText("strikethrough")}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
              onClick={() => formatText("code")}
            >
              <Code className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
              onClick={() => formatText("equation")}
            >
              <Function className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
            >
              <Link2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
                >
                  <Type className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                {colorOptions.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    onClick={() => formatText("color", color.value)}
                    className="flex items-center gap-2 hover:bg-gray-700 text-gray-200"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: color.value === "inherit" ? "currentColor" : color.value }}
                    />
                    <span>{color.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-gray-200">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Add Comment</h4>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border border-gray-700 bg-gray-900 p-2 text-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Type your comment here..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          addComment(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-700 rounded-md transition-colors text-gray-300 hover:text-white"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div
          ref={editorRef}
          className="min-h-[200px] w-full text-lg leading-relaxed focus:outline-none animate-in fade-in duration-500"
          contentEditable
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          suppressContentEditableWarning
        >
          {textNodes.map(renderTextNode)}
        </div>
      </div>
      {comments.length > 0 && (
        <div className="border-l border-gray-800 bg-gray-900 p-4 space-y-4 overflow-y-auto">
          <h3 className="font-semibold text-sm text-gray-400 uppercase tracking-wider">Comments</h3>
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={cn(
                  "relative p-3 rounded-lg border border-gray-800 bg-gray-800/50 shadow-sm transition-all duration-300 hover:shadow-md group",
                  hoveredCommentId === comment.id && "ring-2 ring-primary shadow-md scale-[1.02] bg-gray-800",
                )}
                onMouseEnter={() => setHoveredCommentId(comment.id)}
                onMouseLeave={() => setHoveredCommentId(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5 border border-gray-700 animate-in fade-in duration-300">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">N</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-gray-300">{comment.user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full hover:bg-gray-700 text-gray-400 hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteComment(comment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-200">{comment.text}</p>
                <p className="mt-1 text-[10px] text-gray-500">Just now</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

