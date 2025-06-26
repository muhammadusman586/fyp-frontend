import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { ChefHat, ShoppingCart, LayoutGrid, Bot } from "lucide-react"

const Card = ({ title, description, icon, route }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:bg-white/30 overflow-hidden group h-full"
      onClick={() => navigate(route)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="flex flex-col items-center">
          <div className="text-5xl bg-white/30 p-4 rounded-full shadow-md mb-6">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-700 text-center">{description}</p>
        </div>

        <div
          className={`flex justify-center items-center transition-opacity duration-300 mt-6 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-purple-800 font-medium flex items-center">
            Explore <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  const features = [
    {
      title: "Recipe  Recommendation",
      description: "Discover new recipes tailored to your preferences and dietary needs.",
      icon: <ChefHat className="h-8 w-8 text-purple-700" />,
      route: "/recipes",
    },
    {
      title: "Grocery Store",
      description: "Shop for ingredients and manage your grocery list effortlessly.",
      icon: <ShoppingCart className="h-8 w-8 text-purple-700" />,
      route: "/shop",
    },
    {
      title: "Kitchen Management",
      description: "Keep track of your pantry and plan your meals efficiently.",
      icon: <LayoutGrid className="h-8 w-8 text-purple-700" />,
      route: "/kitchen",
    },
    {
      title: "Kitchen Assistant",
      description: "Chat with our AI assistant for cooking tips and recipe advice.",
      icon: <Bot className="h-8 w-8 text-purple-700" />,
      route: "/chatbot",
    },
  ]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-8 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80')`,
      }}
    >
      {/* Semi-transparent gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(to right, rgba(191, 219, 254, 0.85), rgba(233, 213, 255, 0.85))",
        }}
      ></div>

      <div className="max-w-6xl w-full relative z-10 pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 tracking-tight">Welcome to Smart Recipe Grocer</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your all-in-one solution for recipe discovery, grocery shopping, and kitchen management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              route={feature.route}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
