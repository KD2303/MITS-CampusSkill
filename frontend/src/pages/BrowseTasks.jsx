import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { taskService } from '../services/taskService';
import { TaskCard, PageLoading, EmptyState } from '../components';
import { SKILLS } from '../utils/constants';

const BrowseTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    posterRole: '',
    skill: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    loadTasks();
  }, [filters, pagination.page]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };
      const response = await taskService.getTasks(params);
      setTasks(response.tasks);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      posterRole: '',
      skill: '',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary dark:text-text-dark mb-2">
          Browse Tasks
        </h1>
        <p className="text-text-secondary dark:text-text-dark-secondary">
          Find tasks that match your skills and interests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline flex items-center space-x-2 ${
              hasActiveFilters ? 'border-mits-blue text-mits-blue' : ''
            }`}
          >
            <Filter size={20} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-mits-blue text-white rounded-full text-xs flex items-center justify-center">
                {Object.values(filters).filter((v) => v !== '').length}
              </span>
            )}
          </button>
        </div>

        {/* Filter options */}
        {showFilters && (
          <div className="card p-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status filter */}
              <div>
                <label className="label">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="input"
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="completed">Completed</option>
                  <option value="reassigned">Reassigned</option>
                </select>
              </div>

              {/* Poster role filter */}
              <div>
                <label className="label">Posted By</label>
                <select
                  value={filters.posterRole}
                  onChange={(e) => handleFilterChange('posterRole', e.target.value)}
                  className="input"
                >
                  <option value="">All</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>

              {/* Skill filter */}
              <div>
                <label className="label">Skill</label>
                <select
                  value={filters.skill}
                  onChange={(e) => handleFilterChange('skill', e.target.value)}
                  className="input"
                >
                  <option value="">All Skills</option>
                  {SKILLS.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-mits-blue hover:text-mits-blue-light flex items-center space-x-1"
                >
                  <X size={16} />
                  <span>Clear all filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mb-4 text-text-secondary dark:text-text-dark-secondary">
        {pagination.total} task{pagination.total !== 1 ? 's' : ''} found
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <PageLoading />
      ) : tasks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="btn-outline px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center px-4 text-text-secondary dark:text-text-dark-secondary">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="btn-outline px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No tasks found"
          description={
            hasActiveFilters
              ? 'Try adjusting your filters to find more tasks.'
              : 'Be the first to post a task!'
          }
          action={
            <Link to="/post-task" className="btn-primary">
              Post a Task
            </Link>
          }
        />
      )}
    </div>
  );
};

export default BrowseTasks;
