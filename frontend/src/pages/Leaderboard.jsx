import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { Trophy, Medal, Award, Star, Users } from 'lucide-react';
import { PageLoading, Avatar } from '../components';
import { formatNumber } from '../utils/helpers';

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { role: filter } : {};
      const response = await userService.getLeaderboard({ ...params, limit: 50 });
      setUsers(response.users);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-text-secondary font-medium">
            {rank}
          </span>
        );
    }
  };

  const getRankBgColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 2:
        return 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700';
      case 3:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default:
        return '';
    }
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Trophy className="w-10 h-10 text-mits-orange" />
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary dark:text-text-dark">
            Leaderboard
          </h1>
        </div>
        <p className="text-text-secondary dark:text-text-dark-secondary">
          Top performers ranked by total points
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {[
            { id: 'all', label: 'All', icon: Users },
            { id: 'student', label: 'Students', icon: Award },
            { id: 'teacher', label: 'Teachers', icon: Star },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                filter === item.id
                  ? 'bg-white dark:bg-surface-dark shadow text-mits-blue'
                  : 'text-text-secondary hover:text-text-primary dark:hover:text-text-dark'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      {!loading && users.length >= 3 && (
        <div className="flex items-end justify-center space-x-4 mb-12">
          {/* Second place */}
          <div className="text-center">
            <Link to={`/user/${users[1]?._id}`}>
              <div className="relative mb-3">
                <Avatar
                  name={users[1]?.name}
                  src={users[1]?.avatar}
                  size="large"
                  className="ring-4 ring-gray-400"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <p className="font-semibold text-text-primary dark:text-text-dark truncate max-w-[100px]">
                {users[1]?.name}
              </p>
              <p className="text-mits-orange font-medium">
                {formatNumber(users[1]?.totalPoints)} pts
              </p>
            </Link>
            <div className="w-24 h-20 bg-gray-400 rounded-t-lg mt-2" />
          </div>

          {/* First place */}
          <div className="text-center">
            <Link to={`/user/${users[0]?._id}`}>
              <div className="relative mb-3">
                <Avatar
                  name={users[0]?.name}
                  src={users[0]?.avatar}
                  size="xl"
                  className="ring-4 ring-yellow-500"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                  <Trophy size={20} />
                </div>
              </div>
              <p className="font-semibold text-text-primary dark:text-text-dark text-lg truncate max-w-[120px]">
                {users[0]?.name}
              </p>
              <p className="text-mits-orange font-bold text-lg">
                {formatNumber(users[0]?.totalPoints)} pts
              </p>
            </Link>
            <div className="w-28 h-28 bg-yellow-500 rounded-t-lg mt-2" />
          </div>

          {/* Third place */}
          <div className="text-center">
            <Link to={`/user/${users[2]?._id}`}>
              <div className="relative mb-3">
                <Avatar
                  name={users[2]?.name}
                  src={users[2]?.avatar}
                  size="large"
                  className="ring-4 ring-amber-600"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <p className="font-semibold text-text-primary dark:text-text-dark truncate max-w-[100px]">
                {users[2]?.name}
              </p>
              <p className="text-mits-orange font-medium">
                {formatNumber(users[2]?.totalPoints)} pts
              </p>
            </Link>
            <div className="w-24 h-14 bg-amber-600 rounded-t-lg mt-2" />
          </div>
        </div>
      )}

      {/* Full List */}
      {loading ? (
        <PageLoading />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-text-dark-secondary">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-secondary dark:text-text-dark-secondary">
                    User
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-secondary dark:text-text-dark-secondary">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-secondary dark:text-text-dark-secondary">
                    Tasks
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-text-secondary dark:text-text-dark-secondary">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-text-secondary dark:text-text-dark-secondary">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((leaderUser) => (
                  <tr
                    key={leaderUser._id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${getRankBgColor(
                      leaderUser.rank
                    )}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getRankIcon(leaderUser.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/user/${leaderUser._id}`}
                        className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                      >
                        <Avatar name={leaderUser.name} src={leaderUser.avatar} />
                        <span className="font-medium text-text-primary dark:text-text-dark">
                          {leaderUser.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={
                          leaderUser.role === 'teacher'
                            ? 'badge-teacher'
                            : 'badge-student'
                        }
                      >
                        {leaderUser.role === 'teacher' ? 'T' : 'S'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-text-secondary dark:text-text-dark-secondary">
                      {leaderUser.tasksCompleted}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-text-primary dark:text-text-dark">
                          {leaderUser.averageRating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-mits-orange">
                        {formatNumber(leaderUser.totalPoints)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
