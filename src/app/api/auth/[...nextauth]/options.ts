import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string; 
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: User;
    error: string;
  }

  interface JWT {
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(
      `https://dev-api.trukapp.com/truk/log/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );
   
    if (!response.ok) {
      
      throw new Error(`Failed to refresh access token: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      // refreshToken: data.refreshToken || refreshToken,
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, 
    };
  } catch (error) {
    console.error("Refresh token error:", error);
    return {
      error: "RefreshAccessTokenError",
    };
  }
};

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone Number",
          type: "text",
          placeholder: "Enter your phone number",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.phone) {
          throw new Error("Phone number is required");
        }
        else if (!credentials?.password) {
          throw new Error("Password is required");
        }

        try {
          const response = await fetch(
            `https://dev-api.trukapp.com/truk/log/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mobile: credentials.phone,
                password: credentials.password,
              }),
            }
          );
          console.log("login response :", response)
          if (response.status === 404) {
              throw new Error("You dont have an account to login");
          }
          const user = await response.json();
          if (user && user.accessToken) {
            return {
              id: user.profile_id,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            };
          }

          throw new Error("Check the password you have entered");
        } catch (error) {
          console.error("Login error:", error);
          throw error
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        return {
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 23 * 60 * 60 * 1000,
        };
      }

      // Return token if access token is still valid
      const expiryToken = token.accessTokenExpires as number;
      if (Date.now() < expiryToken) {
        return token;
      }

      // Access token has expired, refresh it
      try {
        const refreshedToken = await refreshAccessToken(
          token.refreshToken as string
        );
        return {
          ...token,
          accessToken: refreshedToken.accessToken,
          accessTokenExpires: refreshedToken.accessTokenExpires,
        };
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return { ...token, error: "RefreshAccessTokenError" };
      }
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };

      if (token.error === "RefreshAccessTokenError") {
        session.error = "RefreshAccessTokenError";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  debug: process.env.NODE_ENV === "development",

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
