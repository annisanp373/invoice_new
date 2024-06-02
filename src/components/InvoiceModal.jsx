import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import logo from '../assets/logo.png'; // Update with your actual path to logo

const InvoiceModal = ({
  isOpen,
  setIsOpen,
  invoiceNumber,
  cashierName,
  customerName,
  phoneNumber,
  pickupDateTime,
  returnDateTime,
  guarantee,
  items,
  subtotal,
  taxRate,
  discountRate,
  total,
  onAddNextInvoice,
}) => {
  function closeModal() {
    setIsOpen(false);
  }

  const addNextInvoiceHandler = () => {
    setIsOpen(false);
    onAddNextInvoice();
  };

  const SaveAsPDFHandler = () => {
    const dom = document.getElementById('print');
    toPng(dom)
      .then((dataUrl) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = dataUrl;
        img.onload = () => {
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4',
          });

          const imgProps = pdf.getImageProperties(img);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`invoice-${invoiceNumber}.pdf`);
        };
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              <div className="p-4" id="print">
                <div className="flex items-center justify-between">
                  <img src={logo} alt="Company Logo" className="w-40 h-40" />
                  <div className="text-sm">
                    <p className="font-bold">Nama :</p>
                    <p>{customerName}</p>
                    <p className="font-bold">No. Telpon :</p>
                    <p>{phoneNumber}</p>
                    <p className="font-bold">Tgl/Jam Ambil :</p>
                    <p>{pickupDateTime}</p>
                    <p className="font-bold">Tgl/Jam Kembali :</p>
                    <p>{returnDateTime}</p>
                    <p className="font-bold">Jaminan :</p>
                    <p>{guarantee}</p>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p>CV IFRAME INOVASI MEDIA</p>
                  <p>(IFRAME Rental #1 Palagan - Lempong)</p>
                  <p>Jl. Kranji, Gang Yudistira, Nglempong Lor, RT 7 / RW 22</p>
                  <p>Sariharjo, Ngaglik Sleman 55581</p>
                  <p>0812 7679 7711</p>
                </div>
                <div className="mt-6">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-orange-500 text-white text-sm md:text-base">
                        <th className="p-2">NO.</th>
                        <th className="p-2">Nama Barang</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Tarif</th>
                        <th className="p-2">Diskon</th>
                        <th className="p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2 text-center">{item.qty}</td>
                          <td className="p-2 text-right">Rp{Number(item.price).toFixed(2)}</td>
                          <td className="p-2 text-right">20%</td>
                          <td className="p-2 text-right">Rp{(item.price * item.qty * 0.8).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 px-4 pb-6">
                <button
                  className="flex w-full items-center justify-center space-x-1 rounded-md border border-blue-500 py-2 text-sm text-blue-500 shadow-sm hover:bg-blue-500 hover:text-white"
                  onClick={SaveAsPDFHandler}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download</span>
                </button>
                <button
                  onClick={addNextInvoiceHandler}
                  className="flex w-full items-center justify-center space-x-1 rounded-md border border-emerald-500 bg-emerald-500 py-2 text-sm text-white shadow-sm hover:bg-emerald-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 6h18M3 14h18M3 18h18"
                    />
                  </svg>
                  <span>Add Another</span>
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default InvoiceModal;
