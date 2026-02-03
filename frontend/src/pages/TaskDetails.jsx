import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Award,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import {
  PageLoading,
  Avatar,
  Alert,
  Modal,
  StarRating,
  ChatWindow,
  ButtonLoading,
} from '../components';
import {
  getStatusColor,
  getStatusLabel,
  formatDate,
  formatDateTime,
  getDaysUntil,
  isOverdue,
} from '../utils/helpers';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [submitContent, setSubmitContent] = useState('');
  const [reviewData, setReviewData] = useState({
    satisfied: true,
    feedback: '',
    rating: 5,
  });
  const [reassignReason, setReassignReason] = useState('');

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const response = await taskService.getTask(id);
      setTask(response.task);
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleTakeTask = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to take this task');
      navigate('/login');
      return;
    }

    try {
      setActionLoading(true);
      await taskService.takeTask(id);
      toast.success('Task taken successfully!');
      loadTask();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to take task');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitTask = async () => {
    if (!submitContent.trim()) {
      toast.error('Please provide submission details');
      return;
    }

    try {
      setActionLoading(true);
      await taskService.submitTask(id, submitContent);
      toast.success('Work submitted successfully!');
      setShowSubmitModal(false);
      setSubmitContent('');
      loadTask();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit work');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReviewTask = async () => {
    try {
      setActionLoading(true);
      await taskService.reviewTask(id, reviewData);
      toast.success(
        reviewData.satisfied ? 'Task completed! Credits awarded.' : 'Review submitted'
      );
      setShowReviewModal(false);
      loadTask();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReassignTask = async () => {
    try {
      setActionLoading(true);
      await taskService.reassignTask(id, reassignReason);
      toast.success('Task reassigned successfully');
      setShowReassignModal(false);
      setReassignReason('');
      loadTask();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reassign task');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  if (!task) {
    return (
      <div className="page-container">
        <Alert type="error" message="Task not found" />
        <Link to="/browse" className="btn-primary mt-4">
          Back to Browse
        </Link>
      </div>
    );
  }

  const isTaskPoster = user?._id === task.postedBy?._id;
  const isTaskTaker = user?._id === task.takenBy?._id;
  const canTakeTask =
    isAuthenticated &&
    user?.role === 'student' &&
    !isTaskPoster &&
    (task.status === 'open' || task.status === 'reassigned');
  const canSubmit = isTaskTaker && task.status === 'in_progress';
  const canReview = isTaskPoster && task.status === 'submitted';
  const canReassign =
    isTaskPoster && ['in_progress', 'submitted'].includes(task.status);
  const showChat =
    isAuthenticated &&
    (isTaskPoster || isTaskTaker) &&
    task.chatRoom &&
    ['in_progress', 'submitted', 'completed'].includes(task.status);

  const daysUntil = getDaysUntil(task.deadline);
  const taskOverdue = isOverdue(task.deadline);

  return (
    <div className="page-container animate-fade-in">
      {/* Back button */}
      <Link
        to="/browse"
        className="inline-flex items-center space-x-2 text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Browse</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task header */}
          <div className="card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex items-center space-x-3">
                <span
                  className={
                    task.posterRole === 'teacher' ? 'badge-teacher' : 'badge-student'
                  }
                >
                  {task.posterRole === 'teacher' ? 'Teacher' : 'Student'}
                </span>
                <span className={getStatusColor(task.status)}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
              {task.creditPoints > 0 && (
                <div className="flex items-center space-x-2 text-mits-orange font-semibold text-lg">
                  <Award size={24} />
                  <span>{task.creditPoints} credits</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-dark mb-4">
              {task.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {task.skills?.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>

            <p className="text-text-secondary dark:text-text-dark-secondary whitespace-pre-wrap">
              {task.description}
            </p>
          </div>

          {/* Submission section */}
          {task.submission?.content && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark mb-4 flex items-center space-x-2">
                <CheckCircle className="text-mits-green" size={20} />
                <span>Submission</span>
              </h2>
              <p className="text-text-secondary dark:text-text-dark-secondary whitespace-pre-wrap mb-2">
                {task.submission.content}
              </p>
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                Submitted on {formatDateTime(task.submission.submittedAt)}
              </p>
            </div>
          )}

          {/* Review section */}
          {task.review?.reviewedAt && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark mb-4 flex items-center space-x-2">
                {task.review.satisfied ? (
                  <CheckCircle className="text-mits-green" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span>Review</span>
              </h2>
              <div className="space-y-2">
                <p
                  className={`font-medium ${
                    task.review.satisfied ? 'text-mits-green' : 'text-red-500'
                  }`}
                >
                  {task.review.satisfied ? 'Satisfied' : 'Not Satisfied'}
                </p>
                {task.review.feedback && (
                  <p className="text-text-secondary dark:text-text-dark-secondary">
                    {task.review.feedback}
                  </p>
                )}
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                  Reviewed on {formatDateTime(task.review.reviewedAt)}
                </p>
              </div>
            </div>
          )}

          {/* Chat section */}
          {showChat && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-text-primary dark:text-text-dark mb-4 flex items-center space-x-2">
                <MessageSquare className="text-mits-blue" size={20} />
                <span>Chat</span>
              </h2>
              <ChatWindow taskId={task._id} chatRoomId={task.chatRoom?._id || task.chatRoom} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Posted by */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-3">
              Posted by
            </h3>
            <Link
              to={`/user/${task.postedBy?._id}`}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <Avatar name={task.postedBy?.name} size="large" />
              <div>
                <p className="font-medium text-text-primary dark:text-text-dark">
                  {task.postedBy?.name}
                </p>
                <span
                  className={
                    task.postedBy?.role === 'teacher'
                      ? 'badge-teacher'
                      : 'badge-student'
                  }
                >
                  {task.postedBy?.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </div>
            </Link>
          </div>

          {/* Taken by */}
          {task.takenBy && (
            <div className="card p-6">
              <h3 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-3">
                Taken by
              </h3>
              <Link
                to={`/user/${task.takenBy?._id}`}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <Avatar name={task.takenBy?.name} size="large" />
                <div>
                  <p className="font-medium text-text-primary dark:text-text-dark">
                    {task.takenBy?.name}
                  </p>
                  <span className="badge-student">Student</span>
                </div>
              </Link>
            </div>
          )}

          {/* Deadline */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-3">
              Deadline
            </h3>
            <div className="flex items-center space-x-2">
              <Calendar
                className={taskOverdue ? 'text-red-500' : 'text-mits-blue'}
                size={20}
              />
              <span
                className={`font-medium ${
                  taskOverdue
                    ? 'text-red-500'
                    : 'text-text-primary dark:text-text-dark'
                }`}
              >
                {formatDate(task.deadline)}
              </span>
            </div>
            {!taskOverdue && daysUntil !== null && (
              <p className="text-sm text-text-secondary dark:text-text-dark-secondary mt-1">
                {daysUntil === 0
                  ? 'Due today'
                  : daysUntil === 1
                  ? 'Due tomorrow'
                  : `${daysUntil} days left`}
              </p>
            )}
            {taskOverdue && (
              <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
                <AlertCircle size={14} />
                <span>Overdue</span>
              </p>
            )}
          </div>

          {/* Created */}
          <div className="card p-6">
            <h3 className="text-sm font-medium text-text-secondary dark:text-text-dark-secondary mb-3">
              Created
            </h3>
            <div className="flex items-center space-x-2">
              <Clock className="text-text-secondary" size={20} />
              <span className="text-text-primary dark:text-text-dark">
                {formatDate(task.createdAt)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="card p-6 space-y-3">
            {canTakeTask && (
              <button
                onClick={handleTakeTask}
                disabled={actionLoading}
                className="btn-primary w-full"
              >
                {actionLoading ? <ButtonLoading /> : 'Take This Task'}
              </button>
            )}

            {canSubmit && (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn-success w-full"
              >
                Submit Work
              </button>
            )}

            {canReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-primary w-full"
              >
                Review Submission
              </button>
            )}

            {canReassign && (
              <button
                onClick={() => setShowReassignModal(true)}
                className="btn-outline w-full text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                <RotateCcw size={18} className="mr-2" />
                Reassign Task
              </button>
            )}

            {!isAuthenticated && (
              <Link to="/login" className="btn-primary w-full block text-center">
                Login to Take Task
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Your Work"
        size="large"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Describe your work</label>
            <textarea
              value={submitContent}
              onChange={(e) => setSubmitContent(e.target.value)}
              rows={6}
              className="input"
              placeholder="Describe what you've done, any links to your work, notes for the reviewer..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitTask}
              disabled={actionLoading}
              className="btn-success"
            >
              {actionLoading ? <ButtonLoading /> : 'Submit Work'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Review Submission"
        size="large"
      >
        <div className="space-y-4">
          <div>
            <label className="label">Are you satisfied with this work?</label>
            <div className="flex space-x-4">
              <button
                onClick={() =>
                  setReviewData((prev) => ({ ...prev, satisfied: true }))
                }
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  reviewData.satisfied
                    ? 'border-mits-green bg-mits-green/10 text-mits-green'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <CheckCircle className="mx-auto mb-1" size={24} />
                <span>Satisfied</span>
              </button>
              <button
                onClick={() =>
                  setReviewData((prev) => ({ ...prev, satisfied: false }))
                }
                className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                  !reviewData.satisfied
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <XCircle className="mx-auto mb-1" size={24} />
                <span>Not Satisfied</span>
              </button>
            </div>
          </div>

          {reviewData.satisfied && (
            <div>
              <label className="label">Rate the work</label>
              <StarRating
                rating={reviewData.rating}
                onRate={(rating) =>
                  setReviewData((prev) => ({ ...prev, rating }))
                }
                size="large"
              />
            </div>
          )}

          <div>
            <label className="label">Feedback</label>
            <textarea
              value={reviewData.feedback}
              onChange={(e) =>
                setReviewData((prev) => ({ ...prev, feedback: e.target.value }))
              }
              rows={4}
              className="input"
              placeholder="Provide feedback for the student..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReviewModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleReviewTask}
              disabled={actionLoading}
              className={reviewData.satisfied ? 'btn-success' : 'btn-primary'}
            >
              {actionLoading ? (
                <ButtonLoading />
              ) : reviewData.satisfied ? (
                'Complete & Award Credits'
              ) : (
                'Submit Review'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reassign Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => setShowReassignModal(false)}
        title="Reassign Task"
      >
        <div className="space-y-4">
          <Alert
            type="warning"
            message="This will remove the current assignee and make the task available again."
          />
          <div>
            <label className="label">Reason for reassignment</label>
            <textarea
              value={reassignReason}
              onChange={(e) => setReassignReason(e.target.value)}
              rows={3}
              className="input"
              placeholder="Why are you reassigning this task?"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowReassignModal(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={handleReassignTask}
              disabled={actionLoading}
              className="btn-primary bg-red-500 hover:bg-red-600"
            >
              {actionLoading ? <ButtonLoading /> : 'Reassign Task'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskDetails;
