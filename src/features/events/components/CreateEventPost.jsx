import { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import { BiImage, BiX, BiSend } from 'react-icons/bi';

const CreateEventPost = ({ eventId, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quillRef = useRef(null);

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/*': []
    },
    noClick: true,
    noKeyboard: true,
    multiple: true,
    onDrop: acceptedFiles => {
      // Convert files to preview objects
      const newMedia = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video'
      }));
      setMedia(prev => [...prev, ...newMedia]);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log('Creating post with:', { eventId, content, media });
      
      // Reset form
      setContent('');
      setMedia([]);
      
      // Call the callback if provided
      if (onPostCreated) {
        onPostCreated({
          _id: `temp-${Date.now()}`,
          content,
          media: media.map(m => ({ url: m.preview, type: m.type })),
          createdAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          userDetails: {
            firstName: 'Current',
            lastName: 'User',
            avatar: 'https://via.placeholder.com/40?text=Me'
          }
        });
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <ReactQuill 
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Share updates, insights or questions about this event..."
            className="h-32"
          />
        </div>
        
        {media.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
            {media.map((file, index) => (
              <div key={index} className="relative group">
                <img 
                  src={file.preview} 
                  alt={`Upload preview ${index + 1}`} 
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <BiX size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex space-x-2">
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <button 
                type="button" 
                onClick={open}
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
              >
                <BiImage className="mr-1" />
                <span className="text-sm">Image</span>
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && media.length === 0)}
            className={`flex items-center px-4 py-1.5 rounded-full text-white ${
              isSubmitting || (!content.trim() && media.length === 0)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } transition-colors`}
          >
            <BiSend className="mr-1" size={16} />
            <span>Post</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPost; 