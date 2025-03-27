import React, { useEffect, useState } from 'react';
import { Image, Video, FileText, Layout, Mic, Type } from 'lucide-react';
import NavItem from './NavItem';
import NavDropdown from './NavDropdown';
import { getAiTextByProductId } from '@/services/firebase/AITextEditor';
import { useAiTextStore } from '@/store/aiTextStore';

interface NavGroupProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  product: any;
}

export default function NavGroup({ activeTab, setActiveTab, product }: NavGroupProps) {
  const [aiText, setAiText] = useState({
    'customer-review': 0,
    'voice-over-review': 0,
    'landing-page': 0,
    'ad-copy': 0,
    'voice-over-creative': 0,
  });
  const { aiTextSt, setAiTextSt } = useAiTextStore();

  const totalVideoLinks = (product?.videoLinks?.length || 0) + (product?.links?.length || 0);

  const adCopyItems = [
    { value: 'editor', label: 'Virtual Keyboard', count: '0' },
    { value: 'templates', label: 'Templates', count: '0' },
    { value: 'variables', label: 'Variables', count: '0' },
  ];

  const voiceOverItems = [
    // { value: 'creatives', label: 'Creatives', count: aiText['voice-over-creative'] },
    // { value: 'customerReviews', label: 'Customer Reviews', count: aiText['voice-over-review'] },
  ];

  const aiTextItems = [];

  const mainItems = [
    { value: 'photos', icon: <Image />, label: 'Pictures', count: product?.images?.length || 0 },
    { value: 'videos', icon: <Video />, label: 'Videos', count: totalVideoLinks },
    {
      value: 'landingpages',
      icon: <Layout />,
      label: 'Landing Pages',
      count: product?.pageCaptures?.length || 0,
    },
  ];
  const totalAIVoiceOver =
    (aiText['voice-over-creative'] || 0) + (aiText['voice-over-review'] || 0);
  useEffect(() => {
    const getTextProduct = async productId => {
      const data = await getAiTextByProductId(productId);
      setAiTextSt(data);
    };

    if (product?.id) {
      getTextProduct(product.id);
    }
  }, [product]);

  useEffect(() => {
    const getTypeCounts = data => {
      const typeCounts = {
        'customer-review': 0,
        'voice-over-review': 0,
        'landing-page': 0,
        'ad-copy': 0,
        'voice-over-creative': 0,
      };

      // Iterate over the array and count occurrences of each type
      data &&
        data?.forEach(item => {
          if (typeCounts.hasOwnProperty(item.type)) {
            typeCounts[item.type] += 1;
          }
        });

      return typeCounts;
    };

    const counts = getTypeCounts(aiTextSt);
    setAiText(counts);
  }, [aiTextSt]);

  return (
    <div className="flex-1 flex items-center justify-start divide-x divide-white/10">
      <NavDropdown
        adCopy
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        icon={<FileText />}
        label="Text Creator"
        count="0"
        items={adCopyItems}
      />
      <NavDropdown
        aiText
        icon={<Type />}
        label="AI Text"
        count={aiTextSt.length}
        items={aiTextItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <NavDropdown
        aiVoiceOver
        icon={<Mic />}
        label="AI Voice Over"
        count={Number(totalAIVoiceOver)}
        items={voiceOverItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {mainItems.map(item => (
        <NavItem
          key={item.value}
          icon={item.icon}
          label={item.label}
          count={item.count}
          value={item.value}
          isActive={activeTab === item.value}
          handleActiveTab={() => setActiveTab(item.value)}
        />
      ))}
    </div>
  );
}
