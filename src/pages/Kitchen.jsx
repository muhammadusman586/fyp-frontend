import  { useState, useEffect } from 'react';
import { Search, Plus, Trash2, AlertCircle, Minus, Edit2, Check, X, RefreshCw, Filter, Package, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { 
  useGetInventoryQuery,
  useAddInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useUpdateQuantityMutation,
  useGetLowStockItemsQuery,
  useGetCategoryStatsQuery
} from '../redux/api/inventoryApiSlice';

const units = ['kg', 'L', 'pcs', 'g'];
const categories = ['ingredients', 'fruits', 'vegetables', 'dairy', 'meat', 'grains', 'spices'];

function Kitchen() {
  // Local state for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    category: 'ingredients', 
    quantity: 1, 
    unit: 'kg',
    lowThreshold: 1
  });
  const [editItem, setEditItem] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // API queries and mutations
  const { data: inventoryData, isLoading, error: inventoryError, refetch } = useGetInventoryQuery({ 
    keyword: searchTerm, 
    category: activeFilter 
  });
  
  const { data: lowStockData, isLoading: lowStockLoading } = useGetLowStockItemsQuery();
  const { data: categoryStatsData, isLoading: statsLoading } = useGetCategoryStatsQuery();
  
  const [addInventoryItem, { isLoading: isAddingItem }] = useAddInventoryItemMutation();
  const [updateInventoryItem, { isLoading: isUpdatingItem }] = useUpdateInventoryItemMutation();
  const [deleteInventoryItem, { isLoading: isDeletingItem }] = useDeleteInventoryItemMutation();
  const [updateQuantity, { isLoading: isUpdatingQuantity }] = useUpdateQuantityMutation();

  // Error handling for inventory data
  useEffect(() => {
    if (inventoryError) {
      toast.error('Failed to load inventory data');
      console.error(inventoryError);
    }
  }, [inventoryError]);

  const inventory = inventoryData || [];
  const lowStockItems = lowStockData || [];

  // Form handlers
  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name) return;
    
    try {
      await addInventoryItem(newItem).unwrap();
      toast.success('Item added successfully');
      setNewItem({ name: '', category: 'ingredients', quantity: 1, unit: 'kg', lowThreshold: 1 });
      setShowAddForm(false);
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to add item');
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteInventoryItem(id).unwrap();
      toast.success('Item removed successfully');
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to remove item');
      console.error(err);
    }
  };

  const startEditing = (item) => {
    setEditingId(item._id);
    setEditItem({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditItem({});
  };

  const saveEdit = async () => {
    try {
      await updateInventoryItem({
        itemId: editingId,
        itemData: editItem
      }).unwrap();
      toast.success('Item updated successfully');
      setEditingId(null);
      setEditItem({});
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to update item');
      console.error(err);
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      await updateQuantity({
        itemId: id,
        action: 'decrease',
        amount: 1
      }).unwrap();
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to update quantity');
      console.error(err);
    }
  };

  const increaseQuantity = async (id) => {
    try {
      await updateQuantity({
        itemId: id,
        action: 'increase',
        amount: 1
      }).unwrap();
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to update quantity');
      console.error(err);
    }
  };

  const isLowQuantity = (item) => item.quantity <= item.lowThreshold;

  return (
    <div 
      className="min-h-screen py-10 px-4 md:px-8"
      style={{ background: "linear-gradient(to right, #bfdbfe, #e9d5ff)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/30 backdrop-blur-sm rounded-full mb-4">
            <Package className="h-8 w-8 text-purple-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Kitchen Management</h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Track and manage your kitchen inventory efficiently
          </p>
        </div>
        
        {/* Dashboard Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Total Items</h3>
            {statsLoading ? (
              <div className="flex justify-center py-2">
                <Loader className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-800">{inventory.length}</p>
            )}
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Categories</h3>
            {statsLoading ? (
              <div className="flex justify-center py-2">
                <Loader className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-800">
                {categoryStatsData ? categoryStatsData.length : 
                  new Set(inventory.map(item => item.category)).size}
              </p>
            )}
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Low Stock Items</h3>
            {lowStockLoading ? (
              <div className="flex justify-center py-2">
                <Loader className="h-6 w-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <p className="text-3xl font-bold text-gray-800">{lowStockItems.length}</p>
            )}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-500" size={18} />
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                      activeFilter === category 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Add New Item Button */}
        {!showAddForm && (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              disabled={isLoading}
            >
              <Plus size={20} /> Add New Item
            </button>
          </div>
        )}

        {/* Add New Item Form */}
        {showAddForm && (
          <form onSubmit={addItem} className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Item</h2>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="Enter item name"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 bg-white border text-gray-700 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity & Unit</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                    required
                  />
                  <select
                    className="px-4 py-3 text-black bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Alert</label>
                <div className="flex items-end gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    value={newItem.lowThreshold}
                    onChange={(e) => setNewItem({ ...newItem, lowThreshold: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                disabled={isAddingItem}
              >
                {isAddingItem ? (
                  <>
                    <Loader size={20} className="animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <Plus size={20} /> Add Item
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Inventory List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-6 gap-4 p-6 border-b border-gray-200 font-semibold text-gray-700">
            <div>Name</div>
            <div>Category</div>
            <div>Quantity</div>
            <div>Low Stock Alert</div>
            <div>Manage Stock</div>
            <div>Actions</div>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader className="h-12 w-12 mx-auto mb-4 text-purple-600 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Loading inventory...</p>
            </div>
          ) : inventoryError ? (
            <div className="p-12 text-center text-red-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <p className="text-lg font-medium">Error loading inventory</p>
              <p className="text-sm">Please try refreshing the page</p>
              <button 
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <RefreshCw size={16} className="inline mr-2" /> Retry
              </button>
            </div>
          ) : inventory.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            inventory.map(item => (
              <div 
                key={item._id} 
                className={`grid grid-cols-6 gap-4 p-6 border-b border-gray-200 items-center transition-colors ${
                  isLowQuantity(item) ? 'bg-red-50' : ''
                }`}
              >
                {editingId === item._id ? (
                  // Edit mode
                  <>
                    <div>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={editItem.name}
                        onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={editItem.category}
                        onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        className="w-16 px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={editItem.quantity}
                        onChange={(e) => setEditItem({ ...editItem, quantity: parseFloat(e.target.value) })}
                      />
                      <select
                        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={editItem.unit}
                        onChange={(e) => setEditItem({ ...editItem, unit: e.target.value })}
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                        value={editItem.lowThreshold}
                        onChange={(e) => setEditItem({ ...editItem, lowThreshold: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div></div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={saveEdit}
                        disabled={isUpdatingItem}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        {isUpdatingItem ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <Check size={20} />
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="capitalize text-gray-600">{item.category}</div>
                    <div className="text-gray-800">{item.quantity} {item.unit}</div>
                    <div>
                      {isLowQuantity(item) ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <AlertCircle size={16} className="mr-1" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => decreaseQuantity(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={isUpdatingQuantity}
                        title="Use Item"
                      >
                        {isUpdatingQuantity ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <Minus size={20} />
                        )}
                      </button>
                      <button
                        onClick={() => increaseQuantity(item._id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        disabled={isUpdatingQuantity}
                        title="Add Stock"
                      >
                        {isUpdatingQuantity ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <Plus size={20} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={isDeletingItem}
                        title="Delete"
                      >
                        {isDeletingItem ? (
                          <Loader size={20} className="animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Kitchen;