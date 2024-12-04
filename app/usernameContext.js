// Reference: https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component
/**
 * This file handle username state across files. 
 */
import React, { createContext, useContext, useState } from 'react';
const UsernameContext = createContext(
  {
    username: 'participant_username', 
    setUsername: () => {} 
  }
);

export const useUsername = () => useContext(UsernameContext);
export const UsernameProvider = ({ children }) => {
  const [username, setUsername] = useState('participant_username'); 

  return (
    <UsernameContext.Provider value={{ username, setUsername }}>
      {children}
    </UsernameContext.Provider>
  );
};
