import { useState } from "react";
import { useToast } from "../../Components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.scss";

const LoginPage = () => {
  const [role, setRole] = useState("chw");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts

    try {
      const result = await login(email, password, role);
      
      toast({
        title: "✅ Login Successful",
        description: `Welcome back, ${result.user.firstName}!`,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "❌ Login Failed",
        description: error.message || "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false); // Set loading to false when login completes (success or failure)
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="image-section">
          <img
            src="https://www.shutterstock.com/image-vector/beautiful-afro-american-mother-holding-600nw-1607103790.jpg"
            alt="Mother and child"
            className="login-image"
          />
          <div className="image-overlay">
            <h2>MomCare</h2>
            <p>Supporting maternal health with care and compassion.</p>
          </div>
        </div>
        <div className="form-section">
          <h1>Login to MomCare</h1>
          <p>Access your account to continue</p>
          <form onSubmit={handleLogin}>
            <div className="role-selector">
              <button
                type="button"
                className={role === "chw" ? "active" : ""}
                onClick={() => setRole("chw")}
                disabled={loading}
              >
                Community Health Worker
              </button>
              <button
                type="button"
                className={role === "admin" ? "active" : ""}
                onClick={() => setRole("admin")}
                disabled={loading}
              >
                Admin
              </button>
              <button
                type="button"
                className={role === "doctor" ? "active" : ""}
                onClick={() => setRole("doctor")}
                disabled={loading}
              >
                Doctor
              </button>
            </div>
            <div className="input-group">
              {loading ? (
                <div className="skeleton skeleton-input"></div>
              ) : (
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="email">Email</label>
                </div>
              )}
            </div>
            <div className="input-group">
              {loading ? (
                <div className="skeleton skeleton-input"></div>
              ) : (
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
              )}
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <span className="spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;