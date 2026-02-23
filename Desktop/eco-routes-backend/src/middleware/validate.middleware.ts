import { Request, Response, NextFunction } from "express";
import { sendError, HTTP } from "../utils/response.utils";
import { UserRole } from "../types/auth.types";

const VALID_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "logistics_staff",
  "rider",
];

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, ""); // Remove all spaces
  return /^\+?[0-9]{7,15}$/.test(cleaned); // Optional + then 7-15 digits
};

const validatePasswordStrength = (
  password: string,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // /[A-Z]/ is a regex that matches any uppercase letter A through Z
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  }

  // /[a-z]/ matches any lowercase letter a through z
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  }

  // /[0-9]/ matches any digit 0 through 9
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  }

  // This regex checks for any of the listed special characters
  if (!/[!@#$%^&*(),.?":{}|<>\-_=+\[\]\\;'`~]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!, @, #, $, etc.)",
    );
  }

  return {
    isValid: errors.length === 0, // Valid only if no failures collected
    errors,
  };
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Destructure the expected fields from the request body
  // req.body is populated by express.json() middleware in server.ts
  const { name, email, phone, password, role } = req.body;

  // This array will collect every validation failure found
  const errors: Array<{ field: string; message: string }> = [];

  // ---- VALIDATE: name ----
  // Check existence, correct type, not just whitespace, length bounds
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required" });
  } else if (name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters long",
    });
  } else if (name.trim().length > 100) {
    errors.push({
      field: "name",
      message: "Name cannot exceed 100 characters",
    });
  }

  // ---- VALIDATE: email ----
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email address is required" });
  } else if (!isValidEmail(email.trim())) {
    errors.push({
      field: "email",
      message: "Please provide a valid email address (e.g., user@example.com)",
    });
  }

  // ---- VALIDATE: phone ----
  if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
    errors.push({ field: "phone", message: "Phone number is required" });
  } else if (!isValidPhone(phone.trim())) {
    errors.push({
      field: "phone",
      message:
        "Please provide a valid phone number (7-15 digits, optional + prefix)",
    });
  }

  // ---- VALIDATE: password ----
  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push({ field: "password", message: "Password is required" });
  } else {
    // Run the detailed password strength check
    const { isValid, errors: pwErrors } = validatePasswordStrength(password);
    if (!isValid) {
      // Add each individual password requirement failure to the errors array
      pwErrors.forEach((msg) =>
        errors.push({ field: "password", message: msg }),
      );
    }
  }

  // ---- VALIDATE: role ----
  if (!role || typeof role !== "string") {
    errors.push({ field: "role", message: "Role is required" });
  } else if (!VALID_ROLES.includes(role as UserRole)) {
    errors.push({
      field: "role",
      message: `Role must be one of: ${VALID_ROLES.join(", ")}`,
    });
  }

  // If ANY validation failed, stop here and return ALL errors at once
  if (errors.length > 0) {
    sendError(
      res,
      "Validation failed. Please correct the highlighted fields.",
      HTTP.BAD_REQUEST,
      errors,
    );
    return; // CRITICAL: return prevents calling next() after sending a response
  }

  // Sanitize data: trim whitespace and normalize email to lowercase
  // This prevents issues like duplicate accounts with different casing
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase(); // "User@Email.COM" → "user@email.com"
  req.body.phone = phone.trim();

  // All validations passed — proceed to the register controller
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;
  const errors: Array<{ field: string; message: string }> = [];

  // ---- VALIDATE: email ----
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    errors.push({ field: "email", message: "Email address is required" });
  } else if (!isValidEmail(email.trim())) {
    errors.push({
      field: "email",
      message: "Please provide a valid email address",
    });
  }

  // ---- VALIDATE: password ----
  // For login, we only check presence — not strength requirements
  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (errors.length > 0) {
    sendError(res, "Validation failed.", HTTP.BAD_REQUEST, errors);
    return;
  }

  // Normalize email before passing to controller
  req.body.email = email.trim().toLowerCase();

  next();
};
