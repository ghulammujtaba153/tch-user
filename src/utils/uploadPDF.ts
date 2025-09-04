import axios from "axios";

const uploadFile = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "crowdfunding");

  // Decide resource_type based on file type
  let resourceType = "auto"; // default
  if (file.type === "application/pdf") {
    resourceType = "raw"; // use raw for PDF
  } else if (file.type.startsWith("image/")) {
    resourceType = "image"; // keep image type for JPG/PNG
  }

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dzxeejcgl/${resourceType}/upload`,
      data
    );

    const { secure_url } = res.data;
    return secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};

export default uploadFile;
