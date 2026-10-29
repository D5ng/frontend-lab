import { type SubmitEventHandler, useState } from 'react'
import { products } from '../apis/products'
import { getSelectedProducts } from '../models/products'
import type { Product, ProductFilter, ReservationResult, ReserveProducts } from '../types/reservation'

export function useProductReservation(reserveProducts: ReserveProducts) {
  const [selectedFilter, setSelectedFilter] = useState<ProductFilter>('all')
  const [selectedIds, setSelectedIds] = useState<Product['id'][]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<ReservationResult | null>(null)

  const selectedProducts = getSelectedProducts(products, selectedIds)
  const totalPrice = selectedProducts.reduce((sum, product) => sum + product.price, 0)

  const submitDisabled = isSubmitting || selectedProducts.length === 0

  const handleProductSelectionChange = (productId: Product['id'], checked: boolean) => {
    setSelectedIds((prevIds) => (checked ? [...prevIds, productId] : prevIds.filter((id) => id !== productId)))
    setResult(null)
  }

  const handleFilterChange = (value: ProductFilter) => {
    setSelectedFilter(value)
    setResult(null)
  }

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    if (submitDisabled) {
      return
    }

    setIsSubmitting(true)
    setResult(null)

    try {
      await reserveProducts({
        productIds: selectedProducts.map((product) => product.id),
        totalPrice,
      })
      setResult('success')
      setSelectedIds([])
    } catch {
      setResult('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    totalPrice,
    selectedProducts,
    selectedFilter,
    selectedIds,
    isSubmitting,
    submitDisabled,
    result,
    handleProductSelectionChange,
    handleFilterChange,
    handleSubmit,
  }
}
