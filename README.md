# Bioverse Telehealth Platform

A full-stack telehealth platform that collects patient intake data and uses a simulated machine learning (ML) component to generate personalized treatment recommendations. The system supports two roles (patient and doctor) with separate interfaces: patients complete an intake form and doctors view submissions on a dashboard.

## Table of Contents

- [Overview](#overview)
- [Architecture & Design](#architecture--design)
- [Setup & Local Development](#setup--local-development)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Assumptions & Future Enhancements](#assumptions--future-enhancements)

## Overview

This project simulates a telehealth platform where patients fill out an intake form and receive a recommendation based on a simple, rule-based ML simulation. The doctor role (clinical dashboard) allows reviewing all submissions with limited details and viewing full submission details by clicking on a submission. Data is persisted in a Supabase PostgreSQL database, and Prisma is used as the ORM.

## Architecture & Design

- **Frontend:**  
  - Developed with Next.js, React, and TypeScript.
  - Separate pages for Login, Intake Form, and Dashboard (with Submission Details).
  - Reusable components for consistent UI.
  - Styling is implemented via CSS Modules.

- **Backend & API:**  
  - API routes built using Next.js API routes.
  - Endpoints include `/api/login`, `/api/intake`, and `/api/submissions` (with dynamic support via query parameter).
  - A simulated ML function (`simulateML`) returns recommendations and risk scores based on basic rules (e.g., age and weight thresholds).

- **Database & ORM:**  
  - Supabase PostgreSQL database is used to store patient intake data.
  - Prisma is configured to connect to Supabase using the `DATABASE_URL` environment variable.
  - The main table, `patient_intake`, stores a JSONB column (`submission_data`) for intake responses, along with recommendation and risk score fields.

- **Deployment:**  
  - The application is deployable on Vercel.
  - Prisma Client is generated on postinstall using the script `"postinstall": "prisma generate"`.
  - Environment variable `DATABASE_URL` must be set in Vercel.

## Setup & Local Development

### Prerequisites

- Node.js
- npm or yarn
- A Supabase account (for database hosting)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/bioverse-telehealth.git
   cd bioverse-telehealth
    ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Create a `.env.local` file in the project root with the following variable:

   ```env
   DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
   ```

4. **Generate the Prisma client and migrate the database:**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Access the app:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.


## Technology Stack

- **Next.js / React**: For building the user interface and API routes.
- **TypeScript**: For type safety and maintainability.
- **Prisma**: ORM for interacting with the PostgreSQL database on Supabase.
- **Supabase**: Provides a hosted PostgreSQL database and additional backend services.
- **CSS Modules**: For scoped, component-level styling.
- **Vercel**: For deploying the Next.js application.

- **components:** Reusable UI elements.
- **pages:** Next.js pages and API endpoints.
- **prisma:** Prisma schema and migrations.
- **styles:** CSS modules and global styles.
- **lib:** Contains the Prisma client initialization.

## Deployment

1. **Push your repository to GitHub.**
2. **Import your project on Vercel:**
   - Connect your GitHub repository.
   - Set your environment variables in the Vercel dashboard.
3. **Deployment Script:**
   - Vercel will run `npm install` which triggers the `postinstall` script to run `prisma generate`.
   - Vercel then runs `next build` to compile your application.

## Assumptions & Future Enhancements

- **Assumptions:**
  - The ML component is simulated using a simple rule-based function (`simulateML`).
  - All intake data is provided by the patient, and validation is handled at the frontend.

- **Future Enhancements:**
  - Integrate a real ML model either as a microservice or directly using Node.js ML libraries.
  - Implement user authentication and authorization beyond hardcoded credentials.
  - Enhance the UI/UX and add responsive design improvements.
  - Add unit/integration tests for API endpoints and UI components.
  - Optimize performance and handle edge cases for data submission and retrieval.