import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplete.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const { data, error } = await resendClient.emails.send({
    from: `${sender.name} <${sender.email}`,
    to:email,
    subject:"Welcome to InventoryManagementSystem.",
    html:createWelcomeEmailTemplate(name,clientURL)
  });
  if(error){
    console.error("Error in sending welcome email",error)
    throw new Error("Failed to send the welcome email.")
  }
  console.log("Welcome email sent successfully.",data)
};
