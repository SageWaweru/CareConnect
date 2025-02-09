import { useState } from "react";
import axios from "axios";

const Settings = () => {
  const [adminInfo, setAdminInfo] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");

  const updateAdminInfo = () => {
    axios.patch("/api/admin/settings/", adminInfo).then(() => {
      alert("Profile updated successfully!");
    });
  };

  const changePassword = () => {
    axios.patch("/api/admin/change-password/", { password }).then(() => {
      alert("Password updated successfully!");
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Update Profile</h3>
        <input
          type="text"
          value={adminInfo.name}
          onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Name"
        />
        <input
          type="email"
          value={adminInfo.email}
          onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
          className="w-full p-2 mt-2 border rounded"
          placeholder="Email"
        />
        <button
          onClick={updateAdminInfo}
          className="bg-emerald-800 text-white px-4 py-2 mt-4 rounded"
        >
          Save Changes
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Change Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mt-2 border rounded"
          placeholder="New Password"
        />
        <button
          onClick={changePassword}
          className="bg-emerald-800 text-white px-4 py-2 mt-4 rounded"
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Settings;
