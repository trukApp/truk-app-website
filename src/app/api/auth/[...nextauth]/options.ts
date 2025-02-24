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
  console.log("token to refresh the accessToken :", refreshToken);
  try {
    const response = await fetch(
      `https://dev-api.trukapp.com/truk/log/refresh-token`,
      //  `http://192.168.10.33:8088/truk/log/refresh-token`,    // teja ofc
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      console.log("refresh token err :", response.statusText);
      throw new Error(`Failed to refresh access token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("refreshtoken success response :", data);
    return {
      accessToken: data.accessToken,
      refreshToken: refreshToken,
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
        } else if (!credentials?.password) {
          throw new Error("Password is required");
        }

        try {
          const response = await fetch(
            `https://dev-api.trukapp.com/truk/log/login`,
            // `http://192.168.10.33:8088/truk/log/login`,    // teja ofc
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
          console.log("login response :", response);
          if (response.status === 404) {
            throw new Error("You dont have an account to login");
          } else if (response.status === 500) {
            throw new Error("Internal server occured , try after sometime...");
          }
          const user = await response.json();
          console.log("user is :", user);
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
          throw error;
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
          accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        };
      }
      const expiryToken = token.accessTokenExpires as number;
      console.log("token expires in milli secs:", expiryToken - Date.now());

      if (Date.now() < expiryToken) {
        return token;
      }

      // Access token has expired, refresh it
      try {
        const refreshedToken = await refreshAccessToken(
          token.refreshToken as string
        );
        console.log("refreshedToken", refreshedToken);
        return {
          ...token,
          accessToken: refreshedToken.accessToken,
          accessTokenExpires: refreshedToken.accessTokenExpires,
          refreshToken: token.refreshToken,
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
      session.expires = new Date(
        Number(token.accessTokenExpires)
      ).toISOString();
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
    // maxAge: 1* 60, // 1 minute
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
