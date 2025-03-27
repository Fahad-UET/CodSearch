import { useState, useEffect, useMemo } from 'react';
import { Bookmark, ExternalLink, Search, Trash2, Grid, List, ArrowLeft } from 'lucide-react';
import { getSavedPages } from '@/services/firebase/savedpages';
import { useProductStore } from '@/store';
import { AddProductModal } from '@/components/AddProductModal';
import { getUserBoards } from '@/services/firebase';
// import type { SavedPage } from '../MyPages/types';

export default function Mypages({ onBack }: any) {
  const [savedPages, setSavedPages] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdProductModal, setShowAdProductModal] = useState({
    status: false,
    url: '',
    type: 'pageCaptures',
  });
  const [boards, setBoards] = useState([]);
  const { user } = useProductStore();
  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  const loadBoards = async () => {
    if (!user) return;
    try {
      const userBoards = await getUserBoards(user.uid, user.email);
      setBoards(userBoards);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Load saved pages from localStorage
    const loadSavedPages = async () => {
      const [data]: any = await getSavedPages(user.uid);
      setSavedPages(
        data?.data?.map((page: any) => ({
          ...page,
          createdAt: new Date(page.createdAt),
        }))
      );
    };

    loadSavedPages();
    window.addEventListener('storage', loadSavedPages);
    return () => window.removeEventListener('storage', loadSavedPages);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this saved page?')) {
      const newPages = savedPages?.filter(page => page.id !== id);
      localStorage.setItem('saved_pages', JSON.stringify(newPages));
      setSavedPages(newPages);
    }
  };

  const filteredPages = searchQuery
    ? savedPages?.filter(
        page =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.domain.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : savedPages;

  const getDefaultBoard = useMemo(() => {
    const defaultBoard = boards?.filter(item => item.boardType === 'default');
    return defaultBoard;
  }, [boards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1333] via-[#2d1854] to-[#341d66]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 bg-[#2d1854]/50 p-6 rounded-2xl backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-white/80 hover:text-white flex items-center gap-2
                transition-colors duration-300 hover:bg-white/5 rounded-lg p-2"
            >
              <ArrowLeft size={20} />
            </button>
            <Bookmark className="w-8 h-8 text-white" />
            <h1 className="text-3xl font-bold text-white/90">My Pages Library</h1>
            <span className="text-white/70 text-lg">
              {savedPages?.length} {savedPages?.length === 1 ? 'page' : 'pages'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search saved pages..."
                className="w-64 px-4 py-2 bg-[#1a1333]/50 text-white placeholder-white/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/30 backdrop-blur-md text-lg"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2 bg-[#1a1333]/50 rounded-xl p-1 backdrop-blur-md border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-white hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-white hover:bg-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Pages grid/list */}
        {savedPages?.length === 0 ? (
          <div className="text-center py-12 bg-[#2d1854]/30 backdrop-blur-md rounded-2xl border border-white/10">
            <p className="text-white/70 text-lg">
              No saved pages yet. Use the search page to find and save web pages.
            </p>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-6' : 'space-y-4'}`}>
            {filteredPages?.map(page => (
              <div
                key={page.id}
                className={`group bg-[#2d1854]/30 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:bg-[#2d1854]/50 hover:border-purple-500/30 ${
                  viewMode === 'grid' ? 'p-6' : 'p-4'
                }`}
              >
                <div className="flex items-end justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <a
                      href={page.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-2 text-white hover:text-white/90 transition-colors"
                    >
                      <h2 className="text-xl font-semibold truncate">{page.title}</h2>
                      <ExternalLink className="w-5 h-5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                    <p className="text-white/70 mt-2 line-clamp-2 text-lg">{page.snippet}</p>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-white/50 text-sm">
                          {new Date(page.createdAt).toLocaleDateString()}
                        </span>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm">
                          {page.domain}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setShowAdProductModal({
                            status: true,
                            url: page.url,
                            type: 'pageCaptures',
                          });
                        }}
                        className={`flex items-center gap-2 px-2 py-2 rounded-md transition-all text-white bg-[#5D1C83] shadow-lg`}
                      >
                        <span className="font-medium text-xs">Create Product</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(page.id)}
                    className="p-2 text-white/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    title="Delete page"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showAdProductModal?.status && (
        <AddProductModal
          onClose={() => {
            setShowAdProductModal({ status: false, url: '', type: 'pageCaptures' });
          }}
          listId={getDefaultBoard?.[0]?.lists?.[0]?.id}
          boardId={getDefaultBoard?.[0]?.id}
          defaultCreation
          link={showAdProductModal}
        />
      )}
    </div>
  );
}
