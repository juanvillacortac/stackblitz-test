export interface Authenticate {
    id: number;
    name: string;
    lastName: string;
    email: string;
    imageUrl: string;
    token: string;
    type: number;
    refreshToken: string;
    rememberMe: boolean;
  }
