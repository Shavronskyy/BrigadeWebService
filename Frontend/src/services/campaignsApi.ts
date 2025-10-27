import { getApiUrl } from "../config/api";

export interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: string;
  date: string;
  image: string;
  link: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CampaignCreateModel {
  id?: number;
  title: string;
  description: string;
  goal: string;
  date: string;
  image: string;
  link: string;
  isCompleted: boolean;
  createdAt: string;
}

class CampaignsApiService {
  private get baseUrl() {
    return getApiUrl("CAMPAIGNS");
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

  async getAllCampaigns(): Promise<Campaign[]> {
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
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  }

  async getCampaignById(id: number): Promise<Campaign | null> {
    try {
      const response = await fetch(`${this.baseUrl}/GetCampaignById/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching campaign:", error);
      throw error;
    }
  }

  async createCampaign(campaign: CampaignCreateModel): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  }

  async updateCampaign(campaign: CampaignCreateModel): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(campaign),
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  }

  async deleteCampaign(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  }

  async toggleCampaignStatus(id: number): Promise<Campaign> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ToggleCampaignStatus/${id}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      console.error("Error toggling campaign status:", error);
      throw error;
    }
  }
}

export const campaignsApiService = new CampaignsApiService();
