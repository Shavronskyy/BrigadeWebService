import { API_CONFIG } from "../config/api";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const sendContactMessage = async (
  formData: ContactFormData
): Promise<void> => {
  try {
    // Use FormSubmit (free service that works immediately)
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone || "Not provided");
    formDataToSend.append("message", formData.message);
    formDataToSend.append(
      "_subject",
      `Повідомлення від ${formData.name} - Brigade Web Contact`
    );
    formDataToSend.append("_replyto", formData.email);
    formDataToSend.append("_captcha", "false");

    const response = await fetch(
      "https://formsubmit.co/dima.shavronskyi@gmail.com",
      {
        method: "POST",
        body: formDataToSend,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("✅ Contact form submitted successfully");
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Не вдалося надіслати повідомлення. Спробуйте ще раз.");
  }
};
