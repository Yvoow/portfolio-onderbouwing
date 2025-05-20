export default async function removeFromCart(itemId: string) {
    const toast = useToast()
    const token = useRuntimeConfig().public.tebexApiKey
    const basket = await useBasketStore().getBasket
    if (basket) {
        //https://headless.tebex.io/api/baskets/{basketIdent}/packages/remove
        const response = await fetch(`https://headless.tebex.io/api/baskets/${basket.data.ident}/packages/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                package_id: itemId,
            }),
        })
        if (response.ok) {
            const data = await response.json()
            useBasketStore().setBasket(data)
            toast.add({
                title: 'Success',
                description: 'Item removed from basket',
                color: 'fscyan',
            })
        } else {
            toast.add({
                title: 'Error',
                description: 'Failed to remove item from basket',
                color: 'primary',
            })
        }
    } else {
        toast.add({
            title: 'Error',
            description: 'Failed to remove item from basket',
            color: 'primary',
        })
    }
}