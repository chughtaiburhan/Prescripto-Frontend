import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../component/context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, userProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(userData?.image || assets.profile_pic);
    }
  }, [image, userData?.image]);

  const updateUserProfileData = async () => {
    if (!userData) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userData._id);
      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append("dob", userData.dob || "");
      formData.append("gender", userData.gender || "Male");
      formData.append("address", JSON.stringify(userData.address || {}));
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/user/update-profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (data.success) {
        toast.success("Profile updated successfully");
        await userProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  if (!userData) return null;

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {/* Profile Image Upload */}
      <label htmlFor="image">
        <div className="inline-block relative cursor-pointer">
          <img
            className="w-36 h-36 rounded-full object-cover opacity-80"
            src={previewUrl}
            alt="profile"
          />
          {isEdit && (
            <img
              className="w-10 absolute bottom-0 right-0"
              src={assets.upload_icon}
              alt="upload"
            />
          )}
        </div>
        {isEdit && (
          <input type="file" id="image" hidden onChange={handleImageChange} />
        )}
      </label>

      {/* Name */}
      {isEdit ? (
        <input
          type="text"
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
          value={userData.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userData.name}
        </p>
      )}

      <hr className="bg-zinc-400 h-[1px] border-none" />

      {/* Contact Info */}
      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 text-neutral-700">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-100 max-w-72"
              value={userData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          ) : (
            <p className="text-blue-400">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="flex flex-col gap-1">
              <input
                className="bg-gray-50"
                onChange={(e) => handleAddressChange("line1", e.target.value)}
                value={userData.address?.line1 || ""}
                type="text"
                placeholder="Address line 1"
              />
              <input
                className="bg-gray-50"
                onChange={(e) => handleAddressChange("line2", e.target.value)}
                value={userData.address?.line2 || ""}
                type="text"
                placeholder="Address line 2"
              />
            </div>
          ) : (
            <p className="text-gray-600">
              {userData.address?.line1}
              <br />
              {userData.address?.line2}
            </p>
          )}
        </div>

        {/* Basic Info */}
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-24 bg-gray-100"
              onChange={(e) => handleInputChange("gender", e.target.value)}
              value={userData.gender || "Male"}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-400">{userData.gender}</p>
          )}

          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              type="date"
              className="max-w-32 bg-gray-100"
              onChange={(e) => handleInputChange("dob", e.target.value)}
              value={userData.dob || ""}
            />
          ) : (
            <p className="text-gray-400">{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10">
        {isEdit ? (
          <button
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={updateUserProfileData}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Information"}
          </button>
        ) : (
          <button
            className="border border-[#5f6FFF] px-8 py-2 rounded-full hover:bg-[#5f6FFF] hover:text-white transition-all"
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
