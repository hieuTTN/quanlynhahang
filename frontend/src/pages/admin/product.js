import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import DataTable from 'datatables.net-dt';
import { getMethod ,uploadSingleFile, uploadMultipleFile} from '../../services/request';
import Swal from 'sweetalert2';
import { formatMoney } from '../../services/money';

var token = localStorage.getItem("token");



var size = 10;
var url = '';
const AdminProduct = ()=>{
    const [items, setItems] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    useEffect(()=>{
        const getProduct= async() =>{
            var response = await getMethod('http://localhost:8080/api/product/public/findAll?size='+size+'&sort=id,desc&page='+0);
            var result = await response.json();
            setItems(result.content)
            setpageCount(result.totalPages)
            url = 'http://localhost:8080/api/product/public/findAll?size='+size+'&sort=id,desc&page='
        };
        getProduct();
    }, []);


    async function deleteProduct(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?");
        if (con == false) {
            return;
        }
        var url = 'http://localhost:8080/api/product/admin/delete?id=' + id;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': 'Bearer ' + token
            })
        });
        if (response.status < 300) {
            toast.success("xóa thành công!");
            $('#example').DataTable().destroy();
            var res = await getMethod('http://localhost:8080/api/product/public/findAll-list');
            var list = await res.json();
            setItems(list)
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


    return (
        <>
            <div class="row">
                <div class="col-md-3">
                    <a href='addproduct' class="btn btn-primary"><i class="fa fa-plus"></i> Thêm sản phẩm</a>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách sản phẩm</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh bìa</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá hiện tại</th>
                                <th>Giá cũ</th>
                                <th>Đơn vị tính</th>
                                <th>Số lượng bán</th>
                                <th>Số lượng còn</th>
                                <th>Danh mục</th>
                                <th class="sticky-col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                    return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.imageBanner} className='imgadmin'/></td>
                                    <td>{item.name}</td>
                                    <td>{formatMoney(item.price)}</td>
                                    <td>{formatMoney(item.oldPrice)}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.quantitySold}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.category.name}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>deleteProduct(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                        <a href={"addproduct?id="+item.id} class="edit-btn"><i class="fa fa-edit"></i></a>
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

export default AdminProduct;