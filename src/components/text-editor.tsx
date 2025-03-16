"use client"

import * as React from "react"
import { Bold, Code, Italic, Link, MessageSquare, MoreHorizontal, Underline } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Comment {
  id: string
  text: string
  selection: {
    start: number
    end: number
  }
}

export function TextEditor() {
  const [content, setContent] = React.useState(
    "Click on any text to format it or add comments. Try selecting this text!",
  )
  const [comments, setComments] = React.useState<Comment[]>([])
  const [selection, setSelection] = React.useState<{
    start: number
    end: number
  } | null>(null)
  const editorRef = React.useRef<HTMLDivElement>(null)

  const handleSelection = () => {
    const selection = window.getSelection()
    if (!selection || !editorRef.current) return

    const range = selection.getRangeAt(0)
    const start = range.startOffset
    const end = range.endOffset

    if (start !== end) {
      setSelection({ start, end })
    } else {
      setSelection(null)
    }
  }

  const addComment = (commentText: string) => {
    if (!selection) return

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: commentText,
      selection,
    }

    setComments([...comments, newComment])
  }

  const formatText = (format: string) => {
    if (!selection) return

    const before = content.substring(0, selection.start)
    const selected = content.substring(selection.start, selection.end)
    const after = content.substring(selection.end)

    switch (format) {
      case "bold":
        setContent(`${before}**${selected}**${after}`)
        break
      case "italic":
        setContent(`${before}*${selected}*${after}`)
        break
      case "underline":
        setContent(`${before}_${selected}_${after}`)
        break
      default:
        break
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative">
        {selection && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-popover p-1 rounded-lg shadow-lg border">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("bold")}>
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("italic")}>
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("underline")}>
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Link className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Add Comment</h4>
                    <textarea
                      className="w-full min-h-[100px] rounded-md border p-2"
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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        )}
        <TooltipProvider>
          <div
            ref={editorRef}
            className="min-h-[200px] w-full rounded-lg border bg-background p-4"
            contentEditable
            onMouseUp={handleSelection}
            onKeyUp={handleSelection}
            suppressContentEditableWarning
          >
            {comments.map((comment) => {
              const commentedText = content.substring(comment.selection.start, comment.selection.end)
              return (
                <Tooltip key={comment.id}>
                  <TooltipTrigger asChild>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-0.5 rounded">{commentedText}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{comment.text}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}

