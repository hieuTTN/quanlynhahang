import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import Swal from 'sweetalert2'
import {getMethod,postMethod, deleteMethod} from '../../services/request';



var size = 10
var url = '';
const AdminThongbao = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getReport = async() =>{
            var response = await getMethod('/api/notification/admin/find-all?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = '/api/notification/admin/find-all?size='+size+'&sort=id,desc&page='
        };
        getReport();
    }, []);


    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setItems(result.content)
        setpageCount(result.totalPages)
    }

    async function markNoti() {
        var con = window.confirm("Xác nhận hành động?");
        if (con == false) {
            return;
        }
        const response = await postMethod('/api/notification/all/mark-read')
        if (response.status < 300) {
            window.location.reload();
        } else {
            toast.error("Thất bại");
        }
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Thông Báo</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <a onClick={markNoti} href='#' className='pointer'>Đánh dấu tất cả là đã đọc</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách thông báo</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Mã thông báo</th>
                                <th>Nội dung</th>
                                <th>Ngày gửi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                return  <tr className={item.isRead == true?'':'trdadocthongbao'}>
                                    <td>{item.id}</td>
                                    <td>{item.title}</td>
                                    <td>{item.createdDate}</td>
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

export default AdminThongbao;