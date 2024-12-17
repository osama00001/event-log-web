/**
 * Set cookies for tokens
 * @param {Object} res - Express response object
 * @param {String} accessToken - The access token to set in the cookies
 * @param {String} refreshToken - The refresh token to set in the cookies
 */
const setTokensAsCookies = (res, accessToken, refreshToken) => {
    // Set the access token
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
  
    // Set the refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  };


  const clearTokensFromCookies = (res) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  };

export { setTokensAsCookies,clearTokensFromCookies}
  