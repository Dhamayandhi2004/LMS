// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode

// // Login user function
// export const loginUser = async (email, password) => {
//   try {
//     const response = await axios.post('/login', { email, password });
//     const { token } = response.data;

//     // Store the token and user email in local storage
//     localStorage.setItem('token', token);
//     localStorage.setItem('email', email); // Store email in local storage
//     const decodedToken = jwtDecode(token);
//     localStorage.setItem('userId', decodedToken.id); // Store user ID in local storage
//   } catch (error) {
//     console.error('Login error:', error);
//   }
// };
