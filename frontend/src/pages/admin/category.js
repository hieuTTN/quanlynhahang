import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery'; 
import Swal from 'sweetalert2'
import {getMethod,postMethodPayload, deleteMethod, uploadSingleFile} from '../../services/request';


var imgbanner = '';

async function saveCategory(event) {
    event.preventDefault();
    var anh = await uploadSingleFile(document.getElementById("fileimage"))
    if(anh != null){
        imgbanner = anh;
    }
    const payload = {
        id: event.target.elements.idcate.value,
        name: event.target.elements.catename.value,
        image: imgbanner,
    };
    const res = await postMethodPayload('/api/category/admin/create', payload)
    if(res.status < 300){
        toast.success('Thành công!');
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
    }
    else{
        var result = await res.json();
        console.log(result);
        if (res.status == 417) {
            toast.error(result.defaultMessage);
        }
        else{
            toast.error(result[0].defaultMessage);
        }
    }
};

const AdminCategory = ()=>{
    const [items, setItems] = useState([]);
    const [cate, setCate] = useState(null);
    useEffect(()=>{
        const getCategory = async() =>{
            var response = await getMethod('/api/category/public/find-all-quantity')
            var result = await response.json();
            console.log(result);
            
            setItems(result)
        };
        getCategory();
    }, []);

    async function deleteCategory(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa danh mục này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/category/admin/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa danh mục thành công!");
            var response = await getMethod('/api/category/public/find-all-quantity')
            var result = await response.json();
            setItems(result)
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }
    
    function setACate(item){
        setCate(item)
        imgbanner = item.image;
    }
    
    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Danh Mục</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <button data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách danh mục</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Ảnh</th>
                                <th>Tên danh mục</th>
                                <th>Số lượng món ăn</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td><img src={item.image}/></td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>setACate(item)} data-bs-toggle="modal" data-bs-target="#addtk" class="edit-btn"><i className='fa fa-edit'></i></button>
                                        <button onClick={()=>deleteCategory(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
                                    </td>
                                </tr>
                            }))}
                        </tbody>
                    </table>

                </div>
            </div>

            <div class="modal fade" id="addtk" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Thêm danh mục</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form class="col-sm-12 marginauto" onSubmit={saveCategory} method='post'>
                                <input defaultValue={cate==null?'':cate.id} name="idcate" id='idcate' type="hidden" />
                                <label>Tên danh mục</label>
                                <input defaultValue={cate==null?'':cate.name} name="catename" id='catename' type="text" class="form-control" />
                                <label>Ảnh</label>
                                <input id='fileimage' type="file" class="form-control" />
                                <br/><br/>
                                <button class="btn btn-primary form-control action-btn">Thêm/ Cập nhật danh mục</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminCategory;