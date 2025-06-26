// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useProfileMutation } from "../../redux/api/usersApiSlice";
// import { toast } from "react-toastify";
// import { setCredentials } from "../../redux/features/auth/authSlice";
// import { User, Mail, Lock, CheckCircle, AlertCircle, Save } from "lucide-react";

// const Profile = () => {
//   const [username, setUserName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordMatch, setPasswordMatch] = useState(true);

//   const { userInfo } = useSelector((state) => state.auth);
//   const [updateProfile, { isLoading: loadingUpdateProfile }] =
//     useProfileMutation();

//   useEffect(() => {
//     setUserName(userInfo.username);
//     setEmail(userInfo.email);
//   }, [userInfo.username, userInfo.email]);

//   useEffect(() => {
//     // Check password match only if both fields have values
//     if (password || confirmPassword) {
//       setPasswordMatch(password === confirmPassword);
//     } else {
//       setPasswordMatch(true);
//     }
//   }, [password, confirmPassword]);

//   const dispatch = useDispatch();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await updateProfile({
//         _id: userInfo._id,
//         username,
//         email,
//         password,
//       }).unwrap();

//       dispatch(setCredentials({ ...res }));
//       toast.success("Profile updated successfully");

//       // Clear password fields after successful update
//       setPassword("");
//       setConfirmPassword("");
//     } catch (err) {
//       console.error("Update profile error:", err);
//       toast.error(
//         err?.data?.message ||
//           err?.error ||
//           "An error occurred during profile update"
//       );
//     }
//   };

//   return (
//     <div
//       className="min-h-screen py-6 pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4"
//       style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
//     >
//       <div className="container mx-auto">
//         <div className="max-w-3xl mx-auto">
//           <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
//               <div className="flex items-center">
//                 <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center shadow-inner border-2 border-white/40">
//                   <span className="text-2xl font-bold text-white">
//                     {userInfo.username?.charAt(0).toUpperCase() || "U"}
//                   </span>
//                 </div>
//                 <div className="ml-4">
//                   <h1 className="text-2xl font-bold text-white">
//                     Profile Settings
//                   </h1>
//                   <p className="text-white/80">
//                     Manage your account information
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <form onSubmit={submitHandler}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Username Field */}
//                   <div className="col-span-2 md:col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Username
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <User size={18} className="text-gray-400" />
//                       </div>
//                       <input
//                         type="text"
//                         placeholder="Enter username"
//                         className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//                         value={username}
//                         onChange={(e) => setUserName(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Email Field */}
//                   <div className="col-span-2 md:col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Mail size={18} className="text-gray-400" />
//                       </div>
//                       <input
//                         type="email"
//                         placeholder="Enter email"
//                         className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                     </div>
//                   </div>

//                   {/* Password Field */}
//                   <div className="col-span-2 md:col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       New Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Lock size={18} className="text-gray-400" />
//                       </div>
//                       <input
//                         type="password"
//                         placeholder="Enter new password"
//                         className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
//                           password && !passwordMatch
//                             ? "border-red-300 focus:ring-red-500"
//                             : "border-gray-300 focus:ring-purple-500"
//                         } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200`}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                       />
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Leave blank to keep current password
//                     </p>
//                   </div>

//                   {/* Confirm Password Field */}
//                   <div className="col-span-2 md:col-span-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Lock size={18} className="text-gray-400" />
//                       </div>
//                       <input
//                         type="password"
//                         placeholder="Confirm new password"
//                         className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
//                           confirmPassword && !passwordMatch
//                             ? "border-red-300 focus:ring-red-500"
//                             : "border-gray-300 focus:ring-purple-500"
//                         } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200`}
//                         value={confirmPassword}
//                         onChange={(e) => setConfirmPassword(e.target.value)}
//                       />
//                       {password && confirmPassword && (
//                         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//                           {passwordMatch ? (
//                             <CheckCircle size={18} className="text-green-500" />
//                           ) : (
//                             <AlertCircle size={18} className="text-red-500" />
//                           )}
//                         </div>
//                       )}
//                     </div>
//                     {!passwordMatch && confirmPassword && (
//                       <p className="text-xs text-red-500 mt-1">
//                         Passwords do not match
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Account Information Section */}
//                 <div className="mt-8 border-t border-gray-200 pt-6">
//                   <h2 className="text-lg font-medium text-gray-800 mb-4">
//                     Account Information
//                   </h2>

