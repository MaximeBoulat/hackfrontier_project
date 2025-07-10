import React, { useState } from 'react';
import InventoryTable from './components/InventoryTable';
import InventoryForm from './components/InventoryForm';

const initialInventory = [
  { name: 'Widget A', sku: 'A001', quantity: 10, location: 'Shelf 1' },
  { name: 'Widget B', sku: 'B002', quantity: 3, location: 'Shelf 2' },
];

export default function App() {
  const [inventory, setInventory] = useState(initialInventory);

  const addItem = (item) => setInventory([...inventory, item]);
