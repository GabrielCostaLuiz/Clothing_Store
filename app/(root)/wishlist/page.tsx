"use client"

import Loader from "@/components/Loader"
import ProductCard from "@/components/ProductCard"
import { getProductDetails } from "@/lib/actions/actions"
import { useUser } from "@clerk/nextjs"
import { use, useEffect, useState } from "react"

const Wishlist = () => {
  const { user } = useUser()
 
  const [loading, setLoading] = useState(true)
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null)
  const [wishlist, setWishlist] = useState<ProductType[]>([])
  const [errorMessage, setErrorMessage] = useState('');

  const getUser = async () => {
    try {
      const res = await fetch("/api/users")
      if(res.status === 401) {
        setErrorMessage('Erro na busca da wishlist, atualize a página');
        return;
      }
      const data = await res.json()
      setSignedInUser(data)
    } catch (err) {
      console.log("[users_GET]", err)
      setErrorMessage('Erro na busca da wishlist, atualize a página');
    }  finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      getUser()
    }
  }, [user])

  const getWishlistProducts = async () => {
    setLoading(true)

    if (!signedInUser || !signedInUser.wishlist) {
      setLoading(false)
      return
    }

    const wishlistProducts = await Promise.all(signedInUser.wishlist.map(async (productId) => {
      const res = await getProductDetails(productId)
      return res
    }))

    setWishlist(wishlistProducts)
    setLoading(false)
  }

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts()
    }
  }, [signedInUser])

  const updateSignedInUser = (updatedUser: UserType) => {
    setSignedInUser(updatedUser)
  }

  if(errorMessage) return (
<div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Sua lista de desejos</p>
      <p>{errorMessage}</p>
    </div>

  );

  return loading ? <Loader /> : (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">Sua lista de desejos</p>
      {wishlist.length > 0 ? (<div className="flex flex-wrap justify-center gap-16">
      {wishlist.map((product) => (
        <ProductCard key={product._id} product={product} updateSignedInUser={updateSignedInUser}/>
      ))}
    </div>
        
      ) : ( <p>Nenhum item na sua lista de desejos</p>)}

     
    </div>
  )
}

export const dynamic = "force-dynamic";

export default Wishlist