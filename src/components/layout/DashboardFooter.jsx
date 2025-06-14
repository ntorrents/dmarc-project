import { Link } from 'react-router-dom'

const DashboardFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {currentYear} SafeDMARC. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              to="/privacy" 
              className="hover:text-primary-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms" 
              className="hover:text-primary-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default DashboardFooter