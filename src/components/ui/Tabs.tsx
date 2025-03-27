import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, children }) => {
  return <div className="space-y-4">{children}</div>;
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className, children }) => {
  return (
    <div className={`flex rounded-lg bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  return (
    <button
      className="flex-1 px-3 py-2 text-sm font-medium rounded-md
                 data-[state=active]:bg-white data-[state=active]:text-blue-600
                 data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800"
      data-state={value === 'text' ? 'active' : 'inactive'}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  return (
    <div className="mt-4 rounded-lg border border-gray-200 p-4">
      {children}
    </div>
  );
};