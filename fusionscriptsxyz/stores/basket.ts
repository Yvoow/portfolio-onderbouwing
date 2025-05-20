export const useBasketStore = defineStore('basket', {
    state: () => ({ basket: null, image: null }),
    getters: {
      getBasket: (state) => state.basket,
      getImage: (state) => state.image
    },
    actions: {
      setBasket(basket: any) {
        this.basket = basket
      },
      setImage(image: any) {
        this.image = image
      }
    },
  })