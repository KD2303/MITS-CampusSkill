import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, GraduationCap, BookOpen } from 'lucide-react';
import { ButtonLoading } from '../components/Loading';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-dark">
      <div className="max-w-md w-full">
        <div className="card shadow-glow border-brand-orange/10 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-orange/20">
              <UserPlus className="w-8 h-8 text-brand-orange" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-brand-text-secondary mt-2">
              Join CampusSkill and start collaborating
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-text-secondary mb-2 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-orange text-brand-text-muted">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input pl-12 ${errors.name ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-400 ml-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-orange text-brand-text-muted">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input pl-12 ${errors.email ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                  placeholder="you@mits.ac.in"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-400 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary mb-3 ml-1">Select Your Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, role: 'teacher' }));
                    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    formData.role === 'teacher'
                      ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                      : 'border-brand-border bg-brand-surface/50 text-brand-text-muted hover:border-brand-orange/50 hover:text-brand-text-secondary'
                  }`}
                >
                  <BookOpen
                    className="w-6 h-6"
                  />
                  <p className="font-bold text-sm uppercase tracking-wider">
                    Teacher
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, role: 'student' }));
                    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    formData.role === 'student'
                      ? 'border-brand-orange bg-brand-orange/5 text-brand-orange'
                      : 'border-brand-border bg-brand-surface/50 text-brand-text-muted hover:border-brand-orange/50 hover:text-brand-text-secondary'
                  }`}
                >
                  <GraduationCap
                    className="w-6 h-6"
                  />
                  <p className="font-bold text-sm uppercase tracking-wider">
                    Student
                  </p>
                </button>
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs font-medium text-red-400 ml-1">{errors.role}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-text-secondary mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-orange text-brand-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input pl-12 pr-10 ${errors.password ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-text-muted hover:text-brand-orange transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-400 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-text-secondary mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-brand-orange text-brand-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input pl-12 ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500/50' : ''}`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-400 ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 font-bold shadow-glow"
            >
              {loading ? <ButtonLoading /> : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center pt-6 border-t border-brand-border/50">
            <p className="text-brand-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brand-orange font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
