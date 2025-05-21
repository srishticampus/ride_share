//client/src/Services/apiService.js
import axios from "axios";

// Create Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const imageBaseUrl = import.meta.env.VITE_API_URL;
// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/**
 * Auth Services
 */

const login = async (credentials) => {
  try {
    const response = await apiClient.post("/users/login", credentials);

    let token = response.data.token;

    if (typeof token === 'string') {
      token = token.trim().replace(/^"+|"+$/g, '');
    }
    localStorage.setItem("authToken", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const register = async (userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === "profilePicture" && userData[key]) {
        formData.append(key, userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });

    const response = await apiClient.post("/users/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const userForgotPassword = async (phoneNumber, newPassword) => {
  try {
    const response = await apiClient.post(
      `/users/forgotPass/${phoneNumber}`,
      { password: newPassword },
      {
        skipAuth: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message ||
      error.message ||
      'Failed to reset password';
    throw new Error(errorMessage);
  }
}; const FindUserPh = async (phoneNumber) => {
  try {
    const response = await apiClient.post('/users/findByUserPh', { phoneNumber }, {
      skipAuth: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


const FindDriverPh = async (phoneNumber) => {
  try {
    const response = await apiClient.post('/drivers/findByDriverPh', { phoneNumber }, {
      skipAuth: true
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const driverForgotPassword = async (phoneNumber, newPassword) => {
  try {
    const response = await apiClient.post(
      `/drivers/forgotPass/${phoneNumber}`,
      { password: newPassword },
      {
        skipAuth: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message ||
      error.message ||
      'Failed to reset password';
    throw new Error(errorMessage);
  }
};/**
 * User Services
 */
const getCurrentUser = async () => {
  try {

    const token = localStorage.getItem("authToken");
    if (!token) throw new Error('No driver token found');


    const response = await apiClient.get("/users/userme", {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error.response?.data || error.message;
  }
};
const updateProfile = async (userData) => {
  try {
    const formData = new FormData();

    // Append all fields to formData
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });

    const response = await apiClient.patch("/users/me/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
/**
 * Admin Services
 */
const adminLogin = async (credentials) => {
  try {
    const response = await apiClient.post("/admin/login", credentials);

    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.token}`;
    }

    return response.data;

  } catch (error) {
    const errorMessage = error.response?.data?.message ||
      error.message ||
      "Login failed. Please try again later.";
    localStorage.removeItem("adminToken");
    delete apiClient.defaults.headers.common["Authorization"];
    throw new Error(errorMessage);
  }
};

const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(
      `/users?page=${page}&limit=${limit}`
    ,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllDrivers = async () => {
  try {
    const token = localStorage.getItem('adminToken');

    const response = await apiClient.get("/drivers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Driver Services
 */
const registerDriver = async (driverData) => {
  try {
    const formData = new FormData();
    Object.keys(driverData).forEach((key) => {
      if (key === "driverPic" && driverData[key]) {
        formData.append(key, driverData[key]);
      } else {
        formData.append(key, driverData[key]);
      }
    });

    const response = await apiClient.post("/drivers/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const driverLogin = async (credentials) => {
  try {
    const response = await apiClient.post("/drivers/login", credentials);
    console.log(response);

    localStorage.setItem("driverToken", response.data.token);
    localStorage.setItem("driverId", response.data.data.driver._id);

    apiClient.defaults.headers.common["Authorization"] =
      `Bearer ${response.data.token}`;
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const updateCurrentDriver = async (driverData) => {
  try {

    const formData = new FormData();

    Object.keys(driverData).forEach(key => {
      if (driverData[key] !== null && driverData[key] !== undefined) {
        formData.append(key, driverData[key]);
      }
    });

    const response = await apiClient.patch("/drivers/me/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to update driver:', error);
    throw error.response?.data || {
      status: 'error',
      message: error.message || 'Failed to update driver data'
    };
  }
};
const approveDriver = async (driverId) => {
  try {
    const response = await apiClient.patch(`/drivers/${driverId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const rejectDriver = async (driverId) => {
  try {
    const response = await apiClient.delete(`/drivers/${driverId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getCurrentDriver = async () => {
  try {
    const token = localStorage.getItem("driverToken");
    if (!token) throw new Error('No driver token found');

    const response = await apiClient.get("/drivers/me", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch driver:', error);
    throw error.response?.data || {
      status: 'error',
      message: error.message || 'Failed to fetch driver data'
    };
  }
};
/**
 * Ride Services
 */
const createRide = async (rideData) => {
  try {
    const token = localStorage.getItem("driverToken");
    if (!token) throw new Error('No driver token found');

    const response = await apiClient.post("/rides", rideData, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const getAllRides = async () => {
  try {
    const response = await apiClient.get("/rides/ShowAllRide");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const rejectRideRequest = (rideId, data) => {
  return apiClient.patch(`/rides/${rideId}/reject`, data);
}
const getRideById = async (rideId) => {
  try {
    const response = await apiClient.get(`/rides/${rideId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const updateRideMessage = (rideId, message, senderId, isDriver) => {
  return apiClient.patch(`/rides/${rideId}/message`, {
    message,
    senderId,
    senderType: isDriver ? 'Driver' : 'User'
  });
};

const joinRide = async (rideId, riderId) => {
  const response = await apiClient.patch(`/rides/${rideId}/join`, { riderId });
  return response.data;
};
const acceptRideRequest = async (rideId, data) => {
  const token = localStorage.getItem("driverToken");

  return await apiClient.post(`/rides/${rideId}/accept`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}
const processPayment = (id, paymentData) => {
  return apiClient.post(`/rides/${id}/payment`, paymentData);
};
const acceptRide = async (rideId, driverId) => {
  try {
    const response = await apiClient.put(
      `/rides/${rideId}/accept`,
      { driverId },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to accept ride');
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error('Error setting up request to accept ride');
    }
  }
};
/**
 * Ride Request Services
 */
const createRideRequest = async (requestData) => {
  try {
    const response = await apiClient.post("/ride-requests", requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


// const rejectRideRequest = async (requestId) => {
//   try {
//     const response = await apiClient.patch(`/ride-requests/${requestId}/reject`);
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error.message;
//   }
// };

/**
 * Payment Services
 */
const createPayment = async (paymentData) => {
  try {
    const response = await apiClient.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const confirmPayment = async (paymentId) => {
  try {
    const response = await apiClient.patch(`/payments/${paymentId}/confirm`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getCompletedPayments = async () => {
  try {
    const response = await apiClient.get("/payments/completed");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Dispute Services
 */
const createDispute = async (disputeData) => {
  try {
    const token = localStorage.getItem("authToken") || localStorage.getItem("driverToken");
    const response = await apiClient.post("/disputes", disputeData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const getAllDisputes = async () => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await apiClient.get("/disputes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const solveDispute = async (disputeId) => {
  try {
    const response = await apiClient.patch(`/disputes/${disputeId}/solve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
// Ensure proper authorization headers in apiService:
const responseDispute = async (disputeId, responseData) => {
  try {
    const token = localStorage.getItem('adminToken');
    const response = await apiClient.patch(
      `/disputes/${disputeId}/response`,
      responseData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const dismissDispute = async (disputeId) => {
  try {
    const response = await apiClient.patch(`/disputes/${disputeId}/dismiss`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Vehicle Services
 */
const registerVehicle = async (vehicleData) => {
  try {
    const response = await apiClient.post("/vehicles", vehicleData, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('driverToken')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const updateVehicle = async (vehicleId, vehicleData) => {
  try {
    const response = await apiClient.patch(`/vehicles/${vehicleId}`, vehicleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllVehicles = async () => {
  try {
    const response = await apiClient.get("/vehicles");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Profile Services
 */
const createProfile = async (profileData) => {
  try {
    const response = await apiClient.post("/profiles", profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const updateProfileDetails = async (profileId, profileData) => {
  try {
    const response = await apiClient.patch(`/profiles/${profileId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllProfiles = async () => {
  try {
    const response = await apiClient.get("/profiles");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Rating Services
 */
const createRating = async (ratingData) => {
  const token = localStorage.getItem("authToken");
  try {
    const response = await apiClient.post("/ratings", ratingData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
const updateRating = async (ratingId, ratingData) => {
  try {
    const response = await apiClient.patch(`/ratings/${ratingId}`, ratingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const deleteRating = async (ratingId) => {
  try {
    const response = await apiClient.delete(`/ratings/${ratingId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllRatings = async () => {
    const token = localStorage.getItem("authToken");

  try {
    const response = await apiClient.get("/ratings",{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Export all services
export default {
  // Auth
  login,
  register,
  userForgotPassword,

  // User
  getCurrentUser,
  updateProfile,
  FindUserPh,

  // Admin
  adminLogin,
  getAllUsers,
  getAllDrivers,

  // Driver
  registerDriver,
  driverLogin,
  updateCurrentDriver,
  approveDriver,
  FindDriverPh,
  driverForgotPassword,
  rejectDriver,
  getCurrentDriver,

  // Ride
  createRide,
  getAllRides,
  getRideById,
  updateRideMessage,
  joinRide,
  rejectRideRequest,
  processPayment,
  acceptRide,

  // Ride Request
  createRideRequest,
  acceptRideRequest,

  // Payment
  createPayment,
  confirmPayment,
  getCompletedPayments,

  // Dispute
  createDispute,
  getAllDisputes,
  solveDispute,
  dismissDispute,
  responseDispute,

  // Vehicle
  registerVehicle,
  updateVehicle,
  getAllVehicles,

  // Profile
  createProfile,
  updateProfileDetails,
  getAllProfiles,

  // Rating
  createRating,
  updateRating,
  deleteRating,
  getAllRatings,
};