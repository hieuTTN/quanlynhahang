import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethod ,uploadSingleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';

var token = localStorage.getItem("token");


var size = 10;
var url = '';
const AdminVoucher = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getVoucher= async() =>{
            var response = await getMethod('/api/voucher/admin/findAll?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/voucher/admin/findAll?size='+size+'&sort=id,desc&page='
        };
        getVoucher();
    }, []);

     const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }
    



    async function deleteVoucher(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa voucher này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/voucher/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethod('http://localhost:8080/api/voucher/admin/findAll-list');
            var list = await res.json();
            setItems(list)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }

    const locVoucher= async() =>{
        var start = document.getElementById("start").value
        var end = document.getElementById("end").value
        var urls = '/api/voucher/admin/findAll?size='+size+'&sort=id,desc'
        if (start != null && start != "" && end != null && end != "" && start != 'null' && end != 'null') {
            urls += '&start=' + start + '&end=' + end
        }
        urls += '&page='
        var response = await getMethod(urls+0);
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
        url = urls
    };


    return (
        <>
            <div class="row">
                <div class="col-md-2 col-sm-4 col-4">
                    <label class="lb-form">Từ ngày</label>
                    <input id="start" type="date" class="form-control"/>
                </div>
                <div class="col-md-2 col-sm-4 col-4">
                    <label class="lb-form">Đến ngày</label>
                    <input id="end" type="date" class="form-control"/>
                </div>
                <div class="col-md-2 col-sm-4 col-4">
                    <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThickSpace;'}}></label>
                    <button onClick={()=>locVoucher()} class="btn btn-primary"><i class="fa fa-filter"></i> Lọc</button>
                </div>
                <div class="col-md-3">
                    <label class="lb-form" dangerouslySetInnerHTML={{__html:'&ThickSpace;'}}></label>
                    <a href="addvoucher" class="btn btn-primary"><i class="fa fa-plus"></i> Thêm voucher</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách voucher</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Mã</th>
                                <th>Tên voucher</th>
                                <th>Đơn hàng tối thiểu</th>
                                <th>Giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.code}</td>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.minAmount)}</td>
                                    <td>{formatMoney(item.discount)}</td>
                                    <td>{item.startDate}</td>
                                    <td>{item.endDate}</td>
                                    <td>{item.block == true?'Đã khóa':'Đang hoạt động'}</td>
                                    <td class="sticky-col">
                                        <button className='delete-btn'><i onClick={()=>deleteVoucher(item.id)} class="fa fa-trash"></i></button>
                                        <a className='edit-btn' href={"addvoucher?id="+item.id}><i class="fa fa-edit"></i></a>
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

        </>
    );
}

export default AdminVoucher;