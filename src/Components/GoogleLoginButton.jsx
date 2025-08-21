import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Ambil dari .env
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (!clientId) {
    console.error("VITE_GOOGLE_CLIENT_ID belum di-set di .env");
    return null;
  }

  const handleLogin = async (credentialResponse) => {
    const id_token = credentialResponse?.credential;
    if (!id_token) {
      console.error("Tidak ada credential dari Google");
      return;
    }

    try {
      // Panggil AuthContext loginWithGoogle
      const success = await loginWithGoogle(id_token);

      if (success) {
        navigate("/"); // redirect ke home
      } else {
        console.error("Login Google gagal melalui AuthContext");
      }
    } catch (err) {
      console.error("Login Google error:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleLogin}
        onError={() => console.error("Login Google gagal")}
      />
    </GoogleOAuthProvider>
  );
}
