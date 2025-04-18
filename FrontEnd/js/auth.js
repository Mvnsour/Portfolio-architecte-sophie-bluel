const userLogin = "http://localhost:5678/api/users/login";

/**
 * User authentication
 * @param {string} email - User email
 * @param {string} password - User password
 */

export async function checkAuth(email, password) {
  try {
    const response = await fetch(userLogin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, password})
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    return data; // return the token if successful
  } catch (error) {
    throw error; // spread the error to handle it in the login.js file
  }
}