//                   <div className="bg-blue-50 rounded-lg p-4 mb-6">
//                     <div className="flex">
//                       <div className="flex-shrink-0">
//                         <CheckCircle className="h-5 w-5 text-blue-600" />
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-blue-800">
//                           Account Status
//                         </h3>
//                         <div className="mt-2 text-sm text-blue-700">
//                           <p>Your account is active and in good standing.</p>
//                         </div>
//                         <div className="mt-3">
//                           <div className="flex items-center">
//                             <div className="text-xs text-blue-600">
//                               Member since:{" "}
//                               {new Date(
//                                 userInfo.createdAt || Date.now()
//                               ).toLocaleDateString()}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-500">
//                       Last updated:{" "}
//                       {new Date(
//                         userInfo.updatedAt || Date.now()
//                       ).toLocaleDateString()}
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={
//                         loadingUpdateProfile || (password && !passwordMatch)
//                       }
//                       className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed"
//                     >
//                       {loadingUpdateProfile ? (
//                         <>
//                           <svg
//                             className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Updating Profile...
//                         </>
//                       ) : (
//                         <>
//                           <Save className="mr-2 h-5 w-5" />
//                           Save Changes
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;











import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { User, Mail, Lock, CheckCircle, AlertCircle, Save, Info } from "lucide-react";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [validationErrors, setValidationErrors] = useState({
    username: null,
    email: null,
    password: null
  });

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  useEffect(() => {
    // Check password match only if both fields have values
    if (password || confirmPassword) {
      setPasswordMatch(password === confirmPassword);
    } else {
      setPasswordMatch(true);
    }
    
    // Validate password according to backend requirements
    if (password) {
      if (password.length < 8) {
        setValidationErrors(prev => ({
          ...prev,
          password: "Password must be at least 8 characters"
        }));
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
        setValidationErrors(prev => ({
          ...prev,
          password: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        }));
      } else {
        setValidationErrors(prev => ({
          ...prev,
          password: null
        }));
      }
    } else {
      setValidationErrors(prev => ({
        ...prev,
        password: null
      }));
    }
  }, [password, confirmPassword]);

  // Validate username
  const validateUsername = (value) => {
    if (!value) {
      return "Username is required";
    } else if (value.length < 3) {
      return "Username must be at least 3 characters";
    } else if (value.length > 30) {
      return "Username cannot exceed 30 characters";
    }
    return null;
  };

  // Validate email
  const validateEmail = (value) => {
    if (!value) {
      return "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  // Handle username change with validation
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    setValidationErrors(prev => ({
      ...prev,
      username: validateUsername(value)
    }));
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setValidationErrors(prev => ({
      ...prev,
      email: validateEmail(value)
    }));
  };

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const usernameError = validateUsername(username);
    const emailError = validateEmail(email);
    let hasErrors = false;
    
    if (usernameError || emailError || validationErrors.password || !passwordMatch) {
      setValidationErrors({
        username: usernameError,
        email: emailError,
        password: validationErrors.password
      });
      
      if (usernameError) toast.error(usernameError);
      if (emailError) toast.error(emailError);
      if (validationErrors.password && password) toast.error(validationErrors.password);
      if (!passwordMatch && password) toast.error("Passwords do not match");
      
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password: password || undefined,  // Only send password if provided
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");

      // Clear password fields after successful update
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Update profile error:", err);
      toast.error(
        err?.data?.error || err?.data?.message ||
          err?.error ||
          "An error occurred during profile update"
      );
    }
  };

  // Determine if form has any validation errors
  const hasValidationErrors = () => {
    return validationErrors.username || 
           validationErrors.email || 
           validationErrors.password || 
           (password && !passwordMatch) ||
           loadingUpdateProfile;
  };

  return (
    <div
      className="min-h-screen py-6 pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center shadow-inner border-2 border-white/40">
                  <span className="text-2xl font-bold text-white">
                    {userInfo.username?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">
                    Profile Settings
                  </h1>
                  <p className="text-white/80">
                    Manage your account information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter username"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                          validationErrors.username 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-purple-500"
                        } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200`}
                        value={username}
                        onChange={handleUsernameChange}
                        required
                      />
                    </div>
                    {validationErrors.username && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors.username}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        placeholder="Enter email"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                          validationErrors.email 
                            ? "border-red-300 focus:ring-red-500" 
                            : "border-gray-300 focus:ring-purple-500"
                        } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200`}
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                          (password && !passwordMatch) || validationErrors.password
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500"
                        } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Leave blank to keep current password
                    </p>
                    {validationErrors.password && password && (
                      <p className="text-xs text-red-500 mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                    <p className="text-xs text-blue-500 mt-1 flex items-center">
                      <Info size={12} className="mr-1" />
                      Password must have at least 8 characters with uppercase, lowercase, and a number
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg bg-white border ${
                          confirmPassword && !passwordMatch
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-purple-500"
                        } text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition duration-200`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      {password && confirmPassword && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {passwordMatch ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <AlertCircle size={18} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {!passwordMatch && confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>

                {/* Account Information Section */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h2 className="text-lg font-medium text-gray-800 mb-4">
                    Account Information
                  </h2>

                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Account Status
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>Your account is active and in good standing.</p>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center">
                            <div className="text-xs text-blue-600">
                              Member since:{" "}
                              {new Date(
                                userInfo.createdAt || Date.now()
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Last updated:{" "}
                      {new Date(
                        userInfo.updatedAt || Date.now()
                      ).toLocaleDateString()}
                    </div>

                    <button
                      type="submit"
                      disabled={hasValidationErrors()}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loadingUpdateProfile ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-5 w-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;