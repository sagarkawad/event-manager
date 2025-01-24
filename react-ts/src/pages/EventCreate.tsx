import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, uploadImage } from "../lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";
import CloudinaryUploadWidget from "../components/CloudinaryUploadWidget";

export default function EventCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    category: "",
    imageFile: null, // Field to hold the selected file
  });
  // Configuration
  const cloudName = import.meta.env.CLOUD_NAME;
  const uploadPreset = import.meta.env.CLOUDINARY_API_EV;

  // State
  const [publicId, setPublicId] = useState("");

  // Cloudinary configuration
  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });

  // Upload Widget Configuration
  const uwConfig = {
    cloudName,
    uploadPreset,
    // Uncomment and modify as needed:
    // cropping: true,
    // showAdvancedOptions: true,
    // sources: ['local', 'url'],
    // multiple: false,
    // folder: 'user_images',
    // tags: ['users', 'profile'],
    // context: { alt: 'user_uploaded' },
    // clientAllowedFormats: ['images'],
    // maxImageFileSize: 2000000,
    // maxImageWidth: 2000,
    // theme: 'purple',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create an event");
      return;
    }

    setLoading(true);

    try {
      if (formData.imageFile) {
        const formDataToUpload = new FormData();
        formDataToUpload.append("image", formData.imageFile);
        console.log("img - ", formData.imageFile);
      }

      const { img } = await uploadImage({
        image:
          "https://i.pinimg.com/736x/ad/0d/7f/ad0d7f09d8d50ca8c6a5222a1844473e.jpg",
      });

      await createEvent({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        startTime: formData.startTime,
        endTime: formData.endTime,
        category: formData.category,
        image: img, // Pass the uploaded image URL
      });

      toast.success("Event created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imageFile: file }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Event Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="startTime"
              className="block text-sm font-medium text-gray-700"
            >
              Start Time
            </label>
            <input
              type="datetime-local"
              id="startTime"
              name="startTime"
              required
              value={formData.startTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="endTime"
              className="block text-sm font-medium text-gray-700"
            >
              End Time
            </label>
            <input
              type="datetime-local"
              id="endTime"
              name="endTime"
              required
              value={formData.endTime}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-gray-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
