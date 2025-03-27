import { ProductCardProps } from './types';
import { TaskList } from './TaskList';
import { downloadProductCSV } from '../../utils/csvExport';
import { Download, Info } from 'lucide-react';
import { CardHeader } from './components/CardHeader';
import { CardImage } from './components/CardImage';
import { ImageSection } from './ImageSection';

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-[3px] border-gray-200">
      <CardHeader category={product?.category} icon={product?.icon} title={product?.title} />
      <CardImage image={product.images} />
      <ImageSection product={product} images={product.images} />
      
      <TaskList tasks={product.tasks} />
      
      {/* Download Button */}
      <button
        onClick={() => downloadProductCSV(product)}
        className="flex items-center justify-center w-full py-2 mt-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4 mr-2" />
        Export Data
      </button>
      
      <div className="flex justify-between mt-2 border-t pt-2">
        <button className="text-sm text-gray-600 hover:text-gray-900">
          <Info className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};