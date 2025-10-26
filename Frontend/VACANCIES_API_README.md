# Vacancies API Integration

This document describes the vacancies API integration for the React application.

## API Endpoints

The application is configured to proxy API calls to `http://localhost:5192` for the following endpoints:

### Get All Vacancies

- **GET** `/api/Vacancy/getAllVacancies`
- Returns a list of all vacancies

### Create Vacancy

- **POST** `/api/Vacancy/createVacancy`
- Body: `VacancyCreateModel`

### Update Vacancy

- **PUT** `/api/Vacancy/updateVacancy`
- Body: `VacancyCreateModel` (with ID)

### Delete Vacancy

- **DELETE** `/api/Vacancy/deleteVacancy/{id}`

## Data Models

### VacancyCreateModel

```typescript
interface VacancyCreateModel {
  id?: number; // Optional for creation, required for updates
  title: string; // Job title
  description: string; // Job description
  postedDate: string; // ISO date string
  contactPhone: string; // Contact phone number
  requirements?: string[]; // Array of job requirements
  salary: string; // Salary information
  employmentType: string; // Type of employment
  educationLevel: string; // Required education level
}
```

### Vacancy

```typescript
interface Vacancy extends VacancyCreateModel {
  id: number; // Required ID
  postedDate: string; // ISO date string
}
```

## Components

### Vacancies.tsx

- Public-facing component that displays all vacancies
- Fetches data from the API on component mount
- Shows loading state while fetching
- Displays "no vacancies" message when none exist

### AdminVacancies.tsx

- Admin interface for managing vacancies
- Full CRUD operations (Create, Read, Update, Delete)
- Form validation and error handling
- Loading and error states

## API Service

The `vacanciesApiService` handles all API communication:

```typescript
import { vacanciesApiService } from "../services/vacanciesApi";

// Get all vacancies
const vacancies = await vacanciesApiService.getAllVacancies();

// Create new vacancy
const newVacancy = await vacanciesApiService.createVacancy(vacancyData);

// Update existing vacancy
const updatedVacancy = await vacanciesApiService.updateVacancy(vacancyData);

// Delete vacancy
await vacanciesApiService.deleteVacancy(id);
```

## Setup

1. Ensure your backend API is running on `http://localhost:5192`
2. The proxy is configured in `src/setupProxy.js`
3. API calls will automatically be proxied to the backend

## Error Handling

- Network errors are logged to console
- User-friendly error messages are displayed
- Loading states provide visual feedback
- Form validation ensures data integrity

## Styling

- Loading states show "Завантаження вакансій..."
- Error states show "Помилка завантаження вакансій"
- Empty states show "Немає вакансій для відображення"
- All text is in Ukrainian as per the application's language
