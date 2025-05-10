"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  placeholder?: string
}

export function RichTextEditor({
  value,
  onChange,
  height = "400px",
  placeholder = "Enter content here...",
}: RichTextEditorProps) {
  const [htmlMode, setHtmlMode] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleEditorChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
    handleEditorChange()
    editorRef.current?.focus()
  }

  const insertVariable = (variable: string) => {
    execCommand("insertHTML", `{{${variable}}}`)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("underline")}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("insertUnorderedList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("insertOrderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            const url = prompt("Enter URL:", "https://")
            if (url) execCommand("createLink", url)
          }}
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            const url = prompt("Enter image URL:", "https://")
            if (url) execCommand("insertImage", url)
          }}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("justifyLeft")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("justifyCenter")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("justifyRight")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button type="button" variant="ghost" size="sm" onClick={() => setHtmlMode(!htmlMode)} className="text-xs">
            <Code className="h-4 w-4 mr-1" />
            {htmlMode ? "Visual" : "HTML"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="px-2 pt-2 bg-transparent border-b rounded-none">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="variables">Template Variables</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="p-0 m-0">
          {htmlMode ? (
            <textarea
              className="w-full p-3 font-mono text-sm resize-none focus:outline-none"
              style={{ height }}
              value={value}
              onChange={handleHtmlChange}
              placeholder={placeholder}
            />
          ) : (
            <div
              ref={editorRef}
              className="w-full p-3 focus:outline-none overflow-auto"
              style={{ height, minHeight: height }}
              contentEditable
              onInput={handleEditorChange}
              onBlur={handleEditorChange}
              dangerouslySetInnerHTML={{ __html: value || "" }}
              placeholder={placeholder}
            />
          )}
        </TabsContent>
        <TabsContent value="variables" className="p-4 m-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => insertVariable("bookingId")} className="justify-start">
              Booking ID
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("startDate")} className="justify-start">
              Pickup Date
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("endDate")} className="justify-start">
              Return Date
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("totalPrice")} className="justify-start">
              Total Price
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("carMake")} className="justify-start">
              Car Make
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("carModel")} className="justify-start">
              Car Model
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("carYear")} className="justify-start">
              Car Year
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("locationName")}
              className="justify-start"
            >
              Location Name
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("locationAddress")}
              className="justify-start"
            >
              Location Address
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("customerName")}
              className="justify-start"
            >
              Customer Name
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("customerEmail")}
              className="justify-start"
            >
              Customer Email
            </Button>
            <Button variant="outline" size="sm" onClick={() => insertVariable("currentYear")} className="justify-start">
              Current Year
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("rejectionReason")}
              className="justify-start"
            >
              Rejection Reason
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("cancellationReason")}
              className="justify-start"
            >
              Cancellation Reason
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => insertVariable("daysUntilPickup")}
              className="justify-start"
            >
              Days Until Pickup
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
