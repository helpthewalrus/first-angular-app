import { Action } from "@ngrx/store";

/**
 * Initialize - stands for initialization of the app
 */
export enum CommonActionTypes {
    Initialize = "[Common] INITIALIZE"
}

export class INITIALIZE implements Action {
    public readonly type = CommonActionTypes.Initialize;
}

export type CommonActions = INITIALIZE;
