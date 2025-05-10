"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TestEmailForm } from "@/components/admin/test-email-form"
import { getAllTemplates } from "@/lib/template-storage"
import type { StoredTemplate } from "@/lib/template-storage"
import Link from "next/link"

export default function TestEmailPage() {
  const [templates, setTemplates] = useState<StoredTemplate[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const allTemplates = await getAllTemplates()
        setTemplates(allTemplates)

        // Select the first template by default
        if (allTemplates.length > 0) {
          setSelectedTemplateId(allTemplates[0].id)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading templates:", error)
        setIsLoading(false)
      }
    }

    loadTemplates()
  }, [])

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link href="/admin/email-templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Test Email Center</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send Test Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="template-select" className="text-sm font-medium">
                Select Template
              </label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger id="template-select">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} {template.isDefault ? "(Default)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplate && <TestEmailForm template={selectedTemplate} />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
