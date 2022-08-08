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

export function request(url: string, method: string, body?: object) {
    return (fetch(`http://localhost:1111/${url}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).then(response => response.json())
    );
}


export const filter = [
    {
        name: 'Brand',
        contain: ['Ikea', 'Akei']
    },
    {
        name: 'Size',
        contain: ['small', 'medium', 'big'],
    },
    {
        name: 'Material',
        contain: ['wood', 'metal', 'plastic', 'leather']
    },
    {
        name: 'Price',
        contain: []
    }
]

const array1 = ['ators', 'same']
const array2 = ['ators']


const isArraysEqual = (arr1: string[], arr2: string[]): boolean => {
    let result = true
    arr1.forEach((el, index) => {
        if (el !== arr2[index]) result = false
    })
    return result
}

export const materialCheck = (filter: string[], dataMaterial: string[]): boolean => {
    if (filter.length === 0) return true
    let result = false
    filter.forEach((el) => {

        if (dataMaterial.includes(el)) result = true

    })
    return result
}
export const sizeCheck = (filter: string[], dataSize: string): boolean => {
    if (filter.length === 0) return true
    let result = false
    filter.forEach((el) => {

        if (dataSize.includes(el)) result = true

    })
    return result
}

export const brandCheck = (filter: string[], dataBrand: string): boolean => {
    if (filter.length === 0) return true
    let result = false
    filter.forEach((el) => {
        if (dataBrand.includes(el)) result = true
    })
    return result
}

// export const dataImage = (image: string) => {
//     return 'data:image/jpeg;base64,' + image
// }

// export const check = (id: string) => {
//     return Boolean(getLocalStorageCart().find(el => id === el.id))
// }



// export const changeCartContaining = (id: string, isDeleting: boolean, cartIndex: number): CartEntry[] => {
//     let newCart: CartEntry[] = getLocalStorageCart()
//     if (!isDeleting) {
//         (cartIndex === -1) ?
//             newCart.push(
//                 {
//                     id,
//                     quantity: 1,
//                 }
//             )
//             :
//             newCart[cartIndex] = {
//                 id,
//                 quantity: newCart[cartIndex].quantity + 1
//             }
//     } else {
//         (newCart[cartIndex].quantity === 1) ?
//             newCart.splice(cartIndex, 1)
//             :
//             newCart[cartIndex] = {
//                 id,
//                 quantity: newCart[cartIndex].quantity - 1
//             }
//     }
//     return newCart
// }


// export const getLocalStorageCart = (): CartEntry[] => {
//     const currentCart = localStorage.getItem('cart');

//     if (currentCart === null) return []
//     const changeKey = JSON.parse(currentCart);
//     return changeKey
// }


// const getQuantity = (id: string) => {
//     const el = cart.find(el => el.id === id)
//     if (el) return el.quantity
//     return 0
// }
