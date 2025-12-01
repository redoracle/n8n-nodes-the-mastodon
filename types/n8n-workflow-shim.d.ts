// Minimal editor-only shim for 'n8n-workflow' to avoid TS resolution errors in VS Code
// Real, complete types come from the dependency when devDependencies are installed.
// This shim is intentionally permissive and should not affect actual builds.
declare module 'n8n-workflow' {
  export type IDataObject = Record<string, any>;
  export type JsonObject = Record<string, any>;
  export type IHttpRequestMethods = any;
  export type IRequestOptions = any;
  export type ICredentialTestRequest = any;
  export type ICredentialDataDecryptedObject = any;
  export type INodeCredentialTestResult = any;
  export type IAuthenticate = any;
  export type Icon = any;
  export type IHttpRequestHelper = any;
  export interface ICredentialType extends Record<string, any> {}

  export interface INodeExecutionData {
    json: IDataObject;
    binary?: Record<string, any>;
  }

  export type IBinaryKeyData = Record<string, any>;

  export interface IExecuteFunctions {
    getNodeParameter(name: string, index: number, defaultValue?: any): any;
    getNode(): any;
    getInputData(): INodeExecutionData[];
    continueOnFail(): boolean;
    getCredentials(name: string): Promise<any>;
    helpers: any;
  }

  export interface INodeProperties extends Record<string, any> {}
  export interface INode extends Record<string, any> {}
  export interface INodeType extends Record<string, any> {}
  export interface INodeTypeDescription extends Record<string, any> {}
  export type NodeExecutionWithMetadata = any;

  export class NodeOperationError extends Error {
    constructor(node: any, message: string, options?: any);
  }

  export class NodeApiError extends Error {
    constructor(node: any, response: any, options?: any);
  }

  export const LoggerProxy: any;
}
