import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import UserAccount from './Authentication/UserAccount';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<UserAccount />} />
      </Routes>
    </BrowserRouter>
  );
}
