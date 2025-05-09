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
    console.log(response);
    
    if (response.data.token) {
      localStorage.setItem("riderToken", response.data.token);
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.token}`;
    }
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
};const FindUserPh = async (phoneNumber) => {
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
};
/**
 * User Services
 */
const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("riderToken"); 
    const response = await apiClient.get("/users/me", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
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
        'Authorization': `Bearer ${localStorage.getItem('riderToken')}`
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
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllDrivers = async () => {
  try {
    const response = await apiClient.get("/drivers/showAllDrivers");
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
      apiClient.defaults.headers.common["Authorization"] =
        `Bearer ${response.data.token}`;
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
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
    console.log(token);
    
    const response = await apiClient.post("/drivers/me", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Ride Services
 */
const createRide = async (rideData) => {
  try {
    const response = await apiClient.post("/rides", rideData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllRides = async () => {
  try {
    const response = await apiClient.get("/rides");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getRideById = async (rideId) => {
  try {
    const response = await apiClient.get(`/rides/${rideId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
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

const acceptRideRequest = async (requestId) => {
  try {
    const response = await apiClient.patch(`/ride-requests/${requestId}/accept`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const rejectRideRequest = async (requestId) => {
  try {
    const response = await apiClient.patch(`/ride-requests/${requestId}/reject`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

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
    const response = await apiClient.post("/disputes", disputeData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getAllDisputes = async () => {
  try {
    const response = await apiClient.get("/disputes");
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
    const response = await apiClient.post("/vehicles", vehicleData);
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
  try {
    const response = await apiClient.post("/ratings", ratingData);
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
  try {
    const response = await apiClient.get("/ratings");
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
  approveDriver,
  FindDriverPh,
  driverForgotPassword,
  rejectDriver,
  getCurrentDriver,

  // Ride
  createRide,
  getAllRides,
  getRideById,

  // Ride Request
  createRideRequest,
  acceptRideRequest,
  rejectRideRequest,

  // Payment
  createPayment,
  confirmPayment,
  getCompletedPayments,

  // Dispute
  createDispute,
  getAllDisputes,
  solveDispute,
  dismissDispute,

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