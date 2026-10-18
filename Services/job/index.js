import Cookies from "js-cookie";

// Post job API
export const post_job = async (formData) => {
  try {
    const res = await fetch(`/api/job/postAJob`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in post job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get job API (with optional pagination & filter support)
export const get_job = async (params = {}) => {
  try {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append("page", params.page);
    if (params.limit) searchParams.append("limit", params.limit);
    if (params.category) searchParams.append("category", params.category);
    if (params.type) searchParams.append("type", params.type);
    if (params.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/job/getAllJobs?${queryString}` : `/api/job/getAllJobs`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get specified job API
export const get_specified_job = async (id) => {
  try {
    const res = await fetch(`/api/job/getSpecifiedJob?id=${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting specified job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Apply job API
export const apply_job = async (formData) => {
  try {
    const res = await fetch(`/api/job/applyJob`, {
      method: "POST",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      body: formData,
    });
    return await res.json();
  } catch (error) {
    console.error("Error in apply job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get my all applied job API
export const get_my_applied_job = async (id) => {
  try {
    const res = await fetch(`/api/job/getAppliedJobs?id=${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting my applied jobs (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get my all posted job API
export const get_my_posted_job = async (id) => {
  try {
    const res = await fetch(`/api/job/getPostedJobs?id=${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting my posted jobs (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get all applications of specified job API
export const get_all_applications = async (id) => {
  try {
    const res = await fetch(`/api/job/getAllApplicationsOfSpecifiedJob?id=${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting applications of specified job (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Change application status API
export const change_application_status = async (formData) => {
  try {
    const res = await fetch(`/api/job/responseOfApplication`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (error) {
    console.error("Error in updating application status (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Download an applicant's CV (authenticated; returns the file as a Blob)
export const download_cv = async (fileName) => {
  try {
    const res = await fetch(`/api/job/getCV?file=${encodeURIComponent(fileName)}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, message: data.message || "Failed to download CV" };
    }
    return { success: true, blob: await res.blob() };
  } catch (error) {
    console.error("Error in downloading CV (service) => ", error);
    return { success: false, message: error.message };
  }
};

// Get application details API
export const get_application_details = async (id) => {
  try {
    const res = await fetch(`/api/job/getApplicationDetail?id=${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return await res.json();
  } catch (error) {
    console.error("Error in getting application details (service) => ", error);
    return { success: false, message: error.message };
  }
};