const NoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0e0d13] text-white">
      <h1 className="text-[100px] font-bold sp-text">404</h1>
      <p className="text-[20px] text-gray-400 mt-2">Oops! Page not found.</p>
      <a href="/" className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg hover:opacity-80 transition-all">
        Go Home
      </a>
    </div>
  )
}

export default NoPage;