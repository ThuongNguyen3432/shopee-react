import { createContext, useContext, useState } from 'react';

const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [showLogin, setShowLogin] = useState(false);
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);
  return (
    <LoginContext.Provider value={{ showLogin, setShowLogin, openLogin, closeLogin }}>
      {children}
    </LoginContext.Provider>
  );
}

export const useLogin = () => useContext(LoginContext);
