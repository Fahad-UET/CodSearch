import React from 'react';
import TopBar from './TopBar';
import  AiBot from '../AiBot'


interface LayoutProps {
  children: React.ReactNode;
  onNavigateHome?: () => void;
  setShowNotes?: (val: boolean) => void;
  setShowCalculator?: (val: boolean) => void;
  setshowHabitTracker?: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onNavigateHome,
  setShowNotes,
  setShowCalculator,
  setshowHabitTracker,
}) => {
  return (
    <div className="min-h-screen">
      <TopBar
        onNavigateHome={onNavigateHome}
        setShowNotes={setShowNotes}
        setShowCalculator={setShowCalculator}
        setshowHabitTracker={setshowHabitTracker}
      />
      <div className="pt-12">{children}</div>
      <AiBot/>
    </div>
  );
};

export default Layout;
