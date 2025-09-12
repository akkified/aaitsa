export function createClient() {
  return {
    auth: {
      signOut: async () => {
        // Mock signout
        if (typeof window !== "undefined") {
          localStorage.removeItem("user")
          localStorage.removeItem("isAuthenticated")
        }
        return { error: null }
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        // Mock login
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify({ email }))
          localStorage.setItem("isAuthenticated", "true")
        }
        return {
          data: { user: { email } },
          error: null,
        }
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        // Mock signup
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify({ email }))
          localStorage.setItem("isAuthenticated", "true")
        }
        return {
          data: { user: { email } },
          error: null,
        }
      },
      getUser: async () => {
        // Mock get user
        if (typeof window !== "undefined") {
          const user = localStorage.getItem("user")
          const isAuthenticated = localStorage.getItem("isAuthenticated")
          if (user && isAuthenticated) {
            return { data: { user: JSON.parse(user) }, error: null }
          }
        }
        return { data: { user: null }, error: null }
      },
    },
  }
}
