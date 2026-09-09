export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  before_url: string | null;
  after_url: string | null;
  before_urls: string[] | null;
  after_urls: string[] | null;
  after_filter?: string | null;
  zip_url: string | null;
  lemon_link: string | null;
  is_bundle: boolean;
  created_at: string;
}
