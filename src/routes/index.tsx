import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="w-full h-screen pt-16 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Maps</h2>
        <p className="text-gray-600">Select a menu from the sidebar to get started</p>
      </div>
    </div>
  )
}
