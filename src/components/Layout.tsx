import { ReactNode } from "react"
import Navbar from "./Navbar"

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 px-6 py-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}

export default Layout
