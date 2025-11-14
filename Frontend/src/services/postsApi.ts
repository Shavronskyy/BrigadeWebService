import { getApiUrl, API_CONFIG } from "../config/api";

export interface ImageDto {
  id: number;
  url: string;
}

export interface PostDto {
  id?: number;
  title: string;
  shortText: string;
  content: string;
  createdAt: string;
  images: ImageDto[];
}

export interface Post extends PostDto {
  id: number;
}

export interface PostCreateModel {
  title: string;
  shortText: string;
  content: string;
  createdAt: string;
  photos?: File[];
}

export interface PostUpdateModel extends PostCreateModel {
  id: number;
}

class PostsCrudService {
  private get baseUrl() {
    return getApiUrl("POSTS");
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
        return responseText || `HTTP error! status: ${response.status}`;
      }
    } catch {
      return `HTTP error! status: ${response.status}`;
    }
  }

  private transformPost(backendPost: any): Post {
    return {
      id: backendPost.id,
      title: backendPost.title,
      shortText: backendPost.shortText,
      content: backendPost.content,
      createdAt: backendPost.createdAt,
      images: (backendPost.images || []).map((img: any) => ({
        id: img.id,
        url: this.formatImageUrl(img.url || img.imageUrl || ""),
      })),
    };
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${this.baseUrl}/getAllDto`);
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        return [];
      }

      const posts: any[] = JSON.parse(responseText);
      return posts.map((post: any) => this.transformPost(post));
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  }

  async getPostById(id: number): Promise<Post> {
    try {
      const response = await fetch(`${this.baseUrl}/get/${id}`);
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const post: any = await response.json();
      return this.transformPost(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      throw error;
    }
  }

  async createPost(post: PostCreateModel): Promise<Post> {
    try {
      const formData = new FormData();
      formData.append("Title", post.title);
      formData.append("ShortText", post.shortText);
      formData.append("Content", post.content);
      formData.append("CreatedAt", post.createdAt);

      // Add photos if they exist
      if (post.photos && post.photos.length > 0) {
        for (const file of post.photos) {
          formData.append("Photos", file, file.name);
        }
      }

      const response = await fetch(`${this.baseUrl}/create`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const responseText = await response.text();

      if (
        !responseText ||
        responseText.trim() === "" ||
        responseText.trim() === "OK"
      ) {
        const result = {
          id: Date.now(),
          title: post.title,
          shortText: post.shortText,
          content: post.content,
          createdAt: post.createdAt,
          images: [],
        };
        return this.transformPost(result);
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(
          "Failed to parse JSON response, creating minimal result:",
          parseError
        );
        const minimalResult = {
          id: Date.now(),
          title: post.title,
          shortText: post.shortText,
          content: post.content,
          createdAt: post.createdAt,
          images: [],
        };
        return this.transformPost(minimalResult);
      }

      return this.transformPost(result);
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async updatePost(post: PostUpdateModel): Promise<Post> {
    try {
      const formData = new FormData();
      formData.append("Id", post.id.toString());
      formData.append("Title", post.title);
      formData.append("ShortText", post.shortText);
      formData.append("Content", post.content);
      formData.append("CreatedAt", post.createdAt);

      // Add photos if they exist
      if (post.photos && post.photos.length > 0) {
        for (const file of post.photos) {
          formData.append("Photos", file, file.name);
        }
      }

      const response = await fetch(`${this.baseUrl}/update`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      const responseText = await response.text();

      if (
        !responseText ||
        responseText.trim() === "" ||
        responseText.trim() === "OK"
      ) {
        return this.transformPost(post);
      }

      let result: any;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.warn(
          "Failed to parse JSON response, using input data:",
          parseError
        );
        return this.transformPost(post);
      }

      return this.transformPost(result);
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  async deletePost(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/delete/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }
}

export const postsApiService = new PostsCrudService();
