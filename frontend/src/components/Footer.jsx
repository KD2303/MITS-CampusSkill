import { Link } from 'react-router-dom';
import { Github, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-light dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-mits-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <span className="text-mits-blue font-bold text-xl">Campus</span>
                <span className="text-mits-orange font-bold text-xl">Skill</span>
              </div>
            </Link>
            <p className="text-text-secondary dark:text-text-dark-secondary max-w-md">
              A student talent marketplace platform where teachers and students collaborate
              through tasks, chat, and a credit-based reward system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-text-dark mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/browse"
                  className="text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue dark:hover:text-mits-orange transition-colors"
                >
                  Browse Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue dark:hover:text-mits-orange transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue dark:hover:text-mits-orange transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-text-primary dark:text-text-dark mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-text-secondary dark:text-text-dark-secondary">
                <Mail size={16} />
                <span>mits@mitsgwalior.in</span>
              </li>
              <li>
                <a
                  href="https://github.com/mits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue dark:hover:text-mits-orange transition-colors"
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
              © {currentYear} MITS CampusSkill. All rights reserved.
            </p>
            <p className="flex items-center text-text-secondary dark:text-text-dark-secondary text-sm">
              Made with <Heart size={14} className="mx-1 text-red-500" /> by MITS Students
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
