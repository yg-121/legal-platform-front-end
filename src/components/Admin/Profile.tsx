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
        };
      }

      console.log("Profile data:", profileData instanceof FormData ? [...profileData.entries()] : profileData);

      if (profileData instanceof FormData) {
        await axios.put("http://localhost:5000/api/users/admin/profile", profileData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.put("http://localhost:5000/api/users/admin/profile", profileData, config);
      }

      if (adminProfile.newPassword && adminProfile.password) {
        const passwordData = {
          currentPassword: adminProfile.password,
          newPassword: adminProfile.newPassword,
        };
        console.log("Password data:", passwordData);
        await axios.put("http://localhost:5000/api/users/admin/password", passwordData, config);
      }

      alert("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err.response?.data || err);
      alert("Failed to update profile: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          setAdminProfile((prev) => ({
            ...prev,
            profileImage: event.target.result as string,
          }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
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
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-400">
                <img
                  src={adminProfile.profileImage}
                  alt="Admin Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("placeholder.svg")) {
                      target.src = "/placeholder.svg?height=200&width=200";
                      target.onerror = null;
                    }
                  }}
                />
              </div>
              <div>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                />
                <button
                  onClick={() => document.getElementById("profile-image")?.click()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>

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

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="current-password" className="block text-sm font-medium">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="current-password"
                        name="password"
                        value={adminProfile.password}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="block text-sm font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        name="newPassword"
                        value={adminProfile.newPassword}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="block text-sm font-medium">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        name="confirmPassword"
                        value={adminProfile.confirmPassword}
                        onChange={handleProfileInputChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
                      />
                    </div>
                  </div>
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