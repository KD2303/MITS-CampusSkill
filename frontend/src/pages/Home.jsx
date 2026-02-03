import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  Users,
  Award,
  MessageSquare,
  CheckCircle,
  Zap,
  Target,
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Target,
      title: 'Post & Take Tasks',
      description:
        'Teachers post skill-based tasks with credit rewards. Students take tasks to gain experience and earn points.',
    },
    {
      icon: MessageSquare,
      title: 'Private Chat',
      description:
        'Real-time chat rooms for seamless collaboration between task posters and assignees.',
    },
    {
      icon: Award,
      title: 'Earn Credits',
      description:
        'Complete teacher-assigned tasks to earn credit points. Build your profile and climb the leaderboard.',
    },
    {
      icon: Users,
      title: 'Peer Collaboration',
      description:
        'Students can post tasks for peer-to-peer collaboration and skill sharing.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '500+' },
    { label: 'Tasks Completed', value: '1,200+' },
    { label: 'Credits Awarded', value: '25,000+' },
    { label: 'Skills Shared', value: '50+' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Register',
      description: 'Sign up as a Teacher or Student with your MITS credentials.',
    },
    {
      step: '02',
      title: 'Browse Tasks',
      description: 'Explore available tasks based on your skills and interests.',
    },
    {
      step: '03',
      title: 'Collaborate',
      description: 'Take tasks, chat with posters, and submit your work.',
    },
    {
      step: '04',
      title: 'Earn Rewards',
      description: 'Get credits and ratings upon successful task completion.',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-mits-blue/5 via-white to-mits-orange/5 dark:from-mits-blue/10 dark:via-background-dark dark:to-mits-orange/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-mits-blue">Campus</span>
              <span className="text-mits-orange">Skill</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary dark:text-text-dark-secondary mb-8 max-w-3xl mx-auto">
              A student talent marketplace where teachers and students collaborate
              through tasks, chat, and a credit-based reward system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/browse" className="btn-primary text-lg px-8 py-3">
                Browse Tasks
                <ArrowRight className="ml-2 inline" size={20} />
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn-outline text-lg px-8 py-3">
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-mits-blue/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-mits-orange/10 rounded-full blur-xl" />
      </section>

      {/* Stats Section */}
      <section className="bg-mits-blue dark:bg-mits-blue-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-dark mb-4">
              Why CampusSkill?
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
              Bridge the gap between classroom learning and practical execution with
              our comprehensive task management and reward system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:translate-y-[-4px] transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-mits-blue/10 dark:bg-mits-blue/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-mits-blue" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-dark mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
              Get started in four simple steps and begin your journey to skill
              recognition and rewards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-mits-blue/10 dark:text-mits-blue/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-text-primary dark:text-text-dark mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary dark:text-text-dark-secondary">
                  {item.description}
                </p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 transform translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-mits-orange" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Section */}
      <section className="py-20 bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Teacher Card */}
            <div className="card p-8 border-2 border-mits-blue">
              <div className="badge-teacher inline-block mb-4">Teacher</div>
              <h3 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-4">
                For Teachers
              </h3>
              <ul className="space-y-3 text-text-secondary dark:text-text-dark-secondary">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Post tasks with credit point rewards</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Review and evaluate student submissions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Award credits for quality work</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Reassign tasks if not satisfied</span>
                </li>
              </ul>
            </div>

            {/* Student Card */}
            <div className="card p-8 border-2 border-gray-300 dark:border-gray-600">
              <div className="badge-student inline-block mb-4">Student</div>
              <h3 className="text-2xl font-bold text-text-primary dark:text-text-dark mb-4">
                For Students
              </h3>
              <ul className="space-y-3 text-text-secondary dark:text-text-dark-secondary">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Take teacher-posted tasks to earn credits</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Post tasks for peer collaboration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Build your skill profile and portfolio</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-mits-green flex-shrink-0 mt-0.5" />
                  <span>Climb the leaderboard rankings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-mits-blue dark:bg-mits-blue-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Zap className="w-12 h-12 text-mits-orange mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Showcase Your Skills?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Join MITS CampusSkill today and start your journey towards skill
            recognition and rewards.
          </p>
          {!isAuthenticated ? (
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-mits-orange text-white font-semibold rounded-lg hover:bg-mits-orange-light transition-colors"
            >
              Create Your Account
              <ArrowRight className="ml-2" size={20} />
            </Link>
          ) : (
            <Link
              to="/browse"
              className="inline-flex items-center px-8 py-3 bg-mits-orange text-white font-semibold rounded-lg hover:bg-mits-orange-light transition-colors"
            >
              Start Browsing Tasks
              <ArrowRight className="ml-2" size={20} />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
