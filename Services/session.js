import Cookies from "js-cookie";

// Parse an authenticated API response. A 401 means the saved session is no longer
// valid (expired token, or the account was removed), so clear it and send the
// visitor to the login page instead of leaving them half logged in.
export const readJson = async (res) => {
  if (res.status === 401 && typeof window !== "undefined" && Cookies.get("token")) {
    Cookies.remove("token");
    localStorage.removeItem("user");
    if (!window.location.pathname.startsWith("/auth/")) {
      window.location.href = "/auth/login";
    }
  }
  return res.json();
};
