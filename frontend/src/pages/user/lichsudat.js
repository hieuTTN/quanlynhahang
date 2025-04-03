import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {formatMoney} from '../../services/money'
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'

function LichSuDat(){
    const [items, setItems] = useState([]);
    const [invoice, setInvoice] = useState(null);

    useEffect(()=>{
        const getInvoice = async() =>{
            var response = await getMethod('/api/invoice/user/my-invoice')
            var result = await response.json();
            setItems(result)
        };
        getInvoice();
    }, []);
  
    return(
        <>
        <div class="blockcontent">
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Lịch Sử Đặt Bàn</strong>
            </div>
        </div>
        <div class="table-responsive divtale">
            <table class="table table-bordered table-striped" width="100%">
                <thead>
                    <tr>
                        <th>Họ tên</th>
                        <th>Số điện thoại</th>
                        <th>Ngày đặt</th>
                        <th>Ngày ăn</th>
                        <th>Tổng tiền</th>
                        <th>Ghi chú</th>
                        <th>Trạng thái</th>
                        <th>Khuyến mại</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody id="listhistory">
                    {items.map((item=>{
                        return <tr>
                            <td>{item.fullName}</td>
                            <td>{item.phone}</td>
                            <td>{item.createdTime}, {item.createdDate}</td>
                            <td>{item.bookDate}</td>
                            <td>{item.costPlus == null? formatMoney(item.totalAmount):formatMoney(item.totalAmount + item.costPlus)}</td>
                            <td>{item.note}</td>
                            <td>{item.payStatus}</td>
                            <td>{item.voucher == null?'0đ':formatMoney(item.voucher.discount)}</td>
                            <td><button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>setInvoice(item)} className='btn btn-primary'><i className='fa fa-eye'></i></button></td>
                        </tr>
                    }))}
                </tbody>
            </table>
        </div>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chi tiết đơn đặt </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {invoice !== null && (
                        <div>
                            <h5>Bàn ăn của Bạn</h5>
                            {invoice.invoiceResTables.map((e, index) => (
                                <span className='tenbans'>{e.resTable.name}</span>
                            ))}

                            <h5 className='lbmondadat'>Các món đã đặt</h5>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody id="listcart">
                                {invoice.invoiceDetails.map((item=>{
                                    return <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src={item.product.imageBanner} class="me-2"/>
                                                <span>{item.product.name}</span>
                                            </div>
                                        </td>
                                        <td>{formatMoney(item.price)}</td>
                                        <td>{item.quantity}</td>
                                        <td>{formatMoney(item.price * item.quantity)}</td>
                                    </tr>
                                }))}
                                </tbody>
                            </table>
                        </div>

                    )}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default LichSuDat;
