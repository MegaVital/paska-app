import { createContext } from "react";

export const ColorModeContext = createContext({
    toggleColorMode: () => {
        // This is intentional
    },
});

export interface CartActions {
    cartChanges: 'create' | 'addQuantity' | 'remove' | 'reduceQuantity';
}

export const changeCartContaining = (isElementQuantitySingle: boolean, isDeleting: boolean, cartIndex: number): CartActions['cartChanges'] => {
    let result: CartActions['cartChanges']
    if (!isDeleting) {
        (cartIndex === -1) ?
            result = 'create'
            :
            result = 'addQuantity'
    } else {
        (isElementQuantitySingle) ?
            result = 'remove'
            :
            result = 'reduceQuantity'
    }
    return result
}

export function request(url: string, method: string, body?: object, token?: string) {
    return (fetch(`http://localhost:1111/${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
    }).then(response => response.json())
    );
}

export const filter = [
    {
        name: 'Brand',
        contain: ['Ikea', 'Star', 'Mriya']
    },
    {
        name: 'Size',
        contain: ['small', 'medium', 'big'],
    },
    {
        name: 'Material',
        contain: ['wood', 'metal', 'plastic', 'leather', 'glass']
    },
    {
        name: 'Price',
        contain: []
    }
]

export const materialCheck = (filter: string[], dataMaterial: string[]): boolean => {
    if (filter.length === 0) return true
    let result = false
    filter.forEach((el) => {

        if (dataMaterial.includes(el)) result = true

    })
    return result
}

interface UsePaginationProps {
    contentPerPage: number,
    count: number,
}
interface UsePaginationReturn {
    page: number;
    totalPages: number;
    firstContentIndex: number;
    lastContentIndex: number;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
}
export type UsePagination = (arg0: UsePaginationProps) => (UsePaginationReturn);