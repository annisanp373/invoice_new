import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import logo from '../assets/logo.png';

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number);
};

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
  discountRate,
  total,
  dp,
  grandTotal,
  accSosmed,
  referalCode,
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
            format: [img.width, img.height],
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

  const calculateDiscountedTotal = (items) => {
    return items.reduce((acc, item) => {
      const itemTotal = item.price * item.qty;
      const discountedTotal = itemTotal * (1 - item.discount / 100);
      return acc + discountedTotal;
    }, 0);
  };

  const discountedTotal = calculateDiscountedTotal(items);

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
            <div className="my-8 inline-block w-full max-w-3xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
              <div className="p-4" id="print">
                <div className="flex items-center justify-between">
                  <div>
                    <img src={logo} alt="Company Logo" className="w-40 h-40" />
                    <div className="mt-4 text-sm">
                      <p>CV IFRAME INOVASI MEDIA</p>
                      <p>(IFRAME Rental #1 Palagan - Lempong)</p>
                      <p>Jl. Kranji, Gang Yudistira, Nglempong Lor, RT 7 / RW 22</p>
                      <p>Sariharjo, Ngaglik Sleman 55581</p>
                      <p>0812 7679 7711</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">Invoice Number :</p>
                    <p>{invoiceNumber}</p>
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
                <div className="mt-6">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-orange-500 text-white text-sm md:text-base">
                        <th className="p-2">NO.</th>
                        <th className="p-2">Nama Barang</th>
                        <th className="p-2">Qty</th>
                        <th className="p-2">Jam Sewa</th>
                        <th className="p-2">Tarif</th>
                        <th className="p-2">Diskon</th>
                        <th className="p-2">Keterangan</th>
                        <th className="p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2">{index + 1}</td>
                          <td className="p-2">{item.name}</td>
                          <td className="p-2 text-center">{item.qty}</td>
                          <td className="p-2 text-center">{item.rentTime}</td>
                          <td className="p-2 text-right">{formatRupiah(item.price)}</td>
                          <td className="p-2 text-right">{item.discount}%</td>
                          <td className="p-2">{item.description}</td>
                          <td className="p-2 text-right">{formatRupiah((item.price * item.qty) * (1 - item.discount / 100))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end text-sm">
                  <div className="w-64">
                    <div className="flex justify-between border-t pt-2">
                      <span>Subtotal:</span>
                      <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diskon:</span>
                      <span>{formatRupiah(subtotal - discountedTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>{formatRupiah(discountedTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DP:</span>
                      <span>{formatRupiah(dp)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Grand Total:</span>
                      <span>{formatRupiah(discountedTotal - dp)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-left">
                <div className="text-sm">
                    <p className="font-bold">Akun Sosial Media :</p> <p>{accSosmed}</p>
                    <p className="font-bold">Kode Referal :</p> <p>{referalCode}</p>
                </div>
                  <div className="mt-4 text-left">
                    <p className="font-bold">Syarat & Ketentuan:</p>
                    <ol className="list-decimal pl-4 text-sm">
                      <li>Tarif sewa dihitung per 24, 12 atau 6 jam sejak pengambilan.</li>
                      <li>Pembayaran harus LUNAS saat pengambilan dengan cash/tunai, QRIS atau transfer via rekening bank.</li>
                      <li>Penyewa harus meninggalkan minimal 2 identitas Jogja yang identik atas nama satu orang dan masih berlaku (KTP/SIM/KTM/KK/Ijazah).</li>
                      <li>Untuk nilai alat tertentu, jaminan harus dilengkapi dengan STNK/BPKB dan atau kendaraan bermotor.</li>
                      <li>Saat pengambilan barang, penyewa HARUS bersedia difoto dan menunjukkan akun media sosial yang aktif untuk diverifikasi.</li>
                      <li>Kerusakan dan kehilangan barang, sepenuhnya DITANGGUNG oleh penyewa. Silakan cek kondisi & kelengkapan barang yang disewa saat penerimaan.</li>
                      <li>Barang yang sudah disewa tidak boleh dialihkan ke pihak lain tanpa sepengetahuan dan ijin dari IFRAME Rental.</li>
                      <li>Barang yang sudah disewa dan dibawa, dianggap telah digunakan. Uang yang sudah dibayarkan tidak dapat dikembalikan/cancel.</li>
                      <li>Keterlambatan pengembalian akan dikenakan denda sesuai dengan tarif sewa harian yang berlaku.</li>
                      <li>Barang sewaan harus kembali dalam kondisi baik dan lengkap sesuai dengan saat diterima.</li>
                      <li>Apabila penyewa melanggar ketentuan, IFRAME Rental berhak menarik barang kapanpun dan dimanapun tanpa pengembalian uang sewa.</li>
                      <li>Dengan menyewa, penyewa dianggap telah memahami dan menyetujui seluruh syarat dan ketentuan ini.</li>
                      <li>Penyewa wajib menjaga kebersihan barang dan mengembalikannya dalam kondisi yang sama saat diterima.</li>
                      <li>IFRAME Rental berhak menolak calon penyewa yang tidak memenuhi syarat dan ketentuan yang berlaku.</li>
                      <li>Untuk keamanan dan kenyamanan bersama, harap patuhi syarat dan ketentuan yang telah ditetapkan.</li>
                    </ol>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="text-center">
                      <p className="font-bold">Operator</p>
                      <p className="mt-8">(____________________)</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">Penyewa</p>
                      <p className="mt-8">(____________________)</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 bg-gray-50 p-4">
                <button
                  type="button"
                  className="rounded-md bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="rounded-md bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                  onClick={SaveAsPDFHandler}
                >
                  Download
                </button>
                <button
                  type="button"
                  className="rounded-md bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
                  onClick={addNextInvoiceHandler}
                >
                  New Invoice
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
