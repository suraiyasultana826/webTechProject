import Cookies from "js-cookie";

// Bookmark job API
export const book_mark_job = async (formData) => {
  try {
    const res = await fetch(`/api/job/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in bookmark job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get bookmarked jobs API
export const get_book_mark_job = async (id) => {
  try {
    const res = await fetch(`/api/job/bookmark?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting bookmark job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Check if specific job is bookmarked
export const check_job_bookmarked = async (userId, jobId) => {
  try {
    const res = await fetch(`/api/job/bookmark?id=${userId}&job=${jobId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error checking bookmark status (service) => ", error);
    return { success: false, bookmarked: false };
  }
};

// Delete bookmark job API (Supports ID string, { id }, or { job, user })
export const delete_book_mark_job = async (payload) => {
  try {
    const bodyData = typeof payload === "string" ? { id: payload } : payload;
    const res = await fetch(`/api/job/bookmark`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in deleting bookmark job (service) => ", error);
    return { success: false, message: error.message };
  }
};
