export default async function addToCart(itemId: string) {
    const toast = useToast()
    const token = useRuntimeConfig().public.tebexApiKey
    const basket = await useBasketStore().getBasket
    if (basket) {
        // https://headless.tebex.io/api/baskets/{basketIdent}/packages
        const response = await fetch(`https://headless.tebex.io/api/baskets/${basket.data.ident}/packages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                package_id: itemId,
                quantity: 1,
            }),
        })
        if (response.ok) {
            const data = await response.json()
            useBasketStore().setBasket(data)
            toast.add({
                title: 'Success',
                description: 'Item added to basket',
                color: 'fscyan',
            })
        } else {
            toast.add({
                title: 'Something went wrong',
                description: 'Item not added to basket',
                color: 'primary',
            })
        }
    } else {
        const basket = await getBasket()
        if (basket) {
            const response = await fetch(`https://headless.tebex.io/api/baskets/${basket.data.ident}/packages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    package_id: itemId,
                    quantity: 1,
                }),
            })
            if (response.ok) {
                const data = await response.json()
                useBasketStore().setBasket(data)
                toast.add({
                    title: 'Success',
                    description: 'Item added to basket',
                    color: 'fscyan',
                })
            } else {
                toast.add({
                    title: 'Something went wrong',
                    description: 'Item not added to basket',
                    color: 'primary',
                })
            }
        }
    }
}