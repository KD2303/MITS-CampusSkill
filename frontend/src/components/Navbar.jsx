import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Search,
  Trophy,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: '/browse', label: 'Browse Tasks', icon: Search },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/post-task', label: 'Post Task', icon: PlusCircle },
  ];

  return (
    <nav className="bg-surface-light dark:bg-surface-dark shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-mits-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-mits-blue font-bold text-xl">Campus</span>
              <span className="text-mits-orange font-bold text-xl">Skill</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue dark:hover:text-mits-orange transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                {authLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue dark:hover:text-mits-orange transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              /* Profile dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-mits-blue flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-text-primary dark:text-text-dark font-medium">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={16} className="text-text-secondary" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-text-primary dark:text-text-dark">
                        {user?.name}
                      </p>
                      <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                        {user?.email}
                      </p>
                      <span className={user?.role === 'teacher' ? 'badge-teacher' : 'badge-student'}>
                        {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <LayoutDashboard size={18} />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 w-full"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <div className="hidden sm:flex items-center space-x-3">
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  {authLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <link.icon size={20} />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-ghost justify-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary justify-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
