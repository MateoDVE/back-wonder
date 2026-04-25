export interface Product {
  id: string;
  legacy_id?: string;
  code: string;
  reference?: string;
  name: string;
  description?: string;
  price_sell: number;
  category_id: string;
  tax_category_id?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  legacy_id?: string;
  code: string;
  reference?: string;
  name: string;
  description?: string;
  price_sell: number;
  category_id: string;
  tax_category_id?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateProductDto {
  code?: string;
  reference?: string;
  name?: string;
  description?: string;
  price_sell?: number;
  category_id?: string;
  tax_category_id?: string;
  image_url?: string;
  is_active?: boolean;
}