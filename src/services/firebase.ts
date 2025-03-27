// Re-export all Firebase services
export * from './firebase/config';
export * from './firebase/auth';
export * from './firebase/profile';
export {
  getUserBoards,
  createBoard,
  createDefaultBoard,
  getOrCreateDefaultBoard,
  updateBoard,
  deleteBoard,
} from './firebase/boards';
export * from './firebase/products';
export * from './firebase/charges';
export * from './firebase/categories';
export * from './firebase/videoUrl';
