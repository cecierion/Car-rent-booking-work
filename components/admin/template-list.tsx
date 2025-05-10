"use client"

import { useState } from "react"
import { Plus, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StoredTemplate } from "@/lib/template-storage"
import type { EmailTemplate } from "@/lib/email-service"
import Link from "next/link"

interface TemplateListProps {
  templates: StoredTemplate[]
  selectedTemplate: StoredTemplate | null
  onSelectTemplate: (template: StoredTemplate) => void
  onCreateTemplate: (type: EmailTemplate) => void
}

export function TemplateList({ templates, selectedTemplate, onSelectTemplate, onCreateTemplate }: TemplateListProps) {
  const [selectedType, setSelectedType] = useState<string>("all")

  // Get unique template types
  const templateTypes = Array.from(new Set(templates.map((t) => t.type)))

  // Filter templates by type
  const filteredTemplates = selectedType === "all" ? templates : templates.filter((t) => t.type === selectedType)

  // Group templates by type
  const groupedTemplates: Record<string, StoredTemplate[]> = {}
  filteredTemplates.forEach((template) => {
    if (!groupedTemplates[template.type]) {
      groupedTemplates[template.type] = []
    }
    groupedTemplates[template.type].push(template)
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Email Templates</h3>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/email-templates/test">
              <Mail className="h-4 w-4 mr-2" />
              Test Emails
            </Link>
          </Button>
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            {templateTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="p-4 space-y-6">
          {Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
            <div key={type} className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCreateTemplate(type as EmailTemplate)}
                  title={`Create new ${type} template`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1">
                {typeTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant={selectedTemplate?.id === template.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        {template.isDefault && (
                          <span className="bg-primary/10 text-primary text-xs rounded px-1 mr-2">Default</span>
                        )}
                        <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No templates found</p>
              {selectedType !== "all" && (
                <Button variant="link" onClick={() => setSelectedType("all")}>
                  Show all templates
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
