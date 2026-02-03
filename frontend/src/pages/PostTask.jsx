import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import { ArrowLeft, PlusCircle, X, Plus, Info } from 'lucide-react';
import { ButtonLoading, Alert } from '../components';
import { SKILLS } from '../utils/constants';
import toast from 'react-hot-toast';

const PostTask = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    creditPoints: 20,
    deadline: '',
  });
  const [errors, setErrors] = useState({});
  const [newSkill, setNewSkill] = useState('');

  const isTeacher = user?.role === 'teacher';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSkill = (skill) => {
    if (skill && !formData.skills.includes(skill) && formData.skills.length < 5) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    if (isTeacher && (formData.creditPoints < 1 || formData.creditPoints > 100)) {
      newErrors.creditPoints = 'Credits must be between 1 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const taskData = {
        ...formData,
        creditPoints: isTeacher ? formData.creditPoints : 0,
      };
      const response = await taskService.createTask(taskData);
      toast.success('Task posted successfully!');
      navigate(`/tasks/${response.task._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post task');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-text-secondary dark:text-text-dark-secondary hover:text-mits-blue"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark flex items-center space-x-2">
            <PlusCircle className="text-mits-blue" />
            <span>Post a Task</span>
          </h1>
          <div className="w-20" />
        </div>

        {/* Info alert for students */}
        {!isTeacher && (
          <Alert
            type="info"
            message="As a student, you can post tasks for peer collaboration. Note: Student tasks don't award credit points."
            className="mb-6"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`input ${errors.title ? 'input-error' : ''}`}
              placeholder="e.g., Build a React Dashboard Component"
              maxLength={100}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`input ${errors.description ? 'input-error' : ''}`}
              placeholder="Describe the task in detail. Include requirements, expected deliverables, and any resources that might help..."
              maxLength={2000}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-500">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-text-secondary dark:text-text-dark-secondary">
                {formData.description.length}/2000
              </span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="label">Required Skills * (max 5)</label>

            {/* Current skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="skill-tag flex items-center space-x-1"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill */}
            <div className="flex space-x-2">
              <select
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="input flex-1"
                disabled={formData.skills.length >= 5}
              >
                <option value="">Select a skill</option>
                {SKILLS.filter((s) => !formData.skills.includes(s)).map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAddSkill(newSkill)}
                disabled={!newSkill || formData.skills.length >= 5}
                className="btn-outline px-4"
              >
                <Plus size={20} />
              </button>
            </div>
            {errors.skills && (
              <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
            )}
          </div>

          {/* Credit Points (Teachers only) */}
          {isTeacher && (
            <div>
              <label htmlFor="creditPoints" className="label">
                Credit Points *
              </label>
              <input
                type="number"
                id="creditPoints"
                name="creditPoints"
                value={formData.creditPoints}
                onChange={handleChange}
                min={1}
                max={100}
                className={`input ${errors.creditPoints ? 'input-error' : ''}`}
              />
              <p className="mt-1 text-sm text-text-secondary dark:text-text-dark-secondary flex items-center space-x-1">
                <Info size={14} />
                <span>Credits awarded to student upon task completion</span>
              </p>
              {errors.creditPoints && (
                <p className="mt-1 text-sm text-red-500">{errors.creditPoints}</p>
              )}
            </div>
          )}

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="label">
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              min={getMinDate()}
              className={`input ${errors.deadline ? 'input-error' : ''}`}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">{errors.deadline}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium text-text-primary dark:text-text-dark mb-2">
              Task Summary
            </h3>
            <ul className="text-sm text-text-secondary dark:text-text-dark-secondary space-y-1">
              <li>
                • Posted as: <strong>{user?.role === 'teacher' ? 'Teacher' : 'Student'}</strong>
              </li>
              <li>
                • Credit points: <strong>{isTeacher ? formData.creditPoints : 0}</strong>
              </li>
              <li>
                • Skills required: <strong>{formData.skills.length || 0}</strong>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <ButtonLoading />
              ) : (
                <>
                  <PlusCircle size={18} className="mr-2" />
                  Post Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTask;
