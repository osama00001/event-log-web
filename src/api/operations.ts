import { API_ENDPOINT } from "./auth";


export const fetchOperations = async (token: string) => {
  const response = await fetch(`${API_ENDPOINT}/api/v1/operations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
   
   let resp =await response.json()
  return resp;
};

export const createOperation = async (operation: any, token: string) => {
  const formData = new FormData();

  // Append each field to the FormData object
  for (const key in operation) {
    if (key === 'file') {
      // If the key is the file, append it as a Blob/File
      formData.append(key, operation[key]);
    } else {
      // Append other fields as strings
      formData.append(key, operation[key]);
    }
  }
  
  const response = await fetch(`${API_ENDPOINT}/api/v1/operations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

export const updateOperationStatus = async (
  operationId: string,
  status: string,
  token: string
) => {
  const url = new URL(`${API_ENDPOINT}/api/v1/operations/status`);
  url.searchParams.append('operationId', operationId);
  url.searchParams.append('status', status);

  const response = await fetch(url.toString(), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};