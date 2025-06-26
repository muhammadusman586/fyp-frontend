import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { CheckCircle, X, Trash2, Edit2, Save, Mail } from "lucide-react";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");
  const [editableUserIsAdmin, setEditableUserIsAdmin] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const toastId = toast.loading("Deleting user...");
        await deleteUser(id);
        refetch();
        toast.update(toastId, {
          render: "User deleted successfully",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email, isAdmin) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
    setEditableUserIsAdmin(isAdmin);
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setUpdateError(null);
    setUpdateLoading(false);
  };

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateHandler = async (id) => {
    // Reset error state
    setUpdateError(null);
    
    // Validate fields
    if (!editableUserName || editableUserName.trim() === "") {
      toast.error("Username cannot be empty");
      setUpdateError("Username cannot be empty");
      return;
    }
    
    if (!editableUserEmail || editableUserEmail.trim() === "") {
      toast.error("Email cannot be empty");
      setUpdateError("Email cannot be empty");
      return;
    }
    
    if (!isValidEmail(editableUserEmail)) {
      toast.error("Please enter a valid email address");
      setUpdateError("Please enter a valid email address");
      return;
    }
    
    setUpdateLoading(true);
    const toastId = toast.loading("Updating user...");
    
    // Make sure the data structure matches what the API expects
    // The backend expects the userId as part of the URL params and the user data in the body
    const userData = {
      // We're passing the userId both as the identifier for the URL and in the body
      userId: id,
      // Send the updated user data
      username: editableUserName.trim(),
      email: editableUserEmail.trim(),
      // Preserve the isAdmin status
      isAdmin: editableUserIsAdmin,
    };
    
    // Call the updateUser mutation without unwrap()
    updateUser(userData)
      .then((response) => {
        // Check if we have an error in the response
        if (response.error) {
          const errorMsg = response.error.data?.message || 
                          response.error.data?.error || 
                          response.error.error ||
                          "Failed to update user";
                          
          setUpdateError(errorMsg);
          toast.update(toastId, {
            render: errorMsg,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          console.error("Update user error:", response.error);
        } else {
          // Success path
          setEditableUserId(null);
          setUpdateError(null);
          
          // Manually refetch to ensure we have the latest data
          refetch();
          
          toast.update(toastId, {
            render: "User updated successfully",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        // This catch block handles unexpected errors
        const errorMessage = err?.data?.message || 
                            err?.message || 
                            "An unexpected error occurred";
        
        setUpdateError(errorMessage);
        toast.update(toastId, {
          render: errorMessage,
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        
        console.error("Unexpected update error:", err);
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  return (
    <div
      className="min-h-screen py-6"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="container mx-auto pl-[5%] md:pl-[6%] lg:pl-[8%] xl:pl-[16%] pr-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-purple-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                User Management
              </h2>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader />
                </div>
              ) : error ? (
                <Message variant="error">
                  {error?.data?.message || error.error}
                </Message>
              ) : users?.length === 0 ? (
                <div className="bg-white rounded-lg p-6 text-center">
                  <p className="text-gray-700">No users found</p>
                </div>
              ) : (
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">
                          ID
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">
                          Admin
                        </th>
                        <th className="px-4 py-3 text-left text-gray-700 font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-800 font-mono text-sm">
                            {user._id.substring(0, 8)}...
                          </td>

                          <td className="px-4 py-3 text-gray-800">
                            {editableUserId === user._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={editableUserName}
                                  onChange={(e) =>
                                    setEditableUserName(e.target.value)
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Enter name"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="font-medium">
                                  {user.username}
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3 text-gray-800">
                            {editableUserId === user._id ? (
                              <div className="flex items-center space-x-2">
                                <input
                                  type="email"
                                  value={editableUserEmail}
                                  onChange={(e) =>
                                    setEditableUserEmail(e.target.value)
                                  }
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Enter email"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <a
                                  href={`mailto:${user.email}`}
                                  className="text-indigo-600 hover:text-indigo-800 flex items-center"
                                >
                                  <Mail size={14} className="mr-1" />
                                  {user.email}
                                </a>
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {user.isAdmin ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <X className="w-3 h-3 mr-1" />
                                User
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3">
                            {editableUserId === user._id ? (
                              <div className="flex flex-col space-y-2">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => updateHandler(user._id)}
                                    disabled={updateLoading}
                                    className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md transition-colors text-sm font-medium ${
                                      updateLoading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    {updateLoading ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                      </>
                                    ) : (
                                      <>
                                        <Save size={14} className="mr-1" />
                                        Save
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    disabled={updateLoading}
                                    className={`inline-flex items-center px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors text-sm font-medium ${
                                      updateLoading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <X size={14} className="mr-1" />
                                    Cancel
                                  </button>
                                </div>
                                {updateError && editableUserId === user._id && (
                                  <div className="text-sm text-red-600">
                                    {updateError}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    toggleEdit(
                                      user._id,
                                      user.username,
                                      user.email,
                                      user.isAdmin
                                    )
                                  }
                                  className="inline-flex items-center px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm font-medium"
                                >
                                  <Edit2 size={14} className="mr-1" />
                                  Edit
                                </button>

                                {!user.isAdmin && (
                                  <button
                                    onClick={() => deleteHandler(user._id)}
                                    className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                                  >
                                    <Trash2 size={14} className="mr-1" />
                                    Delete
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
