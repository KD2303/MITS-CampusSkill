import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import {
  User,
  Award,
  Star,
  CheckCircle,
  FileText,
  Edit,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { PageLoading, Avatar, TaskCard, StarRating, EmptyState } from '../components';
import { formatDate, formatNumber } from '../utils/helpers';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('completed');

  const isOwnProfile = !id || id === currentUser?._id;
  const profileId = isOwnProfile ? currentUser?._id : id;

  useEffect(() => {
    if (profileId) {
      loadProfile();
    }
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileResponse, tasksResponse] = await Promise.all([
        userService.getProfile(profileId),
        taskService.getTasksByUser(profileId, 'taken'),
      ]);
      setUser(profileResponse.user);
      setTasks(tasksResponse.tasks.filter((t) => t.status === 'completed'));
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!user) {
    return (
      <div className="page-container">
        <EmptyState
          title="User not found"
          description="The profile you're looking for doesn't exist."
          action={
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      {/* Profile Header */}
      <div className="card p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <Avatar name={user.name} src={user.avatar} size="xl" />

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-dark mb-2">
                  {user.name}
                </h1>
                <div className="flex items-center space-x-3 mb-4">
                  <span
                    className={
                      user.role === 'teacher' ? 'badge-teacher' : 'badge-student'
                    }
                  >
                    {user.role === 'teacher' ? 'Teacher' : 'Student'}
                  </span>
                  <span className="text-text-secondary dark:text-text-dark-secondary text-sm">
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
              {isOwnProfile && (
                <Link to="/profile/edit" className="btn-outline">
                  <Edit size={18} className="mr-2" />
                  Edit Profile
                </Link>
              )}
            </div>

            {user.bio && (
              <p className="text-text-secondary dark:text-text-dark-secondary mb-4">
                {user.bio}
              </p>
            )}

            {/* Skills */}
            {user.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {user.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Portfolio link */}
            {user.portfolio && (
              <a
                href={user.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-mits-blue hover:text-mits-blue-light"
              >
                <ExternalLink size={16} />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5 text-center">
          <Award className="w-8 h-8 text-mits-orange mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark">
            {formatNumber(user.totalPoints)}
          </p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
            Total Points
          </p>
        </div>
        <div className="card p-5 text-center">
          <CheckCircle className="w-8 h-8 text-mits-green mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark">
            {formatNumber(user.tasksCompleted)}
          </p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
            Tasks Completed
          </p>
        </div>
        <div className="card p-5 text-center">
          <FileText className="w-8 h-8 text-mits-blue mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark">
            {formatNumber(user.tasksPosted)}
          </p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
            Tasks Posted
          </p>
        </div>
        <div className="card p-5 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-text-primary dark:text-text-dark">
            {user.averageRating?.toFixed(1) || '0.0'}
          </p>
          <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
            Average Rating
          </p>
        </div>
      </div>

      {/* Recent Ratings */}
      {user.ratings?.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark mb-4">
            Recent Ratings
          </h2>
          <div className="space-y-4">
            {user.ratings.slice(0, 5).map((rating, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <StarRating rating={rating.rating} readonly size="small" />
                  {rating.review && (
                    <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
                      {rating.review}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
                    {formatDate(rating.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-text-primary dark:text-text-dark">
            Completed Tasks ({tasks.length})
          </h2>
        </div>
        <div className="p-6">
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No completed tasks yet"
              description={
                isOwnProfile
                  ? 'Start taking tasks to build your portfolio!'
                  : 'This user has not completed any tasks yet.'
              }
              action={
                isOwnProfile && (
                  <Link to="/browse" className="btn-primary">
                    Browse Tasks
                  </Link>
                )
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
