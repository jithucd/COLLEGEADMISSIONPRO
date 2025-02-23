import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response.user.role === "superadmin") {
        localStorage.setItem("token", response.token);
        navigate("/superadmin-dashboard");
      } else {
        alert("You are not authorized as a super admin.");
      }
    } catch (error) {
      alert("Login failed!");
    }
  };

  return (
    <div>
      <h1>Super Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;