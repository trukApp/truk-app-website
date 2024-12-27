import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    phone: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id: string;
    name: string;
    phone: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
const refreshAccessToken = async (refreshToken: string) => {
  console.log(
    "Attempting to refresh access token with refresh token:",
    refreshToken
  );
  try {
    const response = await fetch(
      `https://jaimp-api.onelovepc.com/jaiMp/log/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    console.log("Refresh token API response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to refresh access token: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Token data received from refresh API:", data);
    return {
      accessToken: data.accessToken,
      // refreshToken: data.refreshToken || refreshToken,
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
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
        if (!credentials?.phone || !credentials?.password) {
          throw new Error("Phone number and password are required");
        }

        try {
          const response = await fetch(
            `https://jaimp-api.onelovepc.com/jaiMp/log/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mobile: credentials.phone,
                pin: parseInt(credentials.password),
                unq_d_id: "uniqueid",
              }),
            }
          );
          console.log("Signin response status:", response.status);

          if (!response.ok) {
            throw new Error("Invalid phone number or password");
          }

          const user = await response.json();
          console.log("User details received from login API:", user);
          if (user && user.accessToken) {
            return {
              id: user.login_id,
              name: user.name,
              phone: user.mobile,
              accessToken: user.accessToken,
              refreshToken: user.refreshToken,
            };
          }

          throw new Error("Login failed");
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Unable to login. Please try again.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.phone = user.phone;
        token.accessToken = user?.accessToken;
        token.refreshToken =user?.refreshToken;
        token.accessTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
        console.log("User signed in:", user);
      }

      // Return previous token if the access token has not expired yet
      if (token?.accessToken ) {
        console.log("Token still available");
        return token;
      }

      console.log("Access token has expired. Attempting to refresh...");

      // Access token has expired, try to update it
      if (token.refreshToken) {
        const refreshedTokens = await refreshAccessToken(user?.refreshToken);
        if (refreshedTokens && !refreshedTokens.error) {
          console.log("Access token refreshed successfully:", refreshedTokens);
          return {
            ...token,
            accessToken: refreshedTokens.accessToken,
            accessTokenExpires: refreshedTokens.accessTokenExpires,
            // refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Uncomment if refresh token is rotated
          };
        } else {
          console.error(
            "Failed to refresh access token:",
            refreshedTokens?.error
          );
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }
      }

      console.error("No refresh token available.");
      return {
        ...token,
        error: "NoRefreshTokenError",
      };
    },

    async session({ session, token }) {
      if (token.error) {
        console.error("Session error:", token.error);
        // Optionally, handle the error, e.g., sign out the user
        // throw new Error("Authentication error");
      }

      session.user = {
        id: token.id as string,
        name: token.name as string,
        phone: token.phone as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      } ;
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
    maxAge: 24 * 60 * 60, // 1 day
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
