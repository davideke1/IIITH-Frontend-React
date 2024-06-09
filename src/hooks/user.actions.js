import axios from "axios";
import { useNavigate } from "react-router-dom";

function useUserActions() {
  const navigate = useNavigate();
  const baseURL = "http://127.0.0.1:8000/api";
  return {
    login,
    register,
    logout,
  };

  // Login the user
  function login(data) {
    return axios.post(`${baseURL}/user-auth/login/`, data).then((res) => {
      // Registering the account and tokens in the store
      setUserData(res.data);
      navigate("/dashboard");
    });
  }

  // Register the user
  function register(data) {
    return axios.post(`${baseURL}/user-auth/register/`, data).then((res) => {
      // Registering the account and tokens in the store
      setUserData(res.data);
      navigate("/dashboard");
    });
  }

  // Logout the user
  function logout() {
    localStorage.removeItem("auth");
    navigate("/login");
  }

  
}



// Get the user
function getUser() {
  const auth = JSON.parse(localStorage.getItem("auth")) || null;
  if (auth) {
    return auth.user;
  } else {
    return null;
  }
}

// Get the access token
function getAccessToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.access;
}

// Get the refresh token
function getRefreshToken() {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth.refresh;
}

// Set the access, token and user property
function setUserData(data) {
  localStorage.setItem(
    "auth",
    JSON.stringify({
      access: data.access,
      refresh: data.refresh,
      user: data.user,
    })
  );
}

function fetchSensorData(userId,setData) {
    const fetchData = () => {
        axios.get(`http://localhost:8000/api/sensordata/${userId}/`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching sensor data:', error);
            });
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
}


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserLocations = async () => {
  try {
    const response = await axios.get(`${API_URL}/user-locations/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user locations:', error);
    throw error;
  }
};

export { useUserActions, getUser, getAccessToken, getRefreshToken,fetchSensorData,setUserData };