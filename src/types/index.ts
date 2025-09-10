export type Theme = 'gifts' | 'tech';
export type Category = 'regalos' | 'tecnologia';

export interface Product {
  id: string | number;
  name: string;
  price: string;
  image: string;
  images?: string[];
  category: 'gifts' | 'tech';
  description: string;
  createdAt?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
  };
}