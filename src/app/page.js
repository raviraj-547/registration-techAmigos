"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  AlertCircle,
  Check,
  Copy,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwmPeAIfSXGw4dHhN0IblSCUPzvU-AlRf_cwOQ4By_KJ8dOIr4l2AUMO-exgn2VziKEqQ/exec";
const FORM_SUBMIT_EMAIL = "https://formsubmit.co/raviraj17a@gmail.com";

const eventOptions = [
  { label: "The Human Algorithm", value: "The Human Algorithm" },
  { label: "Generative AI", value: "Generative AI" }
];

const collegeOptions = [
  { label: "CBSA", value: "CBSA" },
  { label: "CCT", value: "CCT" },
  { label: "CEC", value: "CEC" },
  { label: "COE", value: "COE" },
  { label: "Other", value: "Other" }
];

const yearOptions = [
  { label: "1st Year", value: "1st Year" },
  { label: "2nd Year", value: "2nd Year" },
  { label: "3rd Year", value: "3rd Year" },
  { label: "4th Year", value: "4th Year" }
];

export default function Home() {
  const [formData, setFormData] = useState({
    event: "",
    name: "",
    roll_number: "",
    email: "",
    mobile_number: "",
    branch: "",
    college: "",
    year: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [ticketData, setTicketData] = useState({ id: "", eventName: "" });
  const [footerYear, setFooterYear] = useState(2024);
  const [copyState, setCopyState] = useState("idle"); // idle, copied

  useEffect(() => {
    setFooterYear(new Date().getFullYear());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateID = () => {
    return `TAC-${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.event) {
      setError("Please select an event to proceed.");
      return;
    }

    setIsLoading(true);

    const uniqueID = generateID();
    const currentTicketData = {
      id: uniqueID,
      eventName: formData.event || "Event Pass",
    };

    try {
      // Prepare payloads
      const googleSheetData = new URLSearchParams();
      googleSheetData.append("registration_id", uniqueID);
      for (const key in formData) {
        googleSheetData.append(key, formData[key]);
      }

      const emailData = new FormData();
      for (const key in formData) {
        emailData.append(key, formData[key]);
      }
      emailData.append("Registration ID", uniqueID);
      emailData.append("_captcha", "false");
      emailData.append("_subject", `New Registration: ${formData.name}`);

      // Send Requests (Parallel)
      await Promise.all([
        fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: googleSheetData,
        }),
        fetch(FORM_SUBMIT_EMAIL, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: emailData,
        }),
      ]);

      // Success
      setTicketData(currentTicketData);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3b82f6", "#22d3ee", "#d9f99d"],
      });

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketData.id).then(() => {
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    });
  };

  const resetForm = () => {
    setFormData({
      event: "",
      name: "",
      roll_number: "",
      email: "",
      mobile_number: "",
      branch: "",
      college: "",
      year: "",
      message: "",
    });
    setIsSuccess(false);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <nav className="navbar fade-in-up">
        <a href="#" className="nav-logo">
          {/* Using img tag directly for consistent sizing with CSS or Next/Image with styling */}
          <img src="/logo.png" alt="Tech Amigos Logo" />
          Tech Amigos
        </a>
        <div className="nav-version">v1.0</div>
      </nav>

      <div className="main-container">
        <div className="content-wrapper">
          <header className="header-section fade-in-up delay-1">
            <h1 className="main-title">
              {eventOptions.find(opt => opt.value === formData.event)?.label || "Event Registration"}
            </h1>
            <p className="main-subtitle">
              Registrations Open — Limited Seats Available<br />
              <strong>Secure your spot now.</strong>
            </p>
          </header>

          <div className="registration-card fade-in-up delay-2">
            {!isSuccess ? (
              <div id="register-view">
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">

                    {/* Custom Select for Event */}
                    <CustomSelect
                      label="Event Name"
                      name="event"
                      value={formData.event}
                      onChange={handleChange}
                      options={eventOptions}
                      placeholder="Select Event"
                      required
                    />

                    <div className="form-grid col-2">
                      <div>
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="roll_number">Roll No.</label>
                        <input
                          type="text"
                          id="roll_number"
                          name="roll_number"
                          placeholder="2xxxxx"
                          required
                          value={formData.roll_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-grid col-2">
                      <div>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="student@cgc.edu.in"
                          required
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="mobile_number">Phone</label>
                        <input
                          type="tel"
                          id="mobile_number"
                          name="mobile_number"
                          placeholder="98765 43210"
                          pattern="[0-9]{10}"
                          title="10 digit mobile number"
                          required
                          value={formData.mobile_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-grid col-3">
                      <div>
                        <label htmlFor="branch">Branch</label>
                        <input
                          type="text"
                          id="branch"
                          name="branch"
                          placeholder="AIML"
                          required
                          value={formData.branch}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Custom Select for College */}
                      <CustomSelect
                        label="College"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        options={collegeOptions}
                        placeholder="Select"
                        required
                      />

                      {/* Custom Select for Year */}
                      <CustomSelect
                        label="Year"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        options={yearOptions}
                        placeholder="Select"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="message">Questions (Optional)</label>
                      <textarea
                        id="message"
                        name="message"
                        rows="2"
                        placeholder="Any specific requirements?"
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-submit"
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner"></div> Registering...
                        </>
                      ) : (
                        <>
                          <span>Confirm Registration</span>
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>

                    {error && (
                      <div className="error-box">
                        <AlertCircle size={20} />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              <div className="thank-you-view">
                <div className="success-icon-wrapper">
                  <Check style={{ color: "#10b981", width: "32px", height: "32px" }} />
                </div>

                <h2 className="main-title" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  You&apos;re In!
                </h2>
                <p className="main-subtitle" style={{ marginBottom: "1rem" }}>Please save your ticket below.</p>

                <div className="ticket-stub">
                  <div className="ticket-header">
                    <h3
                      style={{
                        fontFamily: "'Space Grotesk'",
                        fontSize: "1.25rem",
                        textTransform: "uppercase",
                        margin: 0,
                        color: "white"
                      }}
                    >
                      Tech Amigos
                    </h3>
                    <span
                      style={{ fontSize: "0.85rem", opacity: 0.7, color: "white" }}
                    >
                      {ticketData.eventName}
                    </span>
                  </div>
                  <div className="ticket-body">
                    <div className="ticket-id-label">Registration ID</div>
                    <div className="ticket-id">{ticketData.id}</div>

                    <button
                      className="btn-copy"
                      onClick={handleCopy}
                      type="button"
                    >
                      {copyState === "copied" ? (
                        <>
                          <Check size={16} color="#10b981" /> <span style={{ color: "#10b981" }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} /> Copy ID
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  className="btn-submit"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", marginTop: 0 }}
                  onClick={resetForm}
                  type="button"
                >
                  Register Another Student
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="footer">
        <div style={{ marginBottom: "1rem", display: "flex", gap: "12px", justifyContent: "center" }}>
          <a href="https://www.instagram.com/techamigosclub.dsw/" className="social-link" style={{ borderColor: 'rgba(225, 48, 108, 0.2)', color: '#E1306C' }}>
            <Instagram size={20} />
          </a>
          <a href="https://chat.whatsapp.com/KsU9mqGZlKA9YjT1NfZyx5" className="social-link" style={{ borderColor: 'rgba(37, 211, 102, 0.2)', color: '#25D366' }}>
            {/* WhatsApp SVG */}
            {/* WhatsApp SVG - Official Brand Style */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/techamigos-cgc-landran-214626284/" className="social-link" style={{ borderColor: 'rgba(0, 119, 181, 0.2)', color: '#0077b5' }}>
            <Linkedin size={20} />
          </a>
        </div>
        <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>
          &copy; {footerYear} Tech Amigos Club
        </p>
      </footer>
    </>
  );
}
