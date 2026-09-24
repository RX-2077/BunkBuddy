// src/pages/RegisterPage.jsx
import { Link } from "react-router-dom";
import RegisterForm from "../features/onboarding/RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <RegisterForm />
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
