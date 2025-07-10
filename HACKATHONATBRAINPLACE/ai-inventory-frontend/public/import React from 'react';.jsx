import React from 'react';

export default function InventoryTable({ items }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Quantity</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.sku}>
            <td>{item.name}</td>
            <td>{item.sku}</td>
            <td>{item.quantity}</td>
            <td>{item.location}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}