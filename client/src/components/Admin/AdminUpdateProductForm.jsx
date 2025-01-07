import useLoader from '../../customHooks/loader'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Loader from '../Loader'
import api from '../../api/api'
import AdminForm from './AdminForm'

function AdminUpdateProductForm() {
    const [product, setProduct] = useState(null)
    const {productId} = useParams()
    const {loading, error, withLoader} = useLoader()

    const getProductDetails = async () => {
        await withLoader(async () => {
            const product = await api.getProductById(productId)
            setProduct(product)
        })
    }

    useEffect(() => {
        getProductDetails()
    }, [])


    if(loading) return <Loader />
    if(error) return <div>{error}</div>


  return (
    <div>
        <AdminForm product={product} />
      
    </div>
  )
}

export default AdminUpdateProductForm
