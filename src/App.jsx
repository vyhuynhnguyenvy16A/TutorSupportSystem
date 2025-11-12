import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import EmptyCart from './components/EmptyCart';
import DefaultLayout from "./components/Layout/DefaultLayout";
import AuthLayout from "./components/Layout/AuthLayout";

import Login from "./pages/Login/Login";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import AdminDashboard from "./pages/admin/Dashboard";
import ShopDashboard from "./pages/shop/Dashboard";
import HomePage from "./pages/user_homepage/HomePage";
import ShoppingBagPage from "./pages/user_homepage/ShoppingBagPage";
import GuestRoute from "./components/GuestRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRedirect from "./components/RoleRedirect";



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* TRANG PUBLIC: 
            Ai cũng có thể vào HomePage
          */}
          <Route
            path="/"
            element={
              <DefaultLayout>
                <HomePage />
              </DefaultLayout>
            }
          />

          {/* TRANG GUEST: 
            Chỉ người chưa đăng nhập mới vào được.
            Nếu đã đăng nhập, GuestRoute sẽ chuyển hướng họ đi.
          */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <AuthLayout>
                  <Login />
                </AuthLayout>
              </GuestRoute>
            }
          />
          <Route
            path="/cart-empty"
            element={
              <DefaultLayout>
                <EmptyCart />
              </DefaultLayout>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <AuthLayout>
                  <RegisterPage />
                </AuthLayout>
              </GuestRoute>
            }
          />
          {/* 2. Thêm route cho trang giỏ hàng đầy đủ */}
          <Route
            path="/shopping-bag"
            element={
              <DefaultLayout>
                <ShoppingBagPage />
              </DefaultLayout>
            }
          />
          {/* --- ✨ KẾT THÚC PHẦN THÊM MỚI --- */}
          {/* TRANG PROTECTED: 
            Yêu cầu phải đăng nhập.
            Nếu chưa đăng nhập, ProtectedRoute sẽ chuyển về /login.
          */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <AdminDashboard />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/dashboard"
            element={
              <ProtectedRoute>
                <DefaultLayout>
                  <ShopDashboard />
                </DefaultLayout>
              </ProtectedRoute>
            }
          />

          {/* TRANG CHUYỂN HƯỚNG: 
            Trang trung gian để RoleRedirect quyết định xem
            người dùng nên đi về đâu (Homepage, Admin, hay Shop).
          */}
          <Route
            path="/role-redirect"
            element={
              <ProtectedRoute>
                <RoleRedirect />
              </ProtectedRoute>
            }
          />
          
          {/* Trang 404 - Chuyển về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
