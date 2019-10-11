import { Injectable } from "@angular/core";

@Injectable()
export class ModifyLocalStorageService {
    /**
     * Get information from store according to provided key
     *
     * @param key - stands for localStorage key
     */
    public getInfoFromLocalStorage(key: string): any {
        return JSON.parse(window.localStorage.getItem(key));
    }

    /**
     * Get information to store with provided key and value
     *
     * @param key - stands for localStorage key
     * @param value - stores the data connected with provided key
     */
    public setInfoToLocalStorage(key: string, value: any): void {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}
