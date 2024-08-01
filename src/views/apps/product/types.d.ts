// types.d.ts
export interface Variation {
  size: string
  color: string
  stock: number
  barcode: string
}

export interface ProductData {
  name_product: string
  description: string
  variations: Variation[]
}
