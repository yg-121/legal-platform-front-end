/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import axios from "axios";

interface ProfileProps {
  adminProfile: {
    name: string;
    email: string;
    phone: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    profileImage: string;
  };
  setAdminProfile: (profile: {
    name: string;
    email: string;
    phone: string;
    password: string;
    newPassword: string;
    confirmPassword: string;
    profileImage: string;
  }) => void;
  getAxiosConfig: () => any;
}

const Profile: React.FC<ProfileProps> = ({ adminProfile, setAdminProfile, getAxiosConfig }) => {
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    try {
      const config = getAxiosConfig();
      if (!config.headers) return;

      let profileData;
      if (adminProfile.profileImage.startsWith("data:")) {
        const formData = new FormData();
        formData.append("username", adminProfile.name);
        formData.append("email", adminProfile.email);
        formData.append("phone", adminProfile.phone);
        const blob = await (await fetch(adminProfile.profileImage)).blob();
        formData.append("profile_photo", blob, "profile.jpg");
        profileData = formData;
      } else {
        profileData = {
          username: adminProfile.name,
          email: adminProfile.email,
          phone: adminProfile.phone,
          profile_photo: adminProfile.profileImage,
        };
      }

      console.log("Profile data sent:", profileData instanceof FormData ? [...profileData.entries()] : profileData);

      let response;
      if (profileData instanceof FormData) {
        response = await axios.put("http://localhost:5000/api/users/admin/profile", profileData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        response = await axios.put("http://localhost:5000/api/users/admin/profile", profileData, config);
      }

      console.log("Update response:", response.data);

      const updatedProfile = response.data.user;
      setAdminProfile((prev) => ({
        ...prev,
        name: updatedProfile.username || prev.name,
        email: updatedProfile.email || prev.email,
        phone: updatedProfile.phone || prev.phone,
        profileImage: updatedProfile.profile_photo || prev.profileImage,
      }));

      if (adminProfile.newPassword && adminProfile.password) {
        const passwordData = {
          currentPassword: adminProfile.password,
          newPassword: adminProfile.newPassword,
        };
        await axios.put("http://localhost:5000/api/users/admin/password", passwordData, config);
      }

      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err.response?.data || err);
      alert("Failed to update profile: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col gap-8">
            <div className="flex-1">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={adminProfile.name}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={adminProfile.email}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={adminProfile.phone}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={adminProfile.password}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={adminProfile.newPassword}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={adminProfile.confirmPassword}
                    onChange={handleProfileInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;