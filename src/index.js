import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css"
import "assets/styles/index.css"

// layouts

import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";


// views without layouts
import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
// import Index from "views/Index.js";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      {/* add routes with layouts */}
      <Route path="/admin" element={Admin} />
      <Route path="/" element={Auth} />
      {/* add routes without layouts */}
      <Route path="/landing" element={Landing} />
      <Route path="/profile" element={Profile} />
      <Route path="*" element={Profile} />
      {/* <Route path="/" element={Admin} /> */}
      {/* add redirect for first page */}
      <Route from="*" element={<Navigate replace to="/" />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
