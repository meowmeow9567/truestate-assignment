// frontend/src/components/SalesTable.jsx
export default function SalesTable({ items }) {
  if (!items.length) {
    return (
      <div className="no-results">
        No transactions found. Try changing search or filters.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            {/* Customer Fields */}
            <th>Customer ID</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Customer Region</th>
            <th>Customer Type</th>

            {/* Product Fields */}
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Brand</th>
            <th>Product Category</th>
            <th>Tags</th>

            {/* Sales Fields */}
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Discount %</th>
            <th>Total Amount</th>
            <th>Final Amount</th>

            {/* Operational Fields */}
            <th>Date</th>
            <th>Payment Method</th>
            <th>Order Status</th>
            <th>Delivery Type</th>
            <th>Store ID</th>
            <th>Store Location</th>
            <th>Salesperson ID</th>
            <th>Employee Name</th>
          </tr>
        </thead>
        <tbody>
          {items.map((row, idx) => (
            <tr key={`${row.transactionId || row.customerId || idx}-${idx}`}>
              {/* Customer Fields */}
              <td>{row.customerId}</td>
              <td>{row.customerName}</td>
              <td>{row.phoneNumber}</td>
              <td>{row.gender}</td>
              <td>{row.age}</td>
              <td>{row.customerRegion}</td>
              <td>{row.customerType}</td>

              {/* Product Fields */}
              <td>{row.productId}</td>
              <td>{row.productName}</td>
              <td>{row.brand}</td>
              <td>{row.productCategory}</td>
              <td>{(row.tags || []).join(', ')}</td>

              {/* Sales Fields */}
              <td>{row.quantity}</td>
              <td>{row.pricePerUnit}</td>
              <td>{row.discountPercentage}</td>
              <td>{row.totalAmount}</td>
              <td>{row.finalAmount}</td>

              {/* Operational Fields */}
              <td>{row.date}</td>
              <td>{row.paymentMethod}</td>
              <td>{row.orderStatus}</td>
              <td>{row.deliveryType}</td>
              <td>{row.storeId}</td>
              <td>{row.storeLocation}</td>
              <td>{row.salespersonId}</td>
              <td>{row.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
