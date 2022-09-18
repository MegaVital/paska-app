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

// class Service1 {
//     public variable1: boolean = true
//     variable2: number

//     constructor(arg1: number) {
//         this.variable2 = arg1
//     }

//     changeVariable1 = () => {
//         this.variable2 = 50
//     }
// }

// class Service2 extends Service1 {
//     var3: boolean
//     constructor() {
//         super(10)
//         this.var3 = this.variable1
//     }

//     changeVar3 = () => {
//         this.var3 = this.variable1
//     }
// }
// export const serviceVariavle1 = new Service1(50)
// serviceVariavle1.variable1
// export const serviceVariavle2 = new Service1(10)
// serviceVariavle2.variable1
// export default Service1