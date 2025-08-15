import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil profil user saat pertama kali mount
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const token = localStorage.getItem("token");

      if (token && !user) {
        try {
          const res = await axios.get(
            "https://rutee.id/dapur/profile/get/get-profile.php",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (res.data?.profile) {
            if (isMounted) {
              // Pastikan profile_image_url selalu ada
              const profile = {
                ...res.data.profile,
                profile_image_url: res.data.profile.profile_image_url || null,
              };
              setUser(profile);
              setError(null);
            }
          } else {
            throw new Error("Invalid profile response");
          }
        } catch (err) {
          if (isMounted) {
            logout();
            setError("Session expired, please login again.");
          }
        }
      }

      if (isMounted) setLoading(false);
    }

    loadUser();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simpan user ke localStorage setiap kali user berubah
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Fungsi login
  async function login({ usernameOrEmail, password }) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "https://rutee.id/dapur/auth-user/login.php",
        { usernameOrEmail, password }
      );

      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);

        const profileUser = {
          ...res.data.user,
          profile_image_url: res.data.user.profile_image_url || null,
        };

        setUser(profileUser);
        setError(null);
        return profileUser;
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Fungsi logout
  function logout() {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  // Fungsi refresh profil (misalnya setelah update avatar/nama)
  async function refreshProfile() {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(
        "https://rutee.id/dapur/profile/get/get-profile.php",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.data?.profile) {
        const profileUser = {
          ...res.data.profile,
          profile_image_url: res.data.profile.profile_image_url || null,
        };
        setUser(profileUser);
      }
    } catch (err) {
      console.error("Gagal refresh profile:", err);
    }
  }

  const isAuthenticated = Boolean(user);
  const user_id = user?.id ?? null;
  const username = user?.username ?? null;
  const profile_image_url = user?.profile_image_url ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        user_id,
        profile_image_url,
        username,
        setUser,
        login,
        logout,
        refreshProfile,
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
