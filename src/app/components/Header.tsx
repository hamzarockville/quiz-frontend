import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Quiz 
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link href="/login" className="hover:text-blue-200">Login</Link></li>
            <li><Link href="/register" className="hover:text-blue-200">Register</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

