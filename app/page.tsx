import { WebhookForm } from "@/components/webhook-form"
import { WebhookPreview } from "@/components/webhook-preview"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DebugPanel } from "@/app/debug-panel"
import pkg from "../package.json"

export default function Home() {
  // Check if debug mode is enabled in package.json
  const debugEnabled = pkg.config?.debug === true

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#1E1E2A]/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#1E1E2A]/20 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1E1E2A]/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 flex-1 flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 space-y-6">
            <WebhookForm />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <WebhookPreview />
          </div>
        </div>
        <Footer />
      </div>

      {/* Debug Panel - only shown if enabled in package.json */}
      {debugEnabled && <DebugPanel />}
    </main>
  )
}

