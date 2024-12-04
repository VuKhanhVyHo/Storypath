// Reference: https://stackoverflow.com/questions/41030361/how-to-update-react-context-from-inside-a-child-component

/**
 * This file handle the project_id across files.
 */
import React, { createContext, useContext, useState } from 'react';
const projectContext = createContext(
  {
    project_id: 'project_id', 
    setProjectId: () => {} 
  }
);

export const useProjectId = () => useContext(projectContext);
export const IdProvider = ({ children }) => {
  const [project_id, setProjectId] = useState('project_id'); 

  return (
    <projectContext.Provider value={{ project_id, setProjectId }}>
      {children}
    </projectContext.Provider>
  );
};
