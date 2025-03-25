import { Github } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-[#1E1E2A] backdrop-blur-md bg-[#0A0A12]/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1E1E2A] flex items-center justify-center shadow-lg ring-1 ring-white/5">
            <span className="text-xl font-bold font-heading">D</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading text-white">Discohook</h1>
            <p className="text-xs text-gray-400">Discord Webhook Sender</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/itzk4sra/Discohook" target="_blank">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-[#1E1E2A] bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}