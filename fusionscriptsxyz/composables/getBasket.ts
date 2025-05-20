import { useBasketStore } from "~/stores/basket"

export default async function getBasket() {
    const toast = useToast()
    const token = useRuntimeConfig().public.tebexApiKey
    const basket = localStorage.getItem('fs-basket')
    if (!basket) {
        toast.add({
            title: 'Redirecting',
            description: 'Redirecting to FiveM login',
            color: 'primary',
            icon: 'i-heroicons-exclamation-circle',
        })
        // https://headless.tebex.io/api/accounts/{token}/baskets

        const response = await fetch(`https://headless.tebex.io/api/accounts/${token}/baskets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                complete_url: window.location.href + '?complete=true',
                cancel_url: window.location.href + '?cancel=true',
                complete_auto_redirect: true,
            }),
        })
        const data = await response.json()

        // https://headless.tebex.io/api/accounts/{token}/baskets/{basketIdent}/auth?returnUrl={returnUrl}
        const returnUrl = window.location.href
        const basketIdent = data.data.ident
        localStorage.setItem('fs-basket', basketIdent)
        // const authUrl = `https://headless.tebex.io/api/accounts/${token}/baskets/${basketIdent}/auth?returnUrl=${returnUrl}`
        const authUrl = await fetch(`https://headless.tebex.io/api/accounts/${token}/baskets/${basketIdent}/auth?returnUrl=${returnUrl}`)
        const authData = await authUrl.json()
        window.location.href = authData[0].url
        return false
    } else {
        // https://headless.tebex.io/api/accounts/{token}/baskets/{basketIdent}
        const response = await fetch(`https://headless.tebex.io/api/accounts/${token}/baskets/${basket}`)
        const data = await response.json()
        useBasketStore().setBasket(data)

        const imageResponse = await fetch(`https://forum.cfx.re/u/${data.data.username}.json`)
        const imageData = await imageResponse.json()
        const imgUrl = imageData.user.avatar_template.replace('{size}', '128')
        useBasketStore().setImage(imgUrl)
        return data
    }
}