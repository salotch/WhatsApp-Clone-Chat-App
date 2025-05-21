import axios from "axios";

const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat_app_upload");
  formData.append("cloud_name", "dxvromdzx");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dxvromdzx/image/upload",
      formData
    );
    console.log(response.data.secure_url);
    return response.data.secure_url; // This is the image URL
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Image upload failed.");
  }
};

export default upload;
