"use client"

import { create } from "zustand"

export interface EmbedField {
  name?: string
  value?: string
  inline?: boolean
}

export interface EmbedAuthor {
  name?: string
  url?: string
  icon_url?: string
}

export interface EmbedFooter {
  text?: string
  icon_url?: string
  timestamp?: string
}

export interface EmbedImage {
  url: string
}

export interface Embed {
  title?: string
  description?: string
  url?: string
  color?: string
  fields?: EmbedField[]
  author?: EmbedAuthor
  footer?: EmbedFooter
  image?: EmbedImage
  thumbnail?: EmbedImage
}

export interface WebhookPayload {
  content?: string
  username?: string
  avatar_url?: string
  thread_name?: string
  embeds?: Embed[]
  attachments?: any[]
}

interface WebhookState {
  webhookUrl: string
  content: string
  username: string
  avatarUrl: string
  threadName: string
  suppressEmbeds: boolean
  suppressNotifications: boolean
  files: File[]
  embeds: Embed[]

  setWebhookUrl: (url: string) => void
  setContent: (content: string) => void
  setUsername: (username: string) => void
  setAvatarUrl: (url: string) => void
  setThreadName: (name: string) => void
  setSuppressEmbeds: (suppress: boolean) => void
  setSuppressNotifications: (suppress: boolean) => void
  setFiles: (files: File[]) => void
  setEmbeds: (embeds: Embed[]) => void
  setFullPayload: (payload: WebhookPayload) => void

  addEmbed: () => void
  updateEmbed: (index: number, data: Partial<Embed>) => void
  removeEmbed: (index: number) => void

  addField: (embedIndex: number) => void
  removeField: (embedIndex: number, fieldIndex: number) => void

  resetForm: () => void
  getFullPayload: () => WebhookPayload
}

export const useWebhookStore = create<WebhookState>((set, get) => ({
  webhookUrl: "",
  content: "",
  username: "",
  avatarUrl: "",
  threadName: "",
  suppressEmbeds: false,
  suppressNotifications: false,
  files: [],
  embeds: [],

  setWebhookUrl: (url) => set({ webhookUrl: url }),
  setContent: (content) => set({ content }),
  setUsername: (username) => set({ username }),
  setAvatarUrl: (url) => set({ avatarUrl: url }),
  setThreadName: (name) => set({ threadName: name }),
  setSuppressEmbeds: (suppress) => set({ suppressEmbeds: suppress }),
  setSuppressNotifications: (suppress) => set({ suppressNotifications: suppress }),
  setFiles: (files) => set({ files }),
  setEmbeds: (embeds) => set({ embeds }),

  setFullPayload: (payload) =>
    set({
      content: payload.content || "",
      username: payload.username || "",
      avatarUrl: payload.avatar_url || "",
      threadName: payload.thread_name || "",
      embeds: payload.embeds || [],
    }),

  getFullPayload: () => {
    const state = get()
    return {
      content: state.content || undefined,
      username: state.username || undefined,
      avatar_url: state.avatarUrl || undefined,
      thread_name: state.threadName || undefined,
      embeds: state.embeds.length > 0 ? state.embeds : undefined,
      attachments: [],
    }
  },

  addEmbed: () =>
    set((state) => {
      if (state.embeds.length >= 10) return state

      return {
        embeds: [
          ...state.embeds,
          {
            color: "#5865F2",
          },
        ],
      }
    }),

  updateEmbed: (index, data) =>
    set((state) => {
      const newEmbeds = [...state.embeds]
      newEmbeds[index] = { ...newEmbeds[index], ...data }
      return { embeds: newEmbeds }
    }),

  removeEmbed: (index) =>
    set((state) => ({
      embeds: state.embeds.filter((_, i) => i !== index),
    })),

  addField: (embedIndex) =>
    set((state) => {
      const newEmbeds = [...state.embeds]
      const embed = newEmbeds[embedIndex]

      if (!embed) return state
      if (embed.fields && embed.fields.length >= 25) return state

      newEmbeds[embedIndex] = {
        ...embed,
        fields: [...(embed.fields || []), { name: "", value: "", inline: false }],
      }

      return { embeds: newEmbeds }
    }),

  removeField: (embedIndex, fieldIndex) =>
    set((state) => {
      const newEmbeds = [...state.embeds]
      const embed = newEmbeds[embedIndex]

      if (!embed || !embed.fields) return state

      newEmbeds[embedIndex] = {
        ...embed,
        fields: embed.fields.filter((_, i) => i !== fieldIndex),
      }

      return { embeds: newEmbeds }
    }),

  resetForm: () =>
    set({
      content: "",
      username: "",
      avatarUrl: "",
      threadName: "",
      suppressEmbeds: false,
      suppressNotifications: false,
      files: [],
      embeds: [],
    }),
}))

