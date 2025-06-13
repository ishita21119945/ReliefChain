// src/components/Login.js
import React, { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";

const Login = () => {
  const [authClient, setAuthClient] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPrincipal, setUserPrincipal] = useState(null);

  useEffect(() => {
    // Initialize the AuthClient and check if already authenticated
    const initAuth = async () => {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
      if (authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        setUserPrincipal(identity.getPrincipal().toText());
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  const handleLogin = async () => {
    if (!authClient) return;
    authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize", // official ICP identity provider
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setUserPrincipal(identity.getPrincipal().toText());
        setIsAuthenticated(true);
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
    });
  };

  const handleLogout = () => {
    if (!authClient) return;
    authClient.logout();
    setIsAuthenticated(false);
    setUserPrincipal(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {isAuthenticated ? (
        <div>
          <p>
            Logged in as: <strong>{userPrincipal}</strong>
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with ICP</button>
      )}
    </div>
  );
};

export default Login;
