import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

 const onSubmit = async (data) => {
    try {
      const success = await login(data.email, data.password);

      if (success) {
        navigate('/role-redirect', { replace: true });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Email hoặc mật khẩu không đúng'
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Đã xảy ra lỗi, vui lòng thử lại.'
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img
          src="https://i.pinimg.com/1200x/86/35/8d/86358d4bde1c7b8ac5c37f8bd7a80ce5.jpg"
          alt="register visual"
        />
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Đăng nhập</h2>

          <label>Email</label>
          <input
            type="email"
            {...register("email", { 
              required: "Email là bắt buộc",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ"
              }
            })}
            placeholder="Nhập email"
          />
          {/* 2. Hiển thị lỗi validation */}
          {errors.email && <p className="error-message">{errors.email.message}</p>}


          <label>Mật khẩu</label>
          <input
            type="password"
            {...register("password", { required: "Mật khẩu là bắt buộc" })}
            placeholder="Nhập mật khẩu"
          />
          {/* 2. Hiển thị lỗi validation */}
          {errors.password && <p className="error-message">{errors.password.message}</p>}

          {/* 4. Thêm trạng thái disabled và loading text */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          <div className="login-link">
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </form>
      </div>
    </div>
  );
}