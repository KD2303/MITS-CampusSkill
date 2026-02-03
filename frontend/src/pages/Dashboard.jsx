import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import {
  LayoutDashboard,
  Award,
  Star,
  CheckCircle,
  FileText,
  PlusCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { PageLoading, TaskCard, EmptyState } from '../components';
import { formatNumber } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState({ posted: [], taken: [] });
  const [activeTab, setActiveTab] = useState('posted');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, tasksResponse] = await Promise.all([
        userService.getStats(),
        taskService.getMyTasks(),
      ]);
      setStats(statsResponse.stats);
      setTasks({
        posted: tasksResponse.postedTasks,
        taken: tasksResponse.takenTasks,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  const statCards = [
    {
      title: 'Total Points',
      value: formatNumber(stats?.totalPoints || 0),
      icon: TrendingUp,
      color: 'text-mits-blue',
      bgColor: 'bg-mits-blue/10',
    },
    {
      title: 'Credit Points',
      value: formatNumber(stats?.creditPoints || 0),
      icon: Award,
      color: 'text-mits-orange',
      bgColor: 'bg-mits-orange/10',
    },
    {
      title: 'Tasks Completed',
      value: formatNumber(stats?.tasksCompleted || 0),
      icon: CheckCircle,
      color: 'text-mits-green',
      bgColor: 'bg-mits-green/10',
    },
    {
      title: 'Average Rating',
      value: stats?.averageRating?.toFixed(1) || '0.0',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
  ];

  const tabs = [
    {
      id: 'posted',
      label: 'Tasks Posted',
      count: tasks.posted.length,
    },
    {
      id: 'taken',
      label: 'Tasks Taken',
      count: tasks.taken.length,
    },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <LayoutDashboard className="w-8 h-8 text-mits-blue" />
          <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark">
            Dashboard
          </h1>
        </div>
        <p className="text-text-secondary dark:text-text-dark-secondary">
          Welcome back, {user?.name}! Here's your overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.title === 'Total Points' && stats?.rank && (
                <span className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  Rank #{stats.rank}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-text-primary dark:text-text-dark">
              {stat.value}
            </p>
            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          to="/post-task"
          className="card p-5 flex items-center justify-between hover:border-mits-blue border-2 border-transparent transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-mits-blue/10 rounded-lg">
              <PlusCircle className="w-6 h-6 text-mits-blue" />
            </div>
            <div>
              <p className="font-semibold text-text-primary dark:text-text-dark">
                Post a New Task
              </p>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Create a task for students
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-text-secondary" />
        </Link>

        <Link
          to="/browse"
          className="card p-5 flex items-center justify-between hover:border-mits-orange border-2 border-transparent transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-mits-orange/10 rounded-lg">
              <FileText className="w-6 h-6 text-mits-orange" />
            </div>
            <div>
              <p className="font-semibold text-text-primary dark:text-text-dark">
                Browse Tasks
              </p>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Find tasks to work on
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-text-secondary" />
        </Link>
      </div>

      {/* Tasks Section */}
      <div className="card">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-mits-blue'
                    : 'text-text-secondary hover:text-text-primary dark:hover:text-text-dark'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700">
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-mits-blue" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="p-6">
          {activeTab === 'posted' && (
            <>
              {tasks.posted.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.posted.slice(0, 6).map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tasks posted yet"
                  description="Start by posting a task for students to work on."
                  action={
                    <Link to="/post-task" className="btn-primary">
                      Post a Task
                    </Link>
                  }
                />
              )}
            </>
          )}

          {activeTab === 'taken' && (
            <>
              {tasks.taken.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.taken.slice(0, 6).map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No tasks taken yet"
                  description="Browse available tasks and start earning credits!"
                  action={
                    <Link to="/browse" className="btn-primary">
                      Browse Tasks
                    </Link>
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
