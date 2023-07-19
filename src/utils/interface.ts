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
}