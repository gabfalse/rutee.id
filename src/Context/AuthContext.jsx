import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Restore session on mount =====
  useEffect(() => {
    if (token && user) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token, user]);

  // ===== Simpan user + token ke localStorage =====
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // ===== Login =====
  async function login({ usernameOrEmail, password }) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://rutee.id/dapur/auth-user/login.php",
        { usernameOrEmail, password }
      );

      if (res.data?.token && res.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user); // langsung simpan user dari backend
        setError(null);
        return true;
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  // ===== Logout =====
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // ===== Refresh profil (misalnya setelah update profil) =====
  async function refreshProfile(customToken) {
    const activeToken = customToken || token;
    if (!activeToken) return;

    try {
      const res = await axios.get(
        "https://rutee.id/dapur/profile/get/get-profile.php",
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.profile) {
        setUser({
          ...user,
          ...res.data.profile,
          profile_image_url: res.data.profile.profile_image_url || null,
        });
      }
    } catch (err) {
      console.error("❌ Gagal refresh profile:", err);
    }
  }

  const isAuthenticated = Boolean(user && token);
  const user_id = user?.id ?? null;
  const username = user?.username ?? null;
  const profile_image_url = user?.profile_image_url ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        user_id,
        username,
        profile_image_url,
        login,
        logout,
        refreshProfile,
        setUser,
        isAuthenticated,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
