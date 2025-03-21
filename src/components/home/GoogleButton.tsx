import { SOCKET_URL } from "../../config/url";

const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.open(`${SOCKET_URL}/auth/google`, "_self");
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      type="button"
    >
      <img
        className="h-5 w-5 mr-2"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google logo"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleLoginButton;
