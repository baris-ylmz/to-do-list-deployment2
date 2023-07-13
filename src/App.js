import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";

import Login from "./components/content/login";
import CustomComponent from "./components/CustomComponent";
import NotFound from "./components/notfound/NotFound";

import "./App.scss";
import Register from "./components/content/register";

function App() {
  const active = useSelector((state) => state.darkActive.active);



  useEffect(() => {
    if (active) {
      document.body.style.backgroundColor = "#dfe2e7";
      document.body.style.transition = "0.3s";
    } else {
      document.body.style.backgroundColor = "#242424";
      document.body.style.transition = "0.3s";
    }

    return () => {
      document.body.style.backgroundColor = null;
      document.body.style.color = null;
    };
  }, [active]);

  return (
    <div className={`App ${active ? "app-active" : "App"}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <CustomComponent />
              </PrivateRoute>
            }
          />
          <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.loggedIn.isLoggedIn);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.loggedIn.isLoggedIn);
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

export default App;

