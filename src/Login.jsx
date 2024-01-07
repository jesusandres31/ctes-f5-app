import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8090/api/admins/auth-with-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identity: email, password: password }),
        }
      );

      if (response.ok) {
        setMessage("Login correcto");
      } else {
        setMessage("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error en la conexión");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
        <div>{message}</div>
      </form>
    </div>
  );
};

export default Login;
