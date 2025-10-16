import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

const ImageUploader = ({ 
  value, 
  onChange, 
  error, 
  helperText, 
  label = "Upload Image",
  previewHeight = 200,
  previewWidth = 300,
  multiple = false
}) => {
  const [preview, setPreview] = useState('');
  const [previews, setPreviews] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  // Update preview when value changes
  useEffect(() => {
    if (multiple && Array.isArray(value)) {
      // Handle multiple files
      const newPreviews = value.map(file => {
        if (file instanceof File) {
          return URL.createObjectURL(file);
        } else if (typeof file === 'string' && file) {
          return file;
        }
        return null;
      }).filter(Boolean);
      
      setPreviews(newPreviews);
      setPreview(''); // Clear single preview
      
      // Cleanup function to revoke object URLs
      return () => {
        newPreviews.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      };
    } else if (value instanceof File) {
      // Handle single file
      const previewUrl = URL.createObjectURL(value);
      setPreview(previewUrl);
      setPreviews([]); // Clear multiple previews
      
      // Cleanup function to revoke object URL
      return () => {
        URL.revokeObjectURL(previewUrl);
      };
    } else if (typeof value === 'string' && value) {
      // Handle single URL
      setPreview(value);
      setPreviews([]); // Clear multiple previews
    } else {
      setPreview('');
      setPreviews([]);
    }
  }, [value, multiple]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setUploadError('Please select valid image files only');
      return;
    }

    setUploadError('');
    
    if (multiple) {
      // Handle multiple files
      onChange(files);
    } else {
      // Handle single file (existing behavior)
      const file = files[0];
      onChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    setPreviews([]);
    onChange(multiple ? [] : null);
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
        {/* Single Preview */}
        {preview && !multiple && (
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

        {/* Multiple Previews */}
        {multiple && previews.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {previews.map((previewUrl, index) => (
              <Box key={index} sx={{ position: 'relative', display: 'inline-block' }}>
                <Box
                  component="img"
                  src={previewUrl}
                  alt={`Preview ${index + 1}`}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'grey.300',
                  }}
                />
              </Box>
            ))}
            <Button
              size="small"
              color="error"
              onClick={handleRemoveImage}
              sx={{
                alignSelf: 'flex-start',
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
          startIcon={<UploadIcon />}
          onClick={handleButtonClick}
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
          {multiple 
            ? (previews.length > 0 ? `Change Images (${previews.length})` : 'Select Images') 
            : (preview ? 'Change Image' : 'Select Image')
          }
        </Button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
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
