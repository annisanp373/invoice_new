import React, { useState } from 'react';
import { uid } from 'uid';
import InvoiceModal from './InvoiceModal';
import incrementString from '../helpers/incrementString';

const date = new Date();
const today = date.toLocaleDateString('en-GB', {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

const InvoiceForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const [cashierName, setCashierName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pickupDateTime, setPickupDateTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [guarantee, setGuarantee] = useState('');
  const [dp, setDp] = useState(0);
  const [accSosmed, setAccSosmed] = useState('');
  const [referalCode, setReferalCode] = useState('');
  const [items, setItems] = useState([
    {
      id: uid(6),
      name: '',
      qty: 1,
      rentTime: '6 Jam',
      price: '0',
      discount: '0',
      description: '',
    },
  ]);

  const reviewInvoiceHandler = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const addNextInvoiceHandler = () => {
    setInvoiceNumber((prevNumber) => incrementString(prevNumber));
    setItems([
      {
        id: uid(6),
        name: '',
        qty: 1,
        rentTime: '6 Jam',
        price: '0',
        discount: '0',
        description: '',
      },
    ]);
  };

  const addItemHandler = () => {
    const id = uid(6);
    setItems((prevItem) => [
      ...prevItem,
      {
        id: id,
        name: '',
        qty: 1,
        rentTime: '6 Jam',
        price: '0',
        discount: '0',
        description: '',
      },
    ]);
  };

  const deleteItemHandler = (id) => {
    setItems((prevItem) => prevItem.filter((item) => item.id !== id));
  };

  const editItemHandler = (event) => {
    const { id, name, value } = event.target;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [name]: value } : item
      )
    );
  };

  const subtotal = items.reduce((prev, curr) => {
    if (curr.name.trim().length > 0)
      return prev + Number(curr.price * Math.floor(curr.qty));
    else return prev;
  }, 0);

  const totalDiscount = items.reduce((prev, curr) => {
    return prev + (Number(curr.price * curr.qty) * Number(curr.discount) / 100);
  }, 0);

  const total = subtotal - totalDiscount;
  const grandTotal = total - dp;

  return (
    <form
      className="relative flex flex-col px-2 md:flex-row"
      onSubmit={reviewInvoiceHandler}
    >
      <div className="my-6 flex-1 space-y-2 rounded-md bg-white p-4 shadow-sm sm:space-y-4 md:p=6">
        <div className="flex flex-col justify-between space-y-2 border-b border-gray-900/10 pb-4 md:flex-row md:items-center md:space-y-0">
          <div className="flex space-x-2">
            <span className="font-bold">Current Date: </span>
            <span>{today}</span>
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="invoiceNumber">
              Invoice Number:
            </label>
            <input
              required
              className="max-w-[130px]"
              type="number"
              name="invoiceNumber"
              id="invoiceNumber"
              min="1"
              step="1"
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
            />
          </div>
        </div>
        <h1 className="text-center text-lg font-bold">INVOICE</h1>
        <div className="grid grid-cols-2 gap-2 pt-4 pb-8">
          <label
            htmlFor="cashierName"
            className="text-sm font-bold sm:text-base"
          >
            Cashier:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Cashier name"
            type="text"
            name="cashierName"
            id="cashierName"
            value={cashierName}
            onChange={(event) => setCashierName(event.target.value)}
          />
          <label
            htmlFor="customerName"
            className="col-start-2 row-start-1 text-sm font-bold md:text-base"
          >
            Customer:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Customer name"
            type="text"
            name="customerName"
            id="customerName"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
          <label
            htmlFor="phoneNumber"
            className="text-sm font-bold sm:text-base"
          >
            No. Telp:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Masukkan No.Hp"
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
          <label
            htmlFor="pickupDateTime"
            className="text-sm font-bold sm:text-base"
          >
            Tanggal / Jam Ambil:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Tanggal / Jam Ambil"
            type="datetime-local"
            name="pickupDateTime"
            id="pickupDateTime"
            value={pickupDateTime}
            onChange={(event) => setPickupDateTime(event.target.value)}
          />
          <label
            htmlFor="returnDateTime"
            className="text-sm font-bold sm:text-base"
          >
            Tanggal / Jam Kembali:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Tanggal / Jam Kembali"
            type="datetime-local"
            name="returnDateTime"
            id="returnDateTime"
            value={returnDateTime}
            onChange={(event) => setReturnDateTime(event.target.value)}
          />
          <label
            htmlFor="guarantee"
            className="text-sm font-bold sm:text-base"
          >
            Jaminan:
          </label>
          <input
            required
            className="flex-1"
            placeholder="Jaminan"
            type="text"
            name="guarantee"
            id="guarantee"
            value={guarantee}
            onChange={(event) => setGuarantee(event.target.value)}
          />
        </div>
        <table className="w-full p-4 text-left">
          <thead>
            <tr className="border-b border-gray-900/10 text-sm md:text-base">
              <th>NAMA BARANG</th>
              <th>QTY</th>
              <th>JAM SEWA</th>
              <th className="text-center">HARGA</th>
              <th className="text-center">DISCOUNT (%)</th>
              <th className="text-center">KETERANGAN</th>
              <th className="text-center">HAPUS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(event) =>
                      editItemHandler({
                        target: {
                          id: item.id,
                          name: 'name',
                          value: event.target.value,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="qty"
                    value={item.qty}
                    min="1"
                    onChange={(event) =>
                      editItemHandler({
                        target: {
                          id: item.id,
                          name: 'qty',
                          value: event.target.value,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <select
                    name="rentTime"
                    value={item.rentTime}
                    onChange={(event) =>
                      editItemHandler({
                        target: {
                          id: item.id,
                          name: 'rentTime',
                          value: event.target.value,
                        },
                      })
                    }
                  >
                    <option value="6 Jam">6 Jam</option>
                    <option value="12 Jam">12 Jam</option>
                    <option value="24 Jam">24 Jam</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    name="price"
                    value={item.price}
                    min="0"
                    step="1000"
                    onChange={(event) =>
                      editItemHandler({
                        target: {
                          id: item.id,
                          name: 'price',
                          value: event.target.value,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="discount"
                    value={item.discount}
                    min="0"
                    max="100"
                    onChange={(event) =>
                      editItemHandler({
                        target: {
                          id: item.id,
                          name: 'discount',
                          value: event.target.value,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    onChange={(event) =>
                      editItemHandler({
                        target: {
                          id: item.id,
                          name: 'description',
                          value: event.target.value,
                        },
                      })
                    }
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => deleteItemHandler(item.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addItemHandler}
          className="my-4 w-full rounded bg-blue-500 p-2 text-white"
        >
          Add Item
        </button>
        <div className="mt-4">
          <h2 className="text-sm font-bold sm:text-base">Subtotal: {subtotal}</h2>
          <h2 className="text-sm font-bold sm:text-base">Total Discount: {totalDiscount}</h2>
          <h2 className="text-sm font-bold sm:text-base">Total: {total}</h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="col-start-2">
            <label
              htmlFor="dp"
              className="text-sm font-bold sm:text-base"
            >
              DP:
            </label>
            <input
              required
              className="w-full"
              placeholder="DP"
              type="number"
              name="dp"
              id="dp"
              value={dp}
              onChange={(event) => setDp(event.target.value)}
            />
            <h2 className="mt-4 text-sm font-bold sm:text-base">Grand Total: {grandTotal}</h2>
          </div>
        </div>
        <label
            htmlFor="accSosmed"
            className="text-sm font-bold sm:text-base"
          >
            Akun Sosial Media :
          </label>
          <input
            required
            className="flex-1"
            placeholder="Akun Sosial Media"
            type="text"
            name="accSosmed"
            id="accSosmed"
            value={accSosmed}
            onChange={(event) => setAccSosmed(event.target.value)}
          />
          <label
            htmlFor="referalCode"
            className="text-sm font-bold sm:text-base"
          >
            Kode Referal :
          </label>
          <input
            required
            className="flex-1"
            placeholder="Kode Referal"
            type="text"
            name="referalCode"
            id="referalCode"
            value={referalCode}
            onChange={(event) => setReferalCode(event.target.value)}
          />
        <button
          type="submit"
          className="my-4 w-full rounded bg-green-500 p-2 text-white"
        >
          Review Invoice
        </button>
      </div>
      <InvoiceModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        cashierName={cashierName}
        customerName={customerName}
        phoneNumber={phoneNumber}
        pickupDateTime={pickupDateTime}
        returnDateTime={returnDateTime}
        guarantee={guarantee}
        items={items}
        subtotal={subtotal}
        discountRate={totalDiscount}
        total={total}
        dp={dp}
        grandTotal={grandTotal}
        invoiceNumber={invoiceNumber}
        accSosmed={accSosmed}
        referalCode={referalCode}
      />
    </form>
  );
};

export default InvoiceForm;
