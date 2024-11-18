export type FormatAndValidateInput<T> = (input: string | undefined) => Promise<{
    resultFormattedValidated: T | null;
    isResultValid: boolean;
}>;
export type GetMessageResultInvalid = (result: string) => Promise<string>;
export type GetMessageDone = (result: string) => Promise<string>;


