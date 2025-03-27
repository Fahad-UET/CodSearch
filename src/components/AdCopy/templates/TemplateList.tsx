import React from 'react';
import { Edit2, Trash2, Eye, Tag } from 'lucide-react';
import { Template } from '../../../types/templates';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase';
import { TextsList } from '../TextsList';

export const TemplateList = () => {
  return (
    <div className="space-y-8">
      <TextsList />
    </div>
  );
};