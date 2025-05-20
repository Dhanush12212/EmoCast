 
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import API_URL from "../../../config";

const GoogleAuth = ({ clientID, setMessage, navigate }) => {
  return (
    <GoogleOAuthProvider clientId={clientID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const response = await axios.post(
              `${API_URL}/auth/google`,
              { token: credentialResponse.credential },
              { withCredentials: true }
            );
            setMessage({ text: "🎉 Login Successful!", type: "success" });
            setTimeout(() => navigate("/"), 500);
          } catch (error) {
            console.error("Login failed:", error.response?.data || error.message);
            setMessage({ text: "Google Login Failed", type: "error" });
          }
        }}
        onError={() =>
          setMessage({ text: "Google Login Error", type: "error" })
        }
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
