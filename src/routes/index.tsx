import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const features = [
    {
      title: 'Map Comparison',
      description: 'Compare Google Maps, Naver Maps, and Kakao Maps side-by-side with synchronized controls and real-time navigation.',
      icon: '🗺️',
      link: '/compare',
      color: 'from-blue-500 to-blue-600',
      features: ['3-Map Sync', 'Joystick Control', 'Live Updates']
    },
    {
      title: 'Movement Simulation',
      description: 'Simulate realistic movement patterns with WASD controls, adjustable speed, and direction tracking across maps.',
      icon: '🎮',
      link: '/simulation',
      color: 'from-green-500 to-green-600',
      features: ['WASD Movement', 'Speed Control', 'Direction Marker']
    },
    {
      title: 'Game Minimap',
      description: 'Experience interactive game-style minimaps with GTA, Minecraft, PUBG, Zelda, Cyberpunk, and Elden Ring themes.',
      icon: '🎯',
      link: '/game',
      color: 'from-purple-500 to-purple-600',
      features: ['6 Game Styles', 'Custom UI', 'Theme Effects']
    }
  ]

  return (
    <div className="w-full min-h-screen pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Interactive Maps
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore powerful map features with comparison tools, movement simulation, and game-inspired interfaces
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature) => (
            <Link
              key={feature.link}
              to={feature.link}
              className="group relative bg-white rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl"
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-r ${feature.color} flex items-center justify-center relative`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                <span className="text-7xl relative z-10">{feature.icon}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {feature.features.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-500">
                  <span>Explore</span>
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
