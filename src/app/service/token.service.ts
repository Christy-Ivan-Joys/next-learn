export const TokenService = {
    getAccessToken: () => sessionStorage.getItem("access_token"),
    setAccessToken: (token: string) => sessionStorage.setItem("access_token", token),
    getRefreshToken: () => sessionStorage.getItem("refresh_token"),
    setRefreshToken: (token: string) => sessionStorage.setItem("refresh_token", token),
    clearTokens: () => {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
    },
  };
  