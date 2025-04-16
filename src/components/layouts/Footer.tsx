import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LegalConnect Ethiopia</h3>
            <p className="text-gray-300 text-sm">
              Connecting clients with the right legal professionals for their needs in Ethiopia. Our platform makes
              legal services accessible, transparent, and efficient.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
{/* 
          <div>
            <h3 className="text-lg font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/client/lawyers" className="text-gray-300 hover:text-white text-sm">
                  Find a Lawyer
                </Link>
              </li>
              <li>
                <Link to="/client/cases/post" className="text-gray-300 hover:text-white text-sm">
                  Post a Case
                </Link>
              </li>
              <li>
                <Link to="/client/appointments" className="text-gray-300 hover:text-white text-sm">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-white text-sm">
                  Legal Resources
                </Link>
              </li>
            </ul>
          </div> */}

          {/* <div>
            <h3 className="text-lg font-semibold mb-4">For Lawyers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/lawyer/cases/available" className="text-gray-300 hover:text-white text-sm">
                  Browse Cases
                </Link>
              </li>
              <li>
                <Link to="/lawyer/profile" className="text-gray-300 hover:text-white text-sm">
                  Manage Profile
                </Link>
              </li>
              <li>
                <Link to="/lawyer/appointments" className="text-gray-300 hover:text-white text-sm">
                  Manage Appointments
                </Link>
              </li>
              <li>
                <Link to="/resources/lawyers" className="text-gray-300 hover:text-white text-sm">
                  Professional Resources
                </Link>
              </li>
            </ul>
          </div> */}

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-300 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                support@legalconnect-ethiopia.com
              </li>
              <li className="flex items-center text-gray-300 text-sm">
                <Phone className="h-4 w-4 mr-2" />
                +251 11 123 4567
              </li>
            </ul>
            {/* <div className="mt-4">
              <Link
                to="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Contact Support
              </Link>
            </div> */}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} LegalConnect Ethiopia. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="#" className="text-gray-300 hover:text-white text-sm">
                Terms of Service
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white text-sm">
                Privacy Policy
              </Link>
              <Link to="#" className="text-gray-300 hover:text-white text-sm">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

