import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Quiz </h1>
          <p className="text-xl mb-8 text-center">
            AI-powered screening for candidates across various job roles.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition duration-300"
            >
              Login
            </Link>
          </div>

          {/* New Features Section */}
          <section className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6 text-center">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-4">Feature One</h3>
                  <p className="text-gray-700">Description of feature one that highlights its benefits and uses.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-4">Feature Two</h3>
                  <p className="text-gray-700">Description of feature two that highlights its benefits and uses.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-4">Feature Three</h3>
                  <p className="text-gray-700">Description of feature three that highlights its benefits and uses.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-6 text-center">Testimonials</h2>
              <div className="flex flex-col md:flex-row justify-center space-y-8 md:space-y-0 md:space-x-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-gray-700 italic">"Quiz  has transformed our hiring process!"</p>
                  <p className="text-gray-900 font-bold mt-4">- Happy Client</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <p className="text-gray-700 italic">"A must-have tool for any recruitment team."</p>
                  <p className="text-gray-900 font-bold mt-4">- Satisfied User</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
