import React from 'react';

export const withLogging = (WrappedComponent: React.ComponentType<any>) => {
  const logEvent = (action: string, data?: any) => {
    let logMessage;


    if (typeof data === 'object' && data !== null) {
      logMessage = `${action} with id "${data.id}" and value "${data.title}"`;
    } else {
      logMessage = `${action} with value "${data}"`;
    }

    console.groupCollapsed(logMessage);
    console.log('Data:', data);
    console.groupEnd();
  };

  return (props: any) => {
    console.log(`Rendering with props:`, props);
    return <WrappedComponent {...props} logEvent={logEvent as any} />;
  };
};