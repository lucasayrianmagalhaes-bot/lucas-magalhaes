
import { UserProfile } from './types';

// Mock Center (Sao Paulo region for demo)
export const DEFAULT_CENTER = { lat: -23.55052, lng: -46.633309 };

// Gamification Constants
export const XP_TO_LEVEL_UP = 100;
export const XP_PER_DELIVERY = 2;

export const MOCK_USERS: UserProfile[] = [
  {
    id: '1',
    name: 'Carlos "Flash" Silva',
    type: 'motoboy',
    status: 'available',
    location: { lat: -23.552, lng: -46.635 },
    city: 'São Paulo',
    rating: 4.9,
    rank: 'diamond',
    xp: 85,
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150',
    bio: 'Especialista em entregas rápidas na Zona Sul. Tenho baú de 80L e suporte para pizza. 5 anos de experiência e pontualidade britânica!',
    vehicleType: 'Honda CG 160',
    minRate: 15,
    maxRate: 50,
    acceptsDailyRate: true,
    completedDeliveries: 1250,
    pixKey: 'carlos@flash.com'
  },
  {
    id: '2',
    name: 'Burger Kingo',
    type: 'restaurant',
    status: 'available',
    location: { lat: -23.548, lng: -46.638 },
    city: 'São Paulo',
    rating: 4.5,
    avatar: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=150&h=150',
    bio: 'A melhor hamburgueria artesanal da região. Buscamos parceiros ágeis para entregas em até 3km.',
    cuisine: 'Hamburgueria',
    address: 'Rua Augusta, 500',
    minRate: 10,
    maxRate: 100
  },
  {
    id: '3',
    name: 'João Entregas',
    type: 'motoboy',
    status: 'busy',
    location: { lat: -23.555, lng: -46.630 },
    city: 'São Paulo',
    rating: 4.7,
    rank: 'gold',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    bio: 'Trabalho com foco em delivery de comida japonesa. Cuidado extremo com a embalagem. Conheço todos os atalhos do centro!',
    xp: 45,
    vehicleType: 'Yamaha Fazer',
    minRate: 12,
    maxRate: 40,
    acceptsDailyRate: false,
    completedDeliveries: 420
  },
  {
    id: '4',
    name: 'Sushi House',
    type: 'restaurant',
    status: 'available',
    location: { lat: -23.558, lng: -46.632 },
    city: 'São Paulo',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=150&h=150',
    cuisine: 'Japonesa',
    address: 'Av Paulista, 1000'
  },
  {
    id: '5',
    name: 'Roberto Novato',
    type: 'motoboy',
    status: 'available',
    location: { lat: -23.545, lng: -46.628 },
    city: 'São Paulo',
    rating: 5.0,
    rank: 'bronze',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    bio: 'Começando agora no BikeGO! mas com muita disposição. Moto nova e revisada.',
    xp: 10,
    vehicleType: 'Honda Biz',
    minRate: 10,
    maxRate: 30,
    acceptsDailyRate: true,
    completedDeliveries: 15
  }
];

export const RANK_COLORS = {
  bronze: 'text-orange-700 bg-orange-100 border-orange-300',
  silver: 'text-gray-600 bg-gray-100 border-gray-300',
  gold: 'text-yellow-700 bg-yellow-100 border-yellow-400',
  diamond: 'text-cyan-700 bg-cyan-100 border-cyan-400'
};

export const STATUS_COLORS = {
  available: 'bg-green-500',
  busy: 'bg-yellow-500',
  offline: 'bg-gray-400'
};
