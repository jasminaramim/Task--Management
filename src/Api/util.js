import axios from 'axios';

export const imageUpload = async (imageData) => {
  console.log('Image Data:', imageData);  // Log image data for inspection

  const formData = new FormData();
  formData.append('image', imageData);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      formData
    );
    console.log('Upload successful:', response.data);
    return response.data.data.display_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Image upload failed:', error.response ? error.response.data : error.message);
  }
}
