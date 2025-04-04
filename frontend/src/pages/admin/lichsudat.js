import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethod ,deleteMethod, postMethodPayload, postMethod} from '../../services/request';
import {formatMoney} from '../../services/money'
import Swal from 'sweetalert2';
import AsyncSelect from 'react-select/async';

var token = localStorage.getItem("token");


var size = 10;
var url = '';
const LichSuDat = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [invoice, setInvoice] = useState(null);
    const [itemService, setItemService] = useState([]);
    const [itemServiceDaChon, setItemServiceDaChon] = useState([]);
    useEffect(()=>{
        getInvoice();
        getService();
    }, []);
    const getInvoice= async() =>{
        var from = document.getElementById("start").value
        var to = document.getElementById("end").value
        var urls = '/api/invoice/admin/find-all?size='+size+'&sort=id,desc';
        if(from != "" && to != ""){
            urls += '&from='+from+'&to='+to
        }
        urls += '&page='
        var response = await getMethod(urls+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = urls
    };

    const getService= async() =>{
        var response = await getMethod('/api/product/public/findAll-list');
        var result = await response.json();
        setItemService(result)
    };


    async function deleteBlog(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa bài viết này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/blog/admin/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            var response = await getMethod('/api/blog/public/findAll?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/blog/public/findAll?size='+size+'&sort=id,desc&page='
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }


    function loadTableService(service){
        setItemServiceDaChon(service)
    }

    async function addService() {
        var listObj = []
        for(var i=0; i<itemServiceDaChon.length; i++){
            var obj = {
                "idProduct":itemServiceDaChon[i].id,
                "quantity":document.getElementById("quantityser"+itemServiceDaChon[i].id).value
            }
            listObj.push(obj);
        }
        var response = await postMethodPayload(`/api/invoice/admin/add-service?idInvoice=${invoice.id}`, listObj);
        if(response.status < 300){
            toast.success("Đã thêm dịch vụ");
            getInvoice();
        }
        else{
            toast.error("Thêm dịch vụ thất bại");
        }
    }

    async function updateTrangThai() {
        var con = window.confirm("Xác nhận cập nhật trạng thái?");
        if(con == false){
            return;
        }
        var trangthai = document.getElementById("trangthai").value
        var response = await postMethod(`/api/invoice/admin/update-status?idInvoice=${invoice.id}&payStatus=${trangthai}`);
        if(response.status < 300){
            toast.success("Đã cập nhật trạng thái");
            getInvoice();
        }
        else{
            toast.error("Thất bại");
        }
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Lịch sử đặt bàn</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <div className='d-flex divngayadmin'>
                        <input type='date' id='start' className='selectheader'/> 
                        <input type='date' id='end' className='selectheader'/>  
                        <button onClick={()=>getInvoice()} className='btn btn-primary selectheader'>Lọc</button>
                    </div>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách lịch sử đặt</span>
                </div>
                <div class="divcontenttable">
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <td>ID</td>
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Ngày đặt</th>
                                <th>Ngày ăn</th>
                                <th>Tổng tiền</th>
                                <th>Còn lại</th>
                                <th>Ghi chú</th>
                                <th>Trạng thái</th>
                                <th>Khuyến mại</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody id="listhistory">
                            {items.map((item=>{
                                return <tr>
                                    <td>{item.id}</td>
                                    <td>{item.fullName}</td>
                                    <td>{item.phone}</td>
                                    <td>{item.createdTime}<br/>{item.createdDate}</td>
                                    <td>{item.bookDate}</td>
                                    <td>{item.costPlus == null? formatMoney(item.totalAmount):formatMoney(item.totalAmount + item.costPlus)}<br/>
                                        Đã thanh toán: {formatMoney(item.totalAmount)}
                                    </td>
                                    <td>{formatMoney(item.costPlus)}</td>
                                    <td>{item.note}</td>
                                    <td>{item.payStatus}</td>
                                    <td>{item.voucher == null?'0đ':formatMoney(item.voucher.discount)}</td>
                                    <td className='btnaction'>
                                        <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>setInvoice(item)} className='edit-btn'><i className='fa fa-eye'></i></button>
                                        <button onClick={()=>setInvoice(item)} data-bs-toggle="modal" data-bs-target="#addService" className='delete-btn'><i className='fa fa-plus'></i></button>
                                        {item.payStatus == 'DA_HUY'?'':<button onClick={()=>setInvoice(item)} data-bs-toggle="modal" data-bs-target="#updateTrangThai" className='edit-btn'><i className='fa fa-edit'></i></button>}
                                        <a href={'/admin/inbill?id='+item.id} className='delete-btn' target='_blank'><i className='fa fa-print'></i></a>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>
                    <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
                </div>
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
                                        <th colSpan={2}>Sản phẩm</th>
                                        <th>Loại</th>
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
                                                <img src={item.product.imageBanner} class="imgtable"/>
                                            </div>
                                        </td>
                                        <td><span>{item.product.name}</span></td>
                                        <td>{item.isMore == false?'':'Gọi thêm'}</td>
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
            

            <div class="modal fade" id="addService" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thêm dịch vụ sử dụng</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body">
                            <AsyncSelect
                            isMulti
                            onChange={(item) => {
                                loadTableService(item);
                            }}
                            defaultOptions={itemService} 
                            getOptionLabel={(itemService)=>itemService.name +" Giá: "+ formatMoney(itemService.price)} 
                            getOptionValue={(itemService)=>itemService.id}  
                            placeholder="Chọn dịch vụ"/>
                            <table class="table tablechondichvu">
                                <thead>
                                    <tr>
                                        <th>Tên dịch vụ</th>
                                        <th>Giá tiền</th>
                                        <th>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody id="listServiceSelect">
                                    {itemServiceDaChon.map((item=>{
                                            return <tr>
                                            <td>{item.name}</td>
                                            <td>{formatMoney(item.price)}</td>
                                            <td><input id={"quantityser"+item.id} type='number' defaultValue={0}/></td>
                                        </tr>
                                    }))}
                                </tbody>
                            </table>
                            <br/><br/>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button onClick={()=>addService()} class="btn btn-primary">Thêm dịch vụ</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="updateTrangThai" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Cập nhật trạng thái</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body">
                            <select id='trangthai' className='form-control'>
                                <option value='DA_HUY'>Đã hủy</option>
                                <option value='DA_THANH_TOAN'>Đã Thanh toán đủ</option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button onClick={()=>updateTrangThai()} class="btn btn-primary">Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LichSuDat;