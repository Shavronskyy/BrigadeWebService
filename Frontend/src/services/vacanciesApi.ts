import { getApiUrl } from "../config/api";

export interface VacancyCreateModel {
  id?: number;
  title: string;
  description: string;
  postedDate: string;
  contactPhone: string;
  requirements?: string[];
  salary: string;
  employmentType: string;
  educationLevel: string;
}

export interface Vacancy extends VacancyCreateModel {
  id: number;
  postedDate: string;
}

class VacanciesApiService {
  private get baseUrl() {
    return getApiUrl("VACANCIES");
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        return `HTTP error! status: ${response.status}`;
      }

      // Try to parse as JSON
      try {
        const errorData = JSON.parse(responseText);
        return (
          errorData.message ||
          errorData.title ||
          errorData.detail ||
          errorData.error ||
          errorData.exception ||
          errorData.Message ||
          errorData.Title ||
          errorData.Detail ||
          errorData.Error ||
          errorData.Exception ||
          responseText ||
          `HTTP error! status: ${response.status}`
        );
      } catch {
        // If JSON parsing fails, return raw text
        return responseText || `HTTP error! status: ${response.status}`;
      }
    } catch {
      return `HTTP error! status: ${response.status}`;
    }
  }

  async getAllVacancies(): Promise<Vacancy[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAll`);
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // Check if response is empty
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        return [];
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      throw error;
    }
  }

  async createVacancy(vacancy: VacancyCreateModel): Promise<Vacancy> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacancy),
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating vacancy:", error);
      throw error;
    }
  }

  async updateVacancy(vacancy: VacancyCreateModel): Promise<Vacancy> {
    try {
      const response = await fetch(`${this.baseUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vacancy),
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating vacancy:", error);
      throw error;
    }
  }

  async deleteVacancy(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      throw error;
    }
  }
}

export const vacanciesApiService = new VacanciesApiService();
