// Structure de la base de données Firebase
export interface FirebaseSchema {
  users: {
    [userId: string]: {
      // Profil utilisateur
      firstName?: string;
      lastName?: string;
      email: string;
      photoURL?: string;
      
      // Collections imbriquées
      boards: {
        [boardId: string]: {
          name: string;
          lists: {
            [listId: string]: {
              title: string;
              order: number;
            }
          };
          products: {
            [productId: string]: {
              title: string;
              description: string;
              status: string;
              order?: number;
              images: string[];
              videoLinks: string[];
              voiceRecordings: string[];
              descriptions: string[];
              purchasePrice: number;
              salePrice: number;
              weight: number;
              createdAt: Date;
              updatedAt: Date;
            }
          };
          members: {
            email: string;
            role: 'owner' | 'editor' | 'viewer';
            joinedAt: Date;
          }[];
          createdAt: Date;
          updatedAt: Date;
        }
      };
      
      // Charges mensuelles
      monthlyCharges: {
        [chargeId: string]: {
          name: string;
          amount: number;
          quantity?: number;
          period: 'daily' | 'weekly' | 'monthly' | 'yearly';
          description?: string;
          categoryId: string;
          subcategoryId: string;
          isActive: boolean;
          createdAt: Date;
          updatedAt: Date;
        }
      };
      
      // Catégories de charges
      chargeCategories: {
        [categoryId: string]: {
          label: string;
          isActive: boolean;
          subcategories: {
            [subcategoryId: string]: {
              label: string;
              isActive: boolean;
              createdAt: Date;
              updatedAt: Date;
            }
          };
          createdAt: Date;
          updatedAt: Date;
        }
      };
    }
  }
}