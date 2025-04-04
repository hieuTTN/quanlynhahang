import { useState, useEffect } from 'react';
import { getMethod } from '../../services/request';
import { formatMoney } from '../../services/money';

const InvoiceBill = () => {
    const [invoice, setInvoice] = useState(null);
    useEffect(() => {
        var uls = new URL(document.URL)
        var id = uls.searchParams.get("id");
        const fetchInvoice = async () => {
            var response = await getMethod(`/api/invoice/admin/find-by-id?id=${id}`);
            var result = await response.json();
            setInvoice(result);
        };
        fetchInvoice();
    }, []);
    if (!invoice) return <div>Đang tải hóa đơn...</div>;
    return (
        <>
            <div class="container mt-4 border p-4 bg-white">
                <h2 class="text-center mb-4">HÓA ĐƠN THANH TOÁN</h2>

                <div class="row mb-3">
                    <div class="col-md-6">
                        <p><strong>Khách hàng:</strong> {invoice.fullName}</p>
                        <p><strong>SĐT:</strong> {invoice.phone}</p>
                        <p><strong>Ghi chú:</strong> {invoice.note || 'Không có'}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Ngày tạo:</strong> {invoice.createdDate} {invoice.createdTime}</p>
                        <p><strong>Ngày đặt:</strong> {invoice.bookDate}</p>
                        <p><strong>Trạng thái thanh toán:</strong> {invoice.payStatus}</p>
                    </div>
                </div>

                <h5>Chi tiết món ăn</h5>
                <table class="table table-bordered">
                    <thead class="table-secondary">
                        <tr>
                            <th>Tên món</th>
                            <th>Số lượng</th>
                            <th>Đơn giá</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.invoiceDetails.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product.name}</td>
                                <td>{item.quantity}</td>
                                <td>{formatMoney(item.price)}</td>
                                <td>{formatMoney(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h5>Thông tin bàn</h5>
                <ul>
                    {invoice.invoiceResTables.map((item, index) => (
                        <li key={index}>
                            Bàn: {item.resTable.name} - Tầng {item.resTable.floor}
                        </li>
                    ))}
                </ul>

                <div class="text-end mt-4">
                    <p><strong>Phụ thu:</strong> {formatMoney(invoice.costPlus || 0)}</p>
                    <p class="fs-4 fw-bold">Tổng tiền: {formatMoney(invoice.totalAmount)}</p>
                </div>

                <div class="text-center mt-4">
                    <button class="btn btn-primary" onClick={() => window.print()}>
                        <i class="fa fa-print"></i> In hóa đơn
                    </button>
                </div>
            </div>
        </>
    );
};

export default InvoiceBill;
