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