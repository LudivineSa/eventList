export interface FormInput {
    name: string;
    quantity: number;
    who: string; 
    id: string;
    needed?: boolean;
}

export interface FormNeededInput {
    name: string;
    quantity: number;
    id: string;
    who?: string; 
}

export interface UserLogin {
    email: string;
    password: string; 
    uid?: string;
}

export interface User {
    uid: string;
    email: string;
    accessToken: string;
}

export interface Event {
    uid: string;
    name: string;
}