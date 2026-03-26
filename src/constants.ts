import { Song } from './types';

export const DUMMY_SONGS: Song[] = [
  {
    id: '1',
    title: 'ERR_DATA_STREAM_01',
    artist: 'SYS.ADMIN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/400/400?grayscale',
  },
  {
    id: '2',
    title: 'VOID_RESONANCE.WAV',
    artist: 'UNKNOWN_ENTITY',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/400/400?grayscale',
  },
  {
    id: '3',
    title: 'NULL_POINTER_EXCEPTION',
    artist: 'KERNEL_PANIC',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/400/400?grayscale',
  },
];

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 100;


