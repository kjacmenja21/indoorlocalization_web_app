import React from "react";
import "./_login.scss";
import logo from "../../assets/images/logo-sick-mobilisis.png";

const Login = () => {
  return (
    <>
      <div class="auth">
        <input
          type="checkbox"
          id="auth__toggle"
          class="auth__toggle"
          aria-hidden="true"
        />

        <div class="auth__signup">
          <img src={logo} alt="Logo" class="auth__signup-logo" />
        </div>

        <div class="auth__login">
          <form class="auth__form">
            <label
              for="auth__toggle"
              class="auth__form-label"
              aria-hidden="true"
            >
              Login
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required=""
              class="auth__form-input"
            />
            <input
              type="password"
              name="pswd"
              placeholder="Password"
              required=""
              class="auth__form-input"
            />
            <button class="auth__form-button">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
