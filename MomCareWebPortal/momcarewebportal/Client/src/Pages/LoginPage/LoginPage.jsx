import { useState } from "react";
import { useToast } from "../../Components/ui/use-toast";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./LoginPage.scss";

const LoginPage = () => {
  const [role, setRole] = useState("chw");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = { email, password, role };

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "❌ Login Failed",
          description: data.message || "An error occurred during login.",
        });
        return;
      }

      // Store token in a cookie (expires in 1 hour, matching the backend expiry)
      Cookies.set("token", data.token, { expires: 1/24 });
      toast({
        title: "✅ Login Successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });

      //clear cookies


      // Navigate to the dashboard after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "❌ Login Error",
        description: "An unexpected error occurred. Please try again later.", error,
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to MomCare</h1>
        <p>Please log in to continue</p>
        <form onSubmit={handleLogin}>
          <div className="role-selector">
            <label>
              <input
                type="radio"
                name="role"
                value="chw"
                checked={role === "chw"}
                onChange={(e) => setRole(e.target.value)}
              />
              Community Health Worker
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
