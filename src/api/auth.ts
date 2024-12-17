const API_ENDPOINT = 'http://localhost:8000';
// let API_ENDPOINT = "https://event-log-network-26-test.onrender.com"


const handleRegistration = async (payload:any) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/api/v1/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data
        
    } catch (error) {
        throw new Error(error.message)
    }
};


const  userLogin= async (payload:any) => {
    try {
        const response = await fetch(`${API_ENDPOINT}/api/v1/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data
        
    } catch (error) {
        throw new Error(error.message)
    }
};



 const updateProfile = async ( payload: {
  userName?: string;
  email?: string;
  phoneNumber?: string;
}, token: string) => {
  const response = await fetch(`${API_ENDPOINT}/api/v1/user/updateProfile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};

 const getProfile = async (token: string) => {
  const response = await fetch(`${API_ENDPOINT}/api/v1/user/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};


const forgotPassword = async (payload:any) => {
  // const response = await fetch(`${API_ENDPOINT}/api/v1/user/forgot-password`, {
  //   headers: {
  //     method: 'POST',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(payload),
  // });

  // if (!response.ok) {
  //   const error = await response.json();
  //   throw new Error(error.message);
  // }

  // return response.json();

  try {
    const response = await fetch(`${API_ENDPOINT}/api/v1/user/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    return data
    
} catch (error) {
    throw new Error(error.message)
}
};

export {handleRegistration,userLogin,updateProfile,getProfile,API_ENDPOINT,forgotPassword}