import type React from "react"
import { Link } from "react-router-dom"
import Button from "../components/ui/Button"

const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-center text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

export default NotFound

