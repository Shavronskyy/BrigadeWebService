import { getApiUrl, API_CONFIG } from "../config/api";

export interface Report {
  id: number;
  title: string;
  description: string;
  category: string;
  img: string; // Keep for backward compatibility
  createdAt: string;
  donationId: number;
  images?: any[]; // Add support for backend Images collection
}

export interface Donation {
  id: number;
  title: string;
  description: string;
  goal: number;
  creationDate: string;
  donationLink: string;
  img: string; // Keep for backward compatibility
  isCompleted: boolean;
  reports: Report[];
  imageId?: number; // Add support for backend ImageId
  image?: any; // Add support for backend Image entity
}

export interface DonationCreateModel {
  id?: number;
  title: string;
  description: string;
  goal: number;
  creationDate: string;
  donationLink: string;
  img: string;
  isCompleted: boolean;
}

export interface ReportCreateModel {
  id?: number;
  title: string;
  description: string;
  category: string;
  img: string;
  donationId: number;
  createdAt: string;
}

class DonationsApiService {
  private get baseUrl() {
    return getApiUrl("DONATIONS");
  }

  private formatImageUrl(url: string): string {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    if (url.startsWith("/")) return `${API_CONFIG.BASE_URL}${url}`;
    return `${API_CONFIG.BASE_URL}/${url}`;
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

  // Transform backend DTO response to match frontend interface
  private transformDonation(backendDonation: any): Donation {
    // Use the ImageUrl from DTO if available, otherwise generate from ImageId
    let imgUrl = "";
    if (backendDonation.imageUrl) {
      imgUrl = backendDonation.imageUrl;
    } else if (backendDonation.imageId) {
      // Generate S3 view URL if we have imageId but no imageUrl
      imgUrl = `/api/images/donations/${backendDonation.id}/view`;
    } else if (backendDonation.img) {
      // Fallback to old img field if it exists
      imgUrl = backendDonation.img;
    }

    return {
      id: backendDonation.id,
      title: backendDonation.title,
      description: backendDonation.description,
      goal: Number(backendDonation.goal), // Convert long to number
      creationDate: backendDonation.creationDate,
      donationLink: backendDonation.donationLink,
      img: imgUrl,
      isCompleted: backendDonation.isCompleted,
      reports: backendDonation.reports || [],
      imageId: backendDonation.imageId,
      image: undefined, // DTO doesn't include full image object
    };
  }

  private transformReport(backendReport: any): Report {
    // Generate image URL from S3 Images collection if available
    let imgUrl = "";
    if (backendReport.images && backendReport.images.length > 0) {
      // Use the first image's URL from DTO
      const firstImage = backendReport.images[0];
      if (firstImage && firstImage.url) {
        imgUrl = firstImage.url;
      }
    } else if (backendReport.img) {
      // Fallback to old img field if it exists
      imgUrl = backendReport.img;
    }

    return {
      id: backendReport.id,
      title: backendReport.title,
      description: backendReport.description,
      category: backendReport.category,
      img: imgUrl,
      createdAt: backendReport.createdAt,
      donationId: backendReport.donationId,
      images: backendReport.images, // Keep the full images array with URLs
    };
  }

  async getAllDonations(): Promise<Donation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAllDto`);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // Check if response has content
      const contentType = response.headers.get("content-type");

      // Check if response is empty
      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        return [];
      }

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      let donations: any[];
      try {
        donations = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          "Server returned invalid JSON response. This might be due to circular references in the backend data."
        );
      }

      // Transform backend data to match frontend interface
      return (
        donations
          .map((donation: any) => {
            const transformedDonation = this.transformDonation(donation);
            // Also transform reports if they exist
            if (donation.reports && Array.isArray(donation.reports)) {
              transformedDonation.reports = donation.reports
                .map((report: any) => this.transformReport(report))
                // Newest reports first
                .sort((a: Report, b: Report) => {
                  const aTime = new Date(a.createdAt ?? 0).getTime();
                  const bTime = new Date(b.createdAt ?? 0).getTime();
                  return bTime - aTime;
                });
            }
            return transformedDonation;
          })
          // Newest donations first by creationDate
          .sort((a: Donation, b: Donation) => {
            const aTime = new Date(a.creationDate ?? 0).getTime();
            const bTime = new Date(b.creationDate ?? 0).getTime();
            return bTime - aTime;
          })
      );
    } catch (error) {
      throw error;
    }
  }

  async getDonationById(id: number): Promise<Donation> {
    try {
      const response = await fetch(`${this.baseUrl}/getDtoById/${id}`);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const result: any = await response.json();

      // Transform DTO to frontend interface
      return this.transformDonation(result);
    } catch (error) {
      throw error;
    }
  }

  async createDonation(donation: DonationCreateModel): Promise<Donation> {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const result: any = await response.json();

      // Transform backend response to match frontend interface
      const transformedDonation = this.transformDonation(result);
      if (result.reports && Array.isArray(result.reports)) {
        transformedDonation.reports = result.reports.map((report: any) =>
          this.transformReport(report)
        );
      }
      return transformedDonation;
    } catch (error) {
      throw error;
    }
  }

  async updateDonation(donation: DonationCreateModel): Promise<Donation> {
    try {
      const response = await fetch(`${this.baseUrl}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donation),
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const result: any = await response.json();

      // Format image URLs for donation and reports
      return {
        ...result,
        img: this.formatImageUrl(result.img),
        reports:
          result.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteDonation(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  }

  async addReportToDonation(
    donationId: number,
    reportData: ReportCreateModel
  ): Promise<Donation> {
    try {
      // Create request body with donationId (backend expects it in both query and body)
      const requestBody = {
        id: reportData.id,
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        img: reportData.img,
        donationId: donationId, // Include donationId in the body
        createdAt: reportData.createdAt,
      };

      const response = await fetch(
        `${this.baseUrl}/${donationId}/createReport`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Try different possible error message fields
        const errorMessage =
          errorData.message ||
          errorData.title ||
          errorData.detail ||
          errorData.error ||
          errorData.exception ||
          `HTTP error! status: ${response.status}`;

        throw new Error(errorMessage);
      }

      const result: any = await response.json();
      return {
        ...result,
        img: this.formatImageUrl(result.img),
        reports:
          result.reports?.map((report: any) => ({
            ...report,
            img: this.formatImageUrl(report.img),
          })) || [],
      };
    } catch (error) {
      throw error;
    }
  }

  async toggleDonationStatus(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}/completeDonation`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // Check if response has content
      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        // Backend returned Ok() without body - this is expected
        return;
      }

      // If there is content, try to parse it
      try {
        JSON.parse(responseText);
        // If we get here, the backend returned data, but we don't need it
        // since we're just toggling status
      } catch (parseError) {
        // Non-JSON response is also fine for a status toggle
      }
    } catch (error) {
      throw error;
    }
  }

  async getReportsByDonationId(id: number): Promise<Report[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/getReportsByDonationId/${id}`
      );

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // Check if response is empty
      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        return [];
      }

      const reports: any[] = JSON.parse(responseText);

      // Transform DTO reports to frontend format and sort newest first
      return reports
        .map((reportDto: any) => this.transformReport(reportDto))
        .sort((a: Report, b: Report) => {
          const aTime = new Date(a.createdAt ?? 0).getTime();
          const bTime = new Date(b.createdAt ?? 0).getTime();
          return bTime - aTime;
        });
    } catch (error) {
      throw error;
    }
  }

  async deleteReport(reportId: number): Promise<void> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/Reports/delete/${reportId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      throw error;
    }
  }
}

export const donationsApiService = new DonationsApiService();
