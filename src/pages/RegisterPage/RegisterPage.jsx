import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css"

export default function RegisterPage() {
  const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
  const { register: registerUser } = useAuth();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    const success = await registerUser(data.email, data.password, data.name);

    if (success) {
      // Nếu đăng ký thành công, chuyển hướng đến trang Login
      navigate('/login'); 
    }
  };

  return (
    <div className="register-wrapper">
      {/* Bên trái: ảnh */}
      <div className="register-left">
        <img
          src="https://i.pinimg.com/736x/f0/a7/56/f0a756d38857bfde016cb88e52f6f85f.jpg"
          alt="register visual"
        />
      </div>

      {/* Bên phải: form */}
      <div className="register-right">
        <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Tạo tài khoản</h2>

          <label>Họ và tên</label>
          <input
            type="text"
            {...formRegister("name", { required: "Họ tên là bắt buộc" })}
            placeholder="Nhập họ tên"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}

          <label>Email</label>
          <input
            type="email"
            {...formRegister("email", { 
              required: "Email là bắt buộc", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ"
              } 
            })}
            placeholder="Nhập email"
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}

          <label>Mật khẩu</label>
          <input
            type="password"
            {...formRegister("password", { 
              required: "Mật khẩu là bắt buộc",
              minLength: { value: 6, message: "Mật khẩu cần ít nhất 6 ký tự" } 
            })}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}

          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            {...formRegister("confirmPassword", { 
              required: "Vui lòng xác nhận mật khẩu",
              validate: value => value === password || "Mật khẩu không khớp" 
            })}
            placeholder="Nhập lại mật khẩu"
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}

          <button type="submit">Đăng ký</button>
        </form>
      </div>
    </div>
  );
}
