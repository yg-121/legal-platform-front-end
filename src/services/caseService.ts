const CASE_BASE_URL = "http://localhost:5000/api/cases/my-cases";

import { ClientCase } from "../types/caseType";

export async function MyCase(): Promise<ClientCase[]> {
  const token = localStorage.getItem("token");
  console.log(token);
  const response = await fetch(CASE_BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add any additional headers if needed, e.g., Authorization
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.cases;
  // Parse JSON response
}
