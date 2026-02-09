// Minimal Jest type shims for editor-only IntelliSense without @types/jest
// These are intentionally loose; real typings come from devDependencies when installed.
declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => any, timeout?: number): void;

// Support test() and test.each()
declare namespace _jestInternalShim {
	type EachTable<T> = ReadonlyArray<T>;
	interface TestEachFn {
		<T>(cases: EachTable<T>): (name: string, fn: (arg: T) => any) => void;
	}
}

declare const test: {
	(name: string, fn: () => any, timeout?: number): void;
	each: _jestInternalShim.TestEachFn;
};

declare function beforeAll(fn: () => any, timeout?: number): void;
declare function beforeEach(fn: () => any, timeout?: number): void;
declare function afterAll(fn: () => any, timeout?: number): void;
declare function afterEach(fn: () => any, timeout?: number): void;

declare var expect: any;
declare function fail(message?: string): never;

// Minimal Jest ambient types to silence VS Code when @types/jest isn't installed locally
// These are intentionally partial; the project uses Jest at runtime with dev deps.
// If full typings are needed, install dev deps or run `npm run deps:ensure`.
declare namespace jest {
	interface Matchers<R> {
		toBeTruthy(): R;
		toBeFalsy(): R;
		toEqual(expected: any): R;
		toMatchSnapshot(): R;
	}

	interface Mock {
		(...args: any[]): any;
		mockImplementation(fn: (...args: any[]) => any): Mock;
		mockResolvedValue(value: any): Mock;
		mockRejectedValue(value: any): Mock;
		mockReturnValue(value: any): Mock;
		mock: { calls: any[] };
	}

	interface JestLike {
		fn<T extends (...args: any[]) => any = (...args: any[]) => any>(impl?: T): Mock;
		mock: (moduleName: string, factory?: any) => void;
		clearAllMocks(): void;
		clearAllTimers(): void;
		useRealTimers(): void;
		useFakeTimers(): void;
		spyOn(obj: any, key: string): Mock;
	}
}

// Provide a value-like `jest` for sites that call jest.fn(), jest.mock(), etc.
// This is only a shim; runtime behaviors come from real Jest when running tests.
declare const jest: jest.JestLike;

// Avoid re-declaring globals if real @types/jest is present
