import { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import { createGroup } from '../services/groupService';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'public',
    skills: [],
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill();
    }
  };
  
  const addSkill = () => {
    if (!skillInput.trim()) return;
    
    // Check if already at max skills
    if (formData.skills.length >= 10) {
      setErrors(prev => ({ ...prev, skills: 'Maximum 10 skills allowed' }));
      return;
    }
    
    // Check if skill already exists
    if (formData.skills.includes(skillInput.trim())) {
      setErrors(prev => ({ ...prev, skills: 'Skill already added' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()]
    }));
    
    setSkillInput('');
    setErrors(prev => ({ ...prev, skills: '' }));
  };
  
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };
  
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    
    if (!validImageTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        [type]: 'Invalid file type. Please upload an image (JPEG, PNG, JPG, GIF)' 
      }));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      setErrors(prev => ({ 
        ...prev, 
        [type]: 'File size exceeds 5MB limit' 
      }));
      return;
    }
    
    // Preview file
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'avatar') {
        setAvatarFile(file);
        setAvatarPreview(reader.result);
        setErrors(prev => ({ ...prev, avatar: '' }));
      } else {
        setCoverFile(file);
        setCoverPreview(reader.result);
        setErrors(prev => ({ ...prev, cover: '' }));
      }
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = (type) => {
    if (type === 'avatar') {
      setAvatarFile(null);
      setAvatarPreview('');
    } else {
      setCoverFile(null);
      setCoverPreview('');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Group name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    if (formData.skills.length === 0) {
      newErrors.skills = 'At least one skill/tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const groupDataToSubmit = {
        ...formData,
        isPrivate: formData.visibility === 'private',
        avatar: avatarFile,
        coverImage: coverFile
      };
      
      const response = await createGroup(groupDataToSubmit);
      
      toast.success('Group created successfully!');
      
      if (onGroupCreated) {
        onGroupCreated(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-[51]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        </Transition.Child>
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <Dialog.Title className="text-xl font-semibold">Create New Group</Dialog.Title>
                <button 
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                {/* Group Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter group name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What is this group about?"
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
                
                {/* Group Privacy */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Privacy
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={formData.visibility === 'public'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Public</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={formData.visibility === 'private'}
                        onChange={handleChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">Private</span>
                    </label>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.visibility === 'private'
                      ? 'Private groups require admin approval to join' 
                      : 'Anyone can join public groups'}
                  </p>
                </div>
                
                {/* Skills/Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills/Tags *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Add a skill or tag"
                      className={`w-full px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 ${
                        errors.skills ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
                  )}
                  {formData.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1.5 text-blue-700 hover:text-blue-900"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Add up to 10 skills or interests related to your group
                  </p>
                </div>
                
                {/* Group Avatar */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Avatar (optional)
                  </label>
                  <div className="flex items-center">
                    {avatarPreview ? (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4">
                        <img 
                          src={avatarPreview} 
                          alt="Avatar preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage('avatar')}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '32px' }}>group</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'avatar')}
                        className="hidden"
                      />
                      <label
                        htmlFor="avatar"
                        className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                      </label>
                      {errors.avatar && (
                        <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Max size: 5MB</p>
                    </div>
                  </div>
                </div>
                
                {/* Group Cover */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image (optional)
                  </label>
                  {coverPreview ? (
                    <div className="relative mb-3">
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('cover')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '48px' }}>panorama</span>
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="cover"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'cover')}
                      className="hidden"
                    />
                    <label
                      htmlFor="cover"
                      className="inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      {coverPreview ? 'Change Cover' : 'Upload Cover'}
                    </label>
                    {errors.cover && (
                      <p className="mt-1 text-sm text-red-500">{errors.cover}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Max size: 5MB. Recommended ratio 3:1</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Group'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

CreateGroupModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGroupCreated: PropTypes.func
};

export default CreateGroupModal; 