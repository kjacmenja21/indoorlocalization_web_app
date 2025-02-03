import React, { useState } from "react";
import "./_login.scss";
import logo from "../../assets/images/logo-sick-mobilisis.png";
import { AuthService } from "../../services/auth/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Clear any existing errors
    try {
      const response = await AuthService.login(username, password);

      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth">
      <input
        type="checkbox"
        id="auth__toggle"
        className="auth__toggle"
        aria-hidden="true"
      />

      <div className="auth__signup">
        <img src={logo} alt="Logo" className="auth__signup-logo" />
      </div>

      <div className="auth__login">
        <form className="auth__form" onSubmit={handleLogin}>
          <label
            htmlFor="auth__toggle"
            className="auth__form-label"
            aria-hidden="true"
          >
            Login
          </label>
          {error && <div className="auth__form-error">{error}</div>}
          <input
            type="username"
            name="username"
            placeholder="Username"
            required
            className="auth__form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            name="pswd"
            placeholder="Password"
            required
            className="auth__form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="auth__form-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
