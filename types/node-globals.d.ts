// Minimal Node globals to appease VS Code when @types/node isn't present
// Prefer installing dev deps for full typings; this is a lightweight fallback for editor linting.

// Basic NodeJS namespace and types used in the codebase
declare namespace NodeJS {
  interface ProcessEnv { [key: string]: string | undefined }
  interface Process {
    env: ProcessEnv;
    cwd(): string;
    exit(code?: number): never;
  }
  interface Timeout {}
}

// Common Node globals
interface NodeRequire { (id: string): any }
declare var require: NodeRequire;
declare var module: any;
declare var __dirname: string;
declare var __filename: string;
declare var process: NodeJS.Process;

// Timers (Node or DOM-like) used in code
declare function setTimeout(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): any;
declare function clearTimeout(timeoutId: any): void;
declare function setInterval(handler: (...args: any[]) => void, timeout?: number, ...args: any[]): any;
declare function clearInterval(intervalId: any): void;

// Buffer is used for media upload
declare var Buffer: any;

// Minimal global console for logging in environments without DOM lib typings
declare var console: {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug?: (...args: any[]) => void;
};

// Minimal global fetch to satisfy editor/tsc when DOM lib types aren't present
declare function fetch(input: any, init?: any): Promise<any>;

// Minimal ambient module for Node built-in 'crypto' to satisfy default import in editor
declare module 'crypto' {
  const _default: any;
  export default _default;
}
