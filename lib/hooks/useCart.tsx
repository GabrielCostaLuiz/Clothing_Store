import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string; // ? means optional
  size?: string; // ? means optional
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string, color?: string, size?: string) => void;
  increaseQuantity: (idToIncrease: string, color?: string, size?: string) => void;
  decreaseQuantity: (idToDecrease: string, color?: string, size?: string) => void;
  clearCart: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, color, size } = data;
        const currentItems = get().cartItems; // all the items already in cart
        const isExisting = currentItems.find(
          (cartItem) =>
            cartItem.item._id === item._id &&
            cartItem.color === color &&
            cartItem.size === size
        );

        if (isExisting) {
          return toast("Item já no carrinho");
        }


        set({ cartItems: [...currentItems, { item, quantity, color, size }] });
        toast.success("Item adicionado ao carrinho", { icon: "🛒" });
      },
      removeItem: (idToRemove: string, color?: string, size?: string) => {
        const newCartItems = get().cartItems.filter((cartItem) => {
          // Verifica se o ID, cor e tamanho correspondem antes de remover o item
          return (
            cartItem.item._id !== idToRemove ||
            (color && cartItem.color !== color) ||
            (size && cartItem.size !== size)
          );
        });
        set({ cartItems: newCartItems });
        toast.success("Item removido do carrinho");
      },      
      increaseQuantity: (idToIncrease: String, color?: String, size?: String) => {

        const newCartItems = get().cartItems.map((cartItem) => {
          if (
            cartItem.item._id === idToIncrease &&
            cartItem.color === color &&
            cartItem.size === size
          ) {
            return { ...cartItem, quantity: cartItem.quantity + 1 };
          } else {
            return cartItem;
          }
        });
        set({ cartItems: newCartItems });
        toast.success("Quantidade de itens aumentada");
      },
      decreaseQuantity: (idToDecrease: String, color?: String, size?: String) => {
        const newCartItems = get().cartItems.map((cartItem) => {
          if (
            cartItem.item._id === idToDecrease &&
            cartItem.color === color &&
            cartItem.size === size &&
            cartItem.quantity > 1 // Ensure the quantity is greater than 1 before decrementing
          ) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          } else {
            return cartItem;
          }
        });
        set({ cartItems: newCartItems });
        toast.success("Quantidade de itens diminuída");
      },
      
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;

