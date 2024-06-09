// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const history = useHistory();

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login/', { email, password });
      setUser(response.data);
      if (response.data.is_admin) {
        history.push('/admin/dashboard');
      } else {
        history.push('/user/dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    setUser(null);
    history.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// // src/context/AuthContext.js
// import React, { createContext, useState, useContext } from 'react';
// import axios from 'axios';
// import { useHistory } from 'react-router-dom';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const history = useHistory();

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/login/', { email, password });
//       setUser(response.data);
//       if (response.data.is_admin) {
//         history.push('/admin/dashboard');
//       } else {
//         history.push('/user/dashboard');
//       }
//     } catch (error) {
//       console.error('Login failed', error);
//     }
//   };

//   const adminLogin = async (email, password) => {
//     try {
//       const response = await axios.post('/api/admin/login/', { email, password });
//       setUser(response.data);
//       if (response.data.is_admin) {
//         history.push('/admin/dashboard');
//       } else {
//         history.push('/login');
//       }
//     } catch (error) {
//       console.error('Admin login failed', error);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     history.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, adminLogin, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
