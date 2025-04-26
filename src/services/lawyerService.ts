const LAWYER_BASE_URL='http://localhost:5000/api/users/lawyers'

import type { Lawyer} from "../types/lawyer"

export async function getLawyer():Promise<Lawyer[]>{
 const token= localStorage.getItem("token")
 console.log(token)
  const response = await fetch(LAWYER_BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed, e.g., Authorization
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Check if response is OK
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json()
  return data.lawyers;
  // Parse JSON response
          
}