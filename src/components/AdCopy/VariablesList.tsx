// @@ .. @@
// +  const [selectedCategory, setSelectedCategory] = useState<string>('all');
// +  const { variables } = useVariableStore();

// +  const filteredVariables = selectedCategory === 'all'
// +    ? variables
// +    : variables.filter(v => v.category === selectedCategory);

// +  return (
// +    <div className="space-y-4">
// +      {/* Category Filter */}
// +      <div className="flex gap-2 overflow-x-auto">
// +        <button
// +          onClick={() => setSelectedCategory('all')}
// +          className={`px-4 py-2 rounded-lg text-sm font-medium ${
// +            selectedCategory === 'all'
// +              ? 'bg-purple-100 text-purple-700'
// +              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// +          }`}
// +        >
// +          All Variables
// +        </button>
// +        {VARIABLE_CATEGORIES.map(category => (
// +          <button
// +            key={category.id}
// +            onClick={() => setSelectedCategory(category.id)}
// +            className={`px-4 py-2 rounded-lg text-sm font-medium ${
// +              selectedCategory === category.id
// +                ? 'bg-purple-100 text-purple-700'
// +                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
// +            }`}
// +          >
// +            {category.name}
// +          </button>
// +        ))}
// +      </div>

// +      {/* Variables Grid */}
// +      <div className="grid grid-cols-2 gap-4">
// +        {filteredVariables.map(variable => (
// +          <button
// +            key={variable.id}
// +            onClick={() => onSelectVariable(variable.name)}
// +            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 text-left transition-all"
// +          >
// +            <div className="flex items-center gap-2 mb-2">
// +              <Variable size={16} className="text-purple-600" />
// +              <span className="font-medium text-gray-900">{variable.name}</span>
// +            </div>
// +            {variable.description && (
// +              <p className="text-sm text-gray-500">{variable.description}</p>
// +            )}
// +            <p className="text-sm font-medium text-purple-600 mt-2">
// +              Current value: {variable.value}
// +            </p>
// +          </button>
// +        ))}
// +      </div>
// +    </div>
// +  );
