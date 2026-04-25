export interface Category {
  id: string;
  legacy_id?: string;
  name: string;
  parent_id?: string;
  description?: string;
  image_url?: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryDto {
  name: string;
  parent_id?: string;
  description?: string;
  image_url?: string;
  order_number?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  parent_id?: string;
  description?: string;
  image_url?: string;
  order_number?: number;
}