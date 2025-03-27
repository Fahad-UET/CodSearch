// setBoard: (board: Board | null) => {
//      if (board) {
//        // Initialize default lists if none exist
//        const defaultLists: List[] = board.lists || [];
 
//        // Initialize products from board
//        const boardProducts = board.products || [];
//        const existingProducts = get().products;
 
//        // Combine board products with existing products, prioritizing board versions
//        const combinedProducts = [
//          ...boardProducts,
//          ...existingProducts.filter(p => !boardProducts.find(bp => bp.id === p.id)),
//        ];
 
//        set({
//          board,
//          lists: defaultLists,
//          products: combinedProducts,
//        });
//      } else {
//        // Keep existing products when clearing board
//        const existingProducts = get().products;
//        set({
//          board: null,
//          lists: [],
//          products: existingProducts,
//        });
//      }
//    },
//    addList: (list) =>
//      set((state) => ({
//        lists: [...state.lists, list],
//        board: state.board ? {
//          ...state.board,
//          lists: [...state.lists, list]
//        } : null
//      })),