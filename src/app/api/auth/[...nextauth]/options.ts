import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    // name: string;
    // phone: string;
    accessToken: string;
    refreshToken: string;
  }

  interface Session {
    user: User;
    error: string;
  }

  interface JWT {
    id: string;
    // name: string;
    // phone: string;
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
      // `http://192.168.225.172:8088/truk/log/refresh-token`,  // teja local
      `http://192.168.31.37:8088/truk/log/refresh-token`, //Vamsi local

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
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,       // in milli seconds

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
          console.log("qwerty");
          const response = await fetch(
            'http://192.168.225.172:8088/truk/log/login',    //teja local
            // `http://192.168.31.37:8088/truk/log/login`, //Vamsi local
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
          console.log("Signin response status:", response.status);

          if (!response.ok) {
            console.log("invalid phone number");
            throw new Error("Invalid phone number or password");
          }

          const user = await response.json();
          console.log("User details received from login API:", user);
          if (user && user.accessToken) {
            return {
              id: user.profile_id,
              // name: user.user.first_name,
              // phone: user.user.mobile,
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
      console.log("token :", token);
      // Initial sign-in
      if (user) {
        return {
          id: user.id,
          // name: user.name,
          // phone: user.phone,
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
        // name: token.name as string,
        // phone: token.phone as string,
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
   maxAge: 24 * 60 * 60, //must return here in seconds
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};
