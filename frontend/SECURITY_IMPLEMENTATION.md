# Authentication and Security Overview

This application protects admin pages using a small set of client-side checks. The goal is to keep the code easy to follow while still preventing unauthenticated access.

## AuthContext
- Stores the logged in user and JWT token.
- On page load and whenever navigation occurs, the context verifies that the saved token has not expired. If verification fails the user state is cleared.
- The `logout` function simply clears the token and user state.

## ProtectedRoute
- Wraps routes that require authentication.
- Redirects to `/login` when no user is logged in.
- If a `requiredRole` is provided, the component checks the user's roles before rendering children.

## useSecurityMonitor
- Lightweight hook used by `App.jsx` to react to auth changes.
- When navigation happens and the user is not authenticated, it navigates to `/login`.

The previous implementation performed aggressive cache and history manipulation. Those steps have been removed to keep navigation predictable and easier to maintain.
