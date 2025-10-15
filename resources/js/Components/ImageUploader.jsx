import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { router } from '@inertiajs/react';

const ImageUploader = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  label = "Upload Image",
  previewHeight = 200,
  previewWidth = 300 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file');
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('File size must be less than 2MB');
        return;
      }

      setUploadError('');
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/admin/destinations/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data.url);
        onChange(data.url);
      } else {
        setUploadError(data.message || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    onChange('');
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Preview */}
        {preview && (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: previewWidth,
                height: previewHeight,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300',
              }}
            />
            <Button
              size="small"
              color="error"
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                minWidth: 'auto',
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                },
              }}
            >
              ×
            </Button>
          </Box>
        )}

        {/* Upload Button */}
        <Button
          variant="outlined"
          component="label"
          startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          onClick={handleButtonClick}
          disabled={uploading}
          sx={{
            width: 'fit-content',
            borderStyle: 'dashed',
            borderWidth: 2,
            '&:hover': {
              borderStyle: 'dashed',
              borderWidth: 2,
            },
          }}
        >
          {uploading ? 'Uploading...' : preview ? 'Change Image' : 'Select Image'}
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Error messages */}
        {uploadError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {uploadError}
          </Alert>
        )}
        
        {error && (
          <Typography variant="caption" color="error">
            {helperText}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageUploader;
