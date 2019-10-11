import { Action } from "@ngrx/store";

/**
 * Initialize - stands for initialization of the app
 */
export enum CommonActionTypes {
    Initialize = "[Common] INITIALIZE"
}

export class Initialize implements Action {
    public readonly type = CommonActionTypes.Initialize;
}

export type CommonActions = Initialize;
