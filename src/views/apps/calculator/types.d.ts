
export interface Product {
   name_product: string;
   description: string;
   total_cost: number;
   profit_margin: number;
   image: string;
}

export interface Calculation {
   id_product: number;
   price_sale: number;
   nominal_profit: number;
   working_capital: number;
}

export interface Parameters {
  free_shipping_program: string;
  marketplace_commission: number;
  tax_rate: number;
  other_fees: number;
}
