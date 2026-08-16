import { describe, it, expect } from "vitest";
import { signupSchema } from "../pages/signup";

describe("Signup Form Validation & Client Normalization Pass", () => {
  const baseValidData = {
    fullName: "Aditya Raj",
    username: "addi",
    email: "addi@kashi.in",
    phone: "",
    password: "password123",
    confirmPassword: "password123",
    agreeTerms: true,
  };

  it("Phone omitted -> PASS", () => {
    const data = { ...baseValidData };
    delete (data as any).phone;
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("");
    }
  });

  it("Phone empty -> PASS", () => {
    const data = { ...baseValidData, phone: "" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("");
    }
  });

  it("Valid phone -> PASS", () => {
    const data = { ...baseValidData, phone: "9876543210" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBe("9876543210");
    }
  });

  it("Clearly invalid phone -> FAIL", () => {
    const data = { ...baseValidData, phone: "12345" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.flatten();
      expect(error.fieldErrors.phone).toContain("Phone number must be at least 10 digits");
    }
  });

  it("Username ' Addi ' -> normalized to 'addi'", () => {
    const data = { ...baseValidData, username: " Addi " };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("addi");
    }
  });

  it("Username 'ADDI' -> normalized to 'addi'", () => {
    const data = { ...baseValidData, username: "ADDI" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("addi");
    }
  });

  it("Username 'addi' -> remains 'addi'", () => {
    const data = { ...baseValidData, username: "addi" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("addi");
    }
  });

  it("Full name ' Aditya Raj ' -> 'Aditya Raj'", () => {
    const data = { ...baseValidData, fullName: " Aditya   Raj " };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.fullName).toBe("Aditya Raj");
    }
  });

  it("Password confirmation behavior remains unchanged - Matches -> PASS", () => {
    const data = { ...baseValidData, password: "securepassword", confirmPassword: "securepassword" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("Password confirmation behavior remains unchanged - Mismatches -> FAIL", () => {
    const data = { ...baseValidData, password: "securepassword", confirmPassword: "differentpassword" };
    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.flatten();
      expect(error.fieldErrors.confirmPassword).toContain("Passwords don't match");
    }
  });
});
