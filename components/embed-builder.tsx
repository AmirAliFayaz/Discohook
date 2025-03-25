"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useWebhookStore } from "@/lib/store"
import { ColorPicker } from "@/components/color-picker"
import { Trash2, Plus, Image, User, Info, Grid2X2, FileText, LinkIcon } from "lucide-react"
import { TimestampPicker } from "@/components/timestamp-picker"

interface EmbedBuilderProps {
  index: number
}

export function EmbedBuilder({ index }: EmbedBuilderProps) {
  const { embeds, updateEmbed, removeEmbed, addField, removeField } = useWebhookStore()
  const embed = embeds[index]

  if (!embed) return null

  return (
    <Card className="bg-[#12121A] border-[#1E1E2A] backdrop-blur-sm shadow-lg overflow-hidden">
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: embed.color ? `#${embed.color.replace("#", "")}` : "#4B5563",
        }}
      ></div>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-white flex items-center gap-2">
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#1E1E2A] text-xs">
              {index + 1}
            </span>
            <span>Embed</span>
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeEmbed(index)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-700/20 rounded-full transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove embed</span>
          </Button>
        </div>

        <Accordion type="multiple" className="space-y-4">
          <AccordionItem value="general" className="border-[#1E1E2A] rounded-lg overflow-hidden">
            <AccordionTrigger className="py-3 px-4 hover:no-underline bg-[#0F0F18] hover:bg-[#1E1E2A] transition-colors duration-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-gray-400" />
                <span>General</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#0F0F18] rounded-lg mt-1 overflow-hidden">
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-title`} className="text-gray-300 font-medium">
                    Title
                  </Label>
                  <Input
                    id={`embed-${index}-title`}
                    value={embed.title || ""}
                    onChange={(e) => updateEmbed(index, { title: e.target.value })}
                    placeholder="Embed title"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-url`} className="text-gray-300 font-medium">
                    URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`embed-${index}-url`}
                      value={embed.url || ""}
                      onChange={(e) => updateEmbed(index, { url: e.target.value })}
                      placeholder="https://example.com"
                      className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-[#1E1E2A] bg-[#12121A] hover:bg-[#1E1E2A]"
                      title="Test URL"
                      onClick={() => {
                        if (embed.url) {
                          window.open(embed.url, "_blank")
                        }
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Optional URL for the title</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-description`} className="text-gray-300 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id={`embed-${index}-description`}
                    value={embed.description || ""}
                    onChange={(e) => updateEmbed(index, { description: e.target.value })}
                    placeholder="Embed description"
                    className="min-h-[80px] bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200 resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-color`} className="text-gray-300 font-medium">
                    Color
                  </Label>
                  <ColorPicker color={embed.color || "#4B5563"} onChange={(color) => updateEmbed(index, { color })} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="author" className="border-[#1E1E2A] rounded-lg overflow-hidden">
            <AccordionTrigger className="py-3 px-4 hover:no-underline bg-[#0F0F18] hover:bg-[#1E1E2A] transition-colors duration-200 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Author</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#0F0F18] rounded-lg mt-1 overflow-hidden">
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-author-name`} className="text-gray-300 font-medium">
                    Name
                  </Label>
                  <Input
                    id={`embed-${index}-author-name`}
                    value={embed.author?.name || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        author: { ...embed.author, name: e.target.value },
                      })
                    }
                    placeholder="Author name"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-author-url`} className="text-gray-300 font-medium">
                    URL
                  </Label>
                  <Input
                    id={`embed-${index}-author-url`}
                    value={embed.author?.url || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        author: { ...embed.author, url: e.target.value },
                      })
                    }
                    placeholder="https://example.com"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-author-icon`} className="text-gray-300 font-medium">
                    Icon URL
                  </Label>
                  <Input
                    id={`embed-${index}-author-icon`}
                    value={embed.author?.icon_url || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        author: { ...embed.author, icon_url: e.target.value },
                      })
                    }
                    placeholder="https://example.com/icon.png"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fields" className="border-[#1E1E2A] rounded-lg overflow-hidden">
            <AccordionTrigger className="py-3 px-4 hover:no-underline bg-[#0F0F18] hover:bg-[#1E1E2A] transition-colors duration-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Grid2X2 className="h-4 w-4 text-gray-400" />
                <span>Fields</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#0F0F18] rounded-lg mt-1 overflow-hidden">
              <div className="space-y-4 p-4">
                {embed.fields && embed.fields.length > 0 ? (
                  <div className="space-y-6">
                    {embed.fields.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="space-y-4 pb-4 border-b border-[#1E1E2A]">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-[#1E1E2A] text-xs">
                              {fieldIndex + 1}
                            </span>
                            <span>Field</span>
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeField(index, fieldIndex)}
                            className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-gray-700/20 rounded-full transition-colors duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Remove field</span>
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`embed-${index}-field-${fieldIndex}-name`}
                            className="text-gray-300 font-medium"
                          >
                            Name
                          </Label>
                          <Input
                            id={`embed-${index}-field-${fieldIndex}-name`}
                            value={field.name || ""}
                            onChange={(e) => {
                              const updatedFields = [...(embed.fields || [])]
                              updatedFields[fieldIndex] = {
                                ...updatedFields[fieldIndex],
                                name: e.target.value,
                              }
                              updateEmbed(index, { fields: updatedFields })
                            }}
                            placeholder="Field name"
                            className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`embed-${index}-field-${fieldIndex}-value`}
                            className="text-gray-300 font-medium"
                          >
                            Value
                          </Label>
                          <Textarea
                            id={`embed-${index}-field-${fieldIndex}-value`}
                            value={field.value || ""}
                            onChange={(e) => {
                              const updatedFields = [...(embed.fields || [])]
                              updatedFields[fieldIndex] = {
                                ...updatedFields[fieldIndex],
                                value: e.target.value,
                              }
                              updateEmbed(index, { fields: updatedFields })
                            }}
                            placeholder="Field value"
                            className="min-h-[60px] bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200 resize-y"
                          />
                        </div>

                        <div className="flex items-center space-x-2 bg-[#12121A] px-3 py-2 rounded-lg border border-[#1E1E2A]">
                          <input
                            type="checkbox"
                            id={`embed-${index}-field-${fieldIndex}-inline`}
                            checked={field.inline || false}
                            onChange={(e) => {
                              const updatedFields = [...(embed.fields || [])]
                              updatedFields[fieldIndex] = {
                                ...updatedFields[fieldIndex],
                                inline: e.target.checked,
                              }
                              updateEmbed(index, { fields: updatedFields })
                            }}
                            className="rounded border-[#1E1E2A] bg-[#12121A] text-gray-600 focus:ring-gray-500/50"
                          />
                          <Label
                            htmlFor={`embed-${index}-field-${fieldIndex}-inline`}
                            className="text-sm text-gray-300"
                          >
                            Inline
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 px-4 bg-[#12121A] rounded-lg border border-[#1E1E2A]">
                    <p className="text-gray-400 text-sm mb-2">No fields added yet</p>
                  </div>
                )}

                {(!embed.fields || embed.fields.length < 25) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addField(index)}
                    className="w-full border-[#1E1E2A] bg-[#12121A] hover:bg-[#1E1E2A] hover:text-white transition-all duration-200"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Add Field
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="images" className="border-[#1E1E2A] rounded-lg overflow-hidden">
            <AccordionTrigger className="py-3 px-4 hover:no-underline bg-[#0F0F18] hover:bg-[#1E1E2A] transition-colors duration-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-gray-400" />
                <span>Images</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#0F0F18] rounded-lg mt-1 overflow-hidden">
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-image`} className="text-gray-300 font-medium">
                    Image URL
                  </Label>
                  <Input
                    id={`embed-${index}-image`}
                    value={embed.image?.url || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        image: e.target.value ? { url: e.target.value } : undefined,
                      })
                    }
                    placeholder="https://example.com/image.png"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a direct URL to an image (PNG, JPG, GIF)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-thumbnail`} className="text-gray-300 font-medium">
                    Thumbnail URL
                  </Label>
                  <Input
                    id={`embed-${index}-thumbnail`}
                    value={embed.thumbnail?.url || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        thumbnail: e.target.value ? { url: e.target.value } : undefined,
                      })
                    }
                    placeholder="https://example.com/thumbnail.png"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">Small image shown in the top right of the embed</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="footer" className="border-[#1E1E2A] rounded-lg overflow-hidden">
            <AccordionTrigger className="py-3 px-4 hover:no-underline bg-[#0F0F18] hover:bg-[#1E1E2A] transition-colors duration-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-400" />
                <span>Footer</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-[#0F0F18] rounded-lg mt-1 overflow-hidden">
              <div className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-footer-text`} className="text-gray-300 font-medium">
                    Text
                  </Label>
                  <Input
                    id={`embed-${index}-footer-text`}
                    value={embed.footer?.text || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        footer: { ...embed.footer, text: e.target.value },
                      })
                    }
                    placeholder="Footer text"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-footer-icon`} className="text-gray-300 font-medium">
                    Icon URL
                  </Label>
                  <Input
                    id={`embed-${index}-footer-icon`}
                    value={embed.footer?.icon_url || ""}
                    onChange={(e) =>
                      updateEmbed(index, {
                        footer: { ...embed.footer, icon_url: e.target.value ? e.target.value : undefined },
                      })
                    }
                    placeholder="https://example.com/icon.png"
                    className="bg-[#12121A] border-[#1E1E2A] focus-visible:ring-gray-500/50 focus-visible:border-gray-500/50 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`embed-${index}-footer-timestamp`} className="text-gray-300 font-medium">
                    Timestamp
                  </Label>
                  <TimestampPicker
                    value={embed.footer?.timestamp}
                    onChange={(timestamp) =>
                      updateEmbed(index, {
                        footer: { ...embed.footer, timestamp },
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">Shows the time in the user's local timezone</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

