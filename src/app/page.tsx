

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      {/* Background SVG */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center filter blur-sm opacity-70"
        style={{ backgroundImage: `url('http://googleusercontent.com/image_generation_content/0')` }}
      ></div>

      {/* Main Content Container */}
      <main className="relative z-10 bg-white bg-opacity-90 p-10 rounded-lg shadow-xl max-w-xl w-full">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6">Welcome!</h1>
        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          We&apos;re thrilled to have you here. Please choose an option below to get started with our onboarding process or explore employee resources.
        </p>

        {/* Links */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="/onboarding"
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            Start Onboarding
          </a>
          <a
            href="/employees"
            className="inline-block bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-300 transition-colors duration-300 shadow-md"
          >
            Employee Resources
          </a>
        </div>
      </main>

      {/* Footer - You can customize or remove this if not needed for the welcome page */}
      {/* Keeping a simple footer as a placeholder, modify as per your Next.js project's needs */}
      <footer className="relative z-10 mt-10 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}