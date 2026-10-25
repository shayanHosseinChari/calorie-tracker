export interface Food {
  id: number;
  name: string;
  calories: number;
}

export interface FoodListParams {
  limit?: number;  
  offset?: number; 
}