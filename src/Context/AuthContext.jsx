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
  const [personalityResult, setPersonalityResult] = useState(null);

  // Restore session
  useEffect(() => setLoading(false), []);

  // Simpan user dan token ke localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // ===== Login manual =====
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
        setUser(res.data.user);
        await fetchPersonalityResult(res.data.token, res.data.user.id);
        return true;
      } else throw new Error("Invalid login response");
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.error || "Login gagal");
      return false;
    } finally {
      setLoading(false);
    }
  }

  // ===== Login Google =====
  async function loginWithGoogle(googleToken) {
    setLoading(true);
    setError(null);
    try {
      // Sesuaikan body key menjadi id_token sesuai backend
      const res = await axios.post(
        "https://rutee.id/dapur/auth-user/auth-google.php",
        { id_token: googleToken } // 🔹 penting, backend expect 'id_token'
      );

      if (res.data?.token && res.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        await fetchPersonalityResult(res.data.token, res.data.user.id);
        return true;
      } else throw new Error("Login Google gagal");
    } catch (err) {
      console.error("❌ Login Google error:", err);
      setError(err.response?.data?.error || "Login Google gagal");
      return false;
    } finally {
      setLoading(false);
    }
  }

  // ===== Logout =====
  function logout() {
    setUser(null);
    setToken(null);
    setPersonalityResult(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // ===== Refresh profile =====
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
        setUser({ ...user, ...res.data.profile });
      }
    } catch (err) {
      console.error("❌ Gagal refresh profile:", err);
    }
  }

  // ===== Fetch personality result =====
  async function fetchPersonalityResult(
    customToken = token,
    customUserId = user?.id
  ) {
    if (!customToken || !customUserId) return null;
    try {
      const res = await axios.get(
        "https://rutee.id/dapur/personality/personality-results.php",
        {
          headers: { Authorization: `Bearer ${customToken}` },
          withCredentials: true,
        }
      );
      if (res.data?.success && res.data?.data) {
        setPersonalityResult(res.data.data);
        return res.data.data;
      } else {
        setPersonalityResult(null);
        return null;
      }
    } catch (err) {
      console.error("❌ Gagal ambil personality result:", err.message);
      setPersonalityResult(null);
      return null;
    }
  }

  // Auto fetch personality result jika token + user ada
  useEffect(() => {
    if (token && user?.id) fetchPersonalityResult();
  }, [token, user?.id]);

  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        login,
        loginWithGoogle,
        logout,
        refreshProfile,
        fetchPersonalityResult,
        personalityResult,
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
