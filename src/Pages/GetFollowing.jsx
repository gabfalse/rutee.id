// src/components/GetFollowing.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const API_URL = "https://rutee.id/dapur/user/connections.php";

export default function GetFollowing() {
  const { user_id: userId, token } = useAuth(); // ambil dari AuthContext
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowing = async () => {
    if (!userId) {
      console.warn("No userId found in AuthContext");
      return;
    }

    if (!token) {
      console.warn("No token found in AuthContext");
      return;
    }

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      console.log("Fetching following for userId:", userId);
      console.log("Using headers:", headers);

      const res = await axios.get(`${API_URL}?following=${userId}`, {
        headers,
      });
      console.log("Raw response:", res);

      if (res.data.success) {
        console.log("Following data:", res.data.following);
        setFollowing(res.data.following);
      } else {
        console.error("Backend returned error:", res.data.message);
      }
    } catch (err) {
      console.error("Request error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowing();
  }, [userId, token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Following List for User ID: {userId}</h2>
      {following.length === 0 && <p>No following users.</p>}
      <ul>
        {following.map((user) => (
          <li key={user.id}>
            <img
              src={user.avatar || ""}
              alt={user.display_name}
              width={40}
              style={{ borderRadius: "50%" }}
            />
            <strong>{user.display_name || user.username}</strong> (
            {user.username})
          </li>
        ))}
      </ul>
    </div>
  );
}
