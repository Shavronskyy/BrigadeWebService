import { API_CONFIG } from "../config/api";

export interface VacancyApplicationData {
  vacancyTitle: string;
  name: string;
  phone: string;
}

export const sendVacancyApplication = async (
  applicationData: VacancyApplicationData
): Promise<void> => {
  try {
    // Use FormSubmit for vacancy applications
    const formDataToSend = new FormData();
    formDataToSend.append("vacancy_title", applicationData.vacancyTitle);
    formDataToSend.append("name", applicationData.name);
    formDataToSend.append("phone", applicationData.phone);
    formDataToSend.append(
      "_subject",
      `Заявка на вакансію: ${applicationData.vacancyTitle} - Brigade Web`
    );
    formDataToSend.append("_replyto", "noreply@brigade-web.com");
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

    console.log("✅ Vacancy application submitted successfully");
  } catch (error) {
    console.error("Vacancy application error:", error);
    throw new Error("Не вдалося надіслати заявку. Спробуйте ще раз.");
  }
};
