/// <reference types="react" />
/// <reference types="react-dom" />

// Global JSX namespace declaration for TypeScript
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
  }
}

export {};
