export interface CatalogueEntry {
    id: string,
    title: string
    description: string
    price: number
    image: string
    material: string[]
    brand: string
    size: string
}

export interface CartEntry {
    id: string
    quantity: number
}

export interface DataFilters {
    Brand: string[],
    Size: string[],
    Material: string[]
}
export interface RegistrationFields {
    name: string,
    email: string,
    password: string,
    passwordCheck: string;
}
export interface LogInFields {
    nameOrEmail: string
    password: string
}
export interface blurInitialStateInterface {
    name: boolean,
    email: boolean,
    password: boolean,
    passwordCheck: boolean,
}
export interface ErrorState {
    nameError: boolean,
    emailError: boolean,
    passwordError: boolean
}