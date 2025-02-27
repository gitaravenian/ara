// routes/partnerEmail.js
import express from "express";
import { sendEmail } from "../services/emailService.js";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

router.post("/send-partnerEmail", async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      name,
      email,
      companyName,
      phone,
      website,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      hearAboutUs,
      interestedProducts,
      message,
    } = req.body;

    // Format the message for the email
    const formattedMessage = `
      <h3>Partner Application from ${name} at ${companyName}</h3>
      
      <h4>Contact Information:</h4>
      <p>Email: ${email}</p>
      <p>Phone: ${phone}</p>
      <p>Website: ${website}</p>
      
      <h4>Address:</h4>
      <p>${addressLine1}</p>
      ${addressLine2 ? `<p>${addressLine2}</p>` : ""}
      <p>${city}, ${state} ${postalCode}</p>
      <p>${country}</p>
      
      <h4>Partnership Details:</h4>
      <p>How they heard about us: ${hearAboutUs}</p>
      <p>Interested Products: ${Object.entries(interestedProducts)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(", ")}</p>
      
      <h4>Additional Message:</h4>
      <p>${message}</p>
    `;

    // Call sendEmail with the required parameters
    await sendEmail({
      name,
      email,
      subject: `New Partner Application from ${companyName}`,
      message: formattedMessage,
      to: process.env.EMAIL_USER, // This should be your company's email
    });

    return res.status(200).json({
      success: true,
      message: "Partner application submitted successfully",
    });
  } catch (error) {
    console.error("Error processing partner application:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process partner application",
      error: error.message,
    });
  }
});

export default router;
