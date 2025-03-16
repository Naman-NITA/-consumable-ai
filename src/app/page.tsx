import { NotionEditor } from "@/components/notion-editor"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-10 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="animate-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
           CONSUMABLE AI
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mx-auto rounded-full mb-8"></div>
        </div>

        <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto animate-in fade-in duration-1000">
       Revolutionizing Organic Marketing with AI – Faster, Smarter, and More Effective
        </p>

        <div className="animate-in fade-in-50 duration-1000 delay-300">
          <NotionEditor />
        </div>
      </div>
    </div>
  )
}

