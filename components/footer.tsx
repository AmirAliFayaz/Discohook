import { Heart } from "lucide-react"
import NextLink from "next/link"

export function Footer() {
  return (
    <footer className="py-6 border-t border-[#1E1E2A] backdrop-blur-md bg-[#0A0A12]/80">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm text-gray-400">Discohook - Send customized Discord webhook messages</p>
          <p className="text-xs text-gray-500 mt-1">Not affiliated with Discord Inc.</p>
        </div>
        <div className="flex items-center gap-6 justify-center">
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-gray-500 fill-gray-500" />
            <span>By</span>
            <NextLink href="https://github.com/itzk4sra" target="_blank" className="text-gray-400 hover:text-white transition-colors duration-300">Itzk4sra</NextLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
