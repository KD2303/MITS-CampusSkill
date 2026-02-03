import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { Avatar, ButtonLoading } from '../components';
import { SKILLS } from '../utils/constants';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    portfolio: user?.portfolio || '',
    skills: user?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await userService.updateProfile(formData);
      updateUser(response.user);
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-dark">
            Edit Profile
          </h1>
          <div className="w-20" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {/* Avatar preview */}
          <div className="flex justify-center">
            <Avatar name={formData.name || user?.name} size="xl" />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="label">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Your full name"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="label">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-xs text-text-secondary dark:text-text-dark-secondary mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Portfolio */}
          <div>
            <label htmlFor="portfolio" className="label">
              Portfolio URL
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="input"
              placeholder="https://yourportfolio.com"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="label">Skills</label>
            
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
                disabled={!newSkill}
                className="btn-outline px-4"
              >
                <Plus size={20} />
              </button>
            </div>
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
                  <Save size={18} className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
