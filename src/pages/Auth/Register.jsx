import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, User, Lock, AlertCircle } from "lucide-react";
import { useRegisterMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";

const Register = () => {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // === Validation Functions ===

  const validateUsername = (value) => {
    if (!value) return "Username is required";
    if (/^\d/.test(value)) return "Username cannot start with a number";
    if (/^[^a-zA-Z]/.test(value)) return "Username must start with a letter";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (value.length > 30) return "Username cannot exceed 30 characters";
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) return "Username must contain only letters, numbers, and underscores";
    return "";
  };

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(value)) return "Password must include uppercase, lowercase, and numbers";
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  // === Event Handlers ===

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = "";
    switch (field) {
      case "username":
        error = validateUsername(username);
        break;
      case "email":
        error = validateEmail(email);
        break;
      case "password":
        error = validatePassword(password);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(confirmPassword);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (touched.username) {
      setErrors((prev) => ({ ...prev, username: validateUsername(value) }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
    if (touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword) }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  // === Form Submit ===

  const submitHandler = async (e) => {
    e.preventDefault();

    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (usernameError || emailError || passwordError || confirmPasswordError) return;

    try {
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("Account created successfully");
    } catch (err) {
      toast.error(err?.data?.error || "Registration failed");
    }
  };

  // === Helper Render Function ===

  const renderFormField = (
    id,
    label,
    type,
    value,
    onChange,
    icon,
    error,
    showToggle = false,
    toggleHandler = null,
    showState = false
  ) => (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
        <input
          type={showToggle ? (showState ? "text" : "password") : type}
          id={id}
          className={`pl-10 w-full p-2.5 bg-gray-50 border ${
            error ? "border-red-500 focus:ring-red-400 focus:border-red-400" :
                    "border-gray-300 focus:ring-purple-400 focus:border-purple-400"
          } rounded-lg transition-all text-gray-800 placeholder-gray-400`}
          placeholder={`Enter your ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          onBlur={() => handleBlur(id)}
          required
        />
        {showToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={toggleHandler}
          >
            {showState ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertCircle className="h-4 w-4 mr-1" /> {error}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-xl shadow-xl bg-white">
        {/* Form Section */}
        <div className="w-full md:w-3/5 p-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Account</h1>

          <form onSubmit={submitHandler} className="space-y-5">
            {renderFormField("username", "Username", "text", username, handleUsernameChange, <User />, errors.username)}
            {renderFormField("email", "Email Address", "email", email, handleEmailChange, <Mail />, errors.email)}
            {renderFormField("password", "Password", "password", password, handlePasswordChange, <Lock />, errors.password, true, togglePasswordVisibility, showPassword)}
            {renderFormField("confirmPassword", "Confirm Password", "password", confirmPassword, handleConfirmPasswordChange, <Lock />, errors.confirmPassword, true, toggleConfirmPasswordVisibility, showConfirmPassword)}

            <button
              disabled={isLoading || Object.values(errors).some((e) => e)}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg transition hover:scale-[1.02] disabled:opacity-60"
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="mt-5 text-center text-gray-700">
            Already have an account?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="text-purple-600 hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-2/5 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=1000&q=80"
            alt="Healthy food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/60 to-purple-600/60"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Kitchen Community</h2>
            <p className="text-lg">Create an account to track your kitchen inventory and never run out of ingredients.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
