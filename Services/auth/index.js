// Register API
export const register_me = async (formData) => {
  try {
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error in register (service) => ', error);
    return { success: false, message: error.message };
  }
};

// Login API
export const login_me = async (formData) => {
  try {
    const res = await fetch(`/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error in login (service) => ', error);
    return { success: false, message: error.message };
  }
};

// Request Password Reset Code (OTP) API
export const request_reset_otp = async (email) => {
  try {
    const res = await fetch(`/api/auth/forgetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, action: 'request_otp' }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error in request_reset_otp (service) => ', error);
    return { success: false, message: error.message };
  }
};

// Reset Password with OTP API
export const forget_password = async (formData) => {
  try {
    const res = await fetch(`/api/auth/forgetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...formData, action: 'reset_password' }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error in forget Password (service) => ', error);
    return { success: false, message: error.message };
  }
};
