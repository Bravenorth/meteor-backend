
---

# **Backend API Documentation**

## **Overview**

This API provides endpoints for user authentication and protected resources. Users can register, log in, and access protected routes after authentication. The API uses cookies to maintain user sessions and follows security best practices to ensure data integrity and protection.

---

## **Table of Contents**

- [Base URL](#base-url)
- [Authentication Endpoints](#authentication-endpoints)
  - [Register User](#1-register-user)
  - [Login User](#2-login-user)
  - [Logout User](#3-logout-user)
- [Protected Endpoints](#protected-endpoints)
  - [Get User Dashboard](#1-get-user-dashboard)
- [Authentication Mechanism](#authentication-mechanism)
- [Error Handling](#error-handling)
- [Security Measures](#security-measures)
- [Data Models](#data-models)
  - [User Model](#user-model)
- [Usage Examples](#usage-examples)
  - [Register User](#register-user-example)
  - [Login User](#login-user-example)
  - [Access Protected Route](#access-protected-route-example)
- [Middleware](#middleware)
  - [Authentication Middleware](#authentication-middleware-requireauth)
- [Setup and Configuration](#setup-and-configuration)
  - [Environment Variables](#environment-variables)
  - [Dependencies](#dependencies)
- [Best Practices](#best-practices)
- [Future Enhancements](#future-enhancements)
- [Contact and Support](#contact-and-support)
- [Change Log](#change-log)
- [License](#license)
- [Conclusion](#conclusion)

---

## **Base URL**

All endpoints are prefixed with:

```
http://your-domain.com/api
```

Replace `http://your-domain.com` with your actual server domain or IP address.

---

## **Authentication Endpoints**

### **1. Register User**

- **URL:** `/auth/register`
- **Method:** `POST`
- **Description:** Registers a new user with a unique username, email, and password.
- **Headers:**
  - `Content-Type: application/json`
- **Request Body Parameters:**

  | Parameter | Type   | Required | Description                       |
  |-----------|--------|----------|-----------------------------------|
  | username  | String | Yes      | The user's unique username        |
  | email     | String | Yes      | The user's unique email address   |
  | password  | String | Yes      | The user's password (min 6 chars) |

- **Success Response:**
  - **Status Code:** `201 Created`
  - **Body:**

    ```json
    {
      "message": "User registered successfully"
    }
    ```

- **Error Responses:**
  - **Status Code:** `400 Bad Request`
  - **Possible Error Messages:**
    - `"Username already exists"`
    - `"Email already registered"`
    - `"Validation error message"`

### **2. Login User**

- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and creates a session.
- **Headers:**
  - `Content-Type: application/json`
- **Request Body Parameters:**

  | Parameter | Type   | Required | Description          |
  |-----------|--------|----------|----------------------|
  | email     | String | Yes      | The user's email     |
  | password  | String | Yes      | The user's password  |

- **Success Response:**
  - **Status Code:** `200 OK`
  - **Body:**

    ```json
    {
      "message": "Logged in successfully"
    }
    ```

  - **Set-Cookie Header:**
    - A `user_id` cookie is set in the user's browser to maintain the session.

- **Error Responses:**
  - **Status Code:** `400 Bad Request`
  - **Possible Error Messages:**
    - `"Invalid email or password"`

### **3. Logout User**

- **URL:** `/auth/logout`
- **Method:** `POST`
- **Description:** Logs out the user and clears the session cookie.
- **Headers:**
  - `Cookie: user_id=<uuid>`
- **Success Response:**
  - **Status Code:** `200 OK`
  - **Body:**

    ```json
    {
      "message": "Logged out successfully"
    }
    ```

- **Error Responses:**
  - **Status Code:** `400 Bad Request`
  - **Possible Error Messages:**
    - `"No active session"`

---

## **Protected Endpoints**

These endpoints require the user to be authenticated. The `user_id` cookie must be present and valid.

### **1. Get User Dashboard**

- **URL:** `/dashboard`
- **Method:** `GET`
- **Description:** Retrieves user-specific data.
- **Headers:**
  - `Cookie: user_id=<uuid>`
- **Success Response:**
  - **Status Code:** `200 OK`
  - **Body:**

    ```json
    {
      "message": "Welcome <username>"
    }
    ```

- **Error Responses:**
  - **Status Code:** `401 Unauthorized`
  - **Possible Error Messages:**
    - `"Authentication required"`

---

## **Authentication Mechanism**

- **Session Management:** The API uses HTTP cookies to maintain user sessions. Upon successful login, a `user_id` cookie containing the user's UUID is set.
- **Cookie Attributes:**
  - `httpOnly`: `true` (prevents client-side JavaScript from accessing the cookie)
  - `secure`: `true` (ensures the cookie is sent over HTTPS)
- **Session Validation:** On each protected endpoint, middleware verifies the `user_id` cookie and retrieves the corresponding user from the database.

---

## **Error Handling**

- The API returns errors in the following JSON format:

  ```json
  {
    "error": "Error message here"
  }
  ```

- **Common Error Status Codes:**
  - `400 Bad Request`: Invalid input or request parameters.
  - `401 Unauthorized`: Authentication failure or missing credentials.
  - `500 Internal Server Error`: Server-side errors.

---

## **Security Measures**

- **Password Hashing:** User passwords are hashed using `bcryptjs` before being stored in the database.
- **Input Validation:** User inputs are validated and sanitized to prevent injection attacks.
- **HTTP Headers:** Security-related HTTP headers are set using `helmet`.
- **HTTPS Enforcement:** In production, the server should enforce HTTPS connections.
- **CORS Configuration:** Cross-origin resource sharing is configured to allow requests from trusted origins.
- **Cookie Security:** Cookies are set with `httpOnly` and `secure` flags to enhance security.

---

## **Data Models**

### **User Model**

- **Fields:**

  | Field     | Type   | Description                        |
  |-----------|--------|------------------------------------|
  | uuid      | String | Unique user identifier (UUID)      |
  | username  | String | Unique username (3-30 characters)  |
  | email     | String | Unique email address               |
  | password  | String | Hashed password                    |
  | createdAt | Date   | Timestamp of account creation      |

- **Methods:**
  - `comparePassword(candidatePassword)`: Compares a candidate password with the stored hashed password.

---

## **Usage Examples**

### **Register User Example**

- **Request:**

  ```http
  POST /api/auth/register
  Content-Type: application/json

  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```http
  HTTP/1.1 201 Created
  Content-Type: application/json

  {
    "message": "User registered successfully"
  }
  ```

### **Login User Example**

- **Request:**

  ```http
  POST /api/auth/login
  Content-Type: application/json

  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **Response:**

  ```http
  HTTP/1.1 200 OK
  Set-Cookie: user_id=<uuid>; HttpOnly; Secure
  Content-Type: application/json

  {
    "message": "Logged in successfully"
  }
  ```

### **Access Protected Route Example**

- **Request:**

  ```http
  GET /api/dashboard
  Cookie: user_id=<uuid>
  ```

- **Response:**

  ```http
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "message": "Welcome john_doe"
  }
  ```


---

## **Middleware**

### **Authentication Middleware (`requireAuth`)**

- **Purpose:** Protects routes by ensuring the user is authenticated.
- **Functionality:**
  - Checks for the `user_id` cookie.
  - Verifies that the UUID corresponds to a valid user.
  - Attaches the user object to `req.user` for downstream handlers.

---

## **Setup and Configuration**

### **Environment Variables**

Ensure the following environment variables are set:

- `PORT`: The port on which the server listens (e.g., `3000`).
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secret key for signing tokens (if used).

Example `.env` file:

```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

**Note:** Replace `your-mongodb-connection-string` and `your-secret-key` with your actual credentials. Keep this file secure and do not commit it to version control.

### **Dependencies**

- **Runtime Dependencies:**
  - `express`: Web framework.
  - `mongoose`: MongoDB object modeling.
  - `bcryptjs`: Password hashing.
  - `uuid`: UUID generation.
  - `cookie-parser`: Cookie parsing middleware.
  - `helmet`: Security middleware.
  - `cors`: Cross-origin resource sharing.
  - `dotenv`: Environment variable management.

- **Dev Dependencies:**
  - `nodemon`: Development tool for auto-restarting the server.

---

## **Best Practices**

- **Secure Storage of Credentials:** Do not hard-code sensitive information. Use environment variables and keep your `.env` file out of version control.
- **Input Validation:** Always validate and sanitize user inputs on both client and server sides.
- **Error Handling:** Provide meaningful error messages without revealing sensitive information.
- **Logging:** Implement proper logging mechanisms for debugging and monitoring.
- **Rate Limiting (Optional):** Implement rate limiting to prevent brute-force attacks.
- **Testing:** Write unit and integration tests to ensure API reliability.

---

## **Future Enhancements**

- **Email Verification:** Implement email verification during registration.
- **Password Reset:** Provide functionality to reset passwords securely.
- **Token-Based Authentication:** Consider using JWTs for stateless authentication.
- **Role-Based Access Control:** Implement user roles (e.g., admin, user) to control access to resources.
- **API Versioning:** Version your API endpoints to manage changes over time.

---

## **Contact and Support**

For any questions or issues regarding the API, please contact the development team at:

- **Email:** support@your-domain.com

---

## **Change Log**

- **v1.0.0**
  - Initial release with user registration, login, logout, and protected routes.

---

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Conclusion**

This documentation provides a comprehensive guide to using your backend API for user authentication and protected resource access. By adhering to the provided guidelines and best practices, you can effectively integrate and utilize the API in your applications.

---

**Happy Coding!**