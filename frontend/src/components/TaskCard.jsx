import { Link } from 'react-router-dom';
import { Calendar, User, Award, Clock } from 'lucide-react';
import { getStatusColor, getStatusLabel, formatDate, getDaysUntil, truncateText } from '../utils/helpers';

const TaskCard = ({ task }) => {
  const daysUntil = getDaysUntil(task.deadline);
  const isOverdue = daysUntil !== null && daysUntil < 0;

  return (
    <Link to={`/tasks/${task._id}`}>
      <div className="card p-5 h-full flex flex-col transition-all duration-200 hover:translate-y-[-2px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={task.posterRole === 'teacher' ? 'badge-teacher' : 'badge-student'}>
              {task.posterRole === 'teacher' ? 'T' : 'S'}
            </span>
            <span className={getStatusColor(task.status)}>
              {getStatusLabel(task.status)}
            </span>
          </div>
          {task.creditPoints > 0 && (
            <div className="flex items-center space-x-1 text-mits-orange font-semibold">
              <Award size={16} />
              <span>{task.creditPoints} credits</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-dark mb-2 line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-text-secondary dark:text-text-dark-secondary text-sm mb-4 line-clamp-2 flex-grow">
          {truncateText(task.description, 120)}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {task.skills?.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag text-xs">
              {skill}
            </span>
          ))}
          {task.skills?.length > 3 && (
            <span className="skill-tag text-xs">+{task.skills.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-text-secondary dark:text-text-dark-secondary border-t border-gray-100 dark:border-gray-700 pt-3 mt-auto">
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span>{task.postedBy?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-1">
            {isOverdue ? (
              <span className="text-red-500 flex items-center space-x-1">
                <Clock size={14} />
                <span>Overdue</span>
              </span>
            ) : (
              <>
                <Calendar size={14} />
                <span>{formatDate(task.deadline)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
