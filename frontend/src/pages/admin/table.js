import { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import {getMethod,postMethodPayload, deleteMethod, uploadSingleFile} from '../../services/request';




const AdminTable = ()=>{
    const [items, setItems] = useState([]);
    const [cate, setData] = useState(null);
    const [checked, setChecked] = useState(false);
    useEffect(()=>{
        getData();
    }, []);

    const getData = async() =>{
        var response = await getMethod('/api/res-table/public/find-all')
        var result = await response.json();
        setItems(result)
    };

    async function deleteData(id){
        var con = window.confirm("Bạn chắc chắn muốn xóa bàn này?");
        if (con == false) {
            return;
        }
        var response = await deleteMethod('/api/res-table/admin/delete?id='+id)
        if (response.status < 300) {
            toast.success("xóa thành công!");
            getData();
        }
        if (response.status == 417) {
            var result = await response.json()
            toast.warning(result.defaultMessage);
        }
    }
    
    function setAData(item){
        setData(item);
        setChecked(item.isLocked);
    }

    async function saveData(event) {
        event.preventDefault();
        const payload = {
            id: event.target.elements.idcate.value,
            name: event.target.elements.catename.value,
            floor: event.target.elements.tang.value,
            isLocked: event.target.elements.isLocked.checked,
        };
        const res = await postMethodPayload('/api/res-table/admin/create', payload)
        if(res.status < 300){
            toast.success('Thành công!');
            getData();
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

    function clearData(){
        setData(null);
        setChecked(false)
    }

    return (
        <>
            <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <strong class="text-left"><i className='fa fa-users'></i> Quản Lý Bàn</strong>
                <div class="search-wrapper d-flex align-items-center">
                    <button onClick={()=>clearData()} data-bs-toggle="modal" data-bs-target="#addtk" class="btn btn-primary ms-2"><i className='fa fa-plus'></i></button>
                </div>
            </div>
            <div class="tablediv">
                <div class="headertable">
                    <span class="lbtable">Danh sách bàn</span>
                </div>
                <div class="divcontenttable">
                    <table id="example" class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên bàn</th>
                                <th>Tầng</th>
                                <th>Trạng thái</th>
                                <th>Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item=>{
                                return  <tr>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>Tầng: {item.floor}</td>
                                    <td>{item.isLocked == false?<span className='errortext'>Đang trống</span>:<span className='successtext'>Đang có người ăn</span>}</td>
                                    <td class="sticky-col">
                                        <button onClick={()=>setAData(item)} data-bs-toggle="modal" data-bs-target="#addtk" class="edit-btn"><i className='fa fa-edit'></i></button>
                                        <button onClick={()=>deleteData(item.id)} class="delete-btn"><i className='fa fa-trash'></i></button>
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
                            <h5 class="modal-title" id="exampleModalLabel">Thêm bàn</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <form class="col-sm-12 marginauto" onSubmit={saveData} method='post'>
                                <input defaultValue={cate==null?'':cate.id} name="idcate" id='idcate' type="hidden" />
                                <label>Tên bàn</label>
                                <input defaultValue={cate==null?'':cate.name} name="catename" id='catename' type="text" class="form-control" />
                                <br></br><label class="checkbox-custom">Trạng thái
                                    <input checked={checked} onChange={() => setChecked(!checked)} name="isLocked" id='isLocked' type="checkbox"/>
                                    <span class="checkmark-checkbox"></span>
                                </label><br/>
                                <label>Tầng</label>
                                <select name='tang' className='form-control'>
                                    <option value='1' selected={cate==null?true:cate.floor==1}>Tâng 1</option>
                                    <option value='2' selected={cate==null?true:cate.floor==2}>Tâng 2</option>
                                    <option value='3' selected={cate==null?true:cate.floor==3}>Tâng 3</option>
                                    <option value='4' selected={cate==null?true:cate.floor==4}>Tâng 4</option>
                                    <option value='5' selected={cate==null?true:cate.floor==5}>Tâng 5</option>
                                    <option value='6' selected={cate==null?true:cate.floor==6}>Tâng 6</option>
                                </select>
                                <br/><br/>
                                <button class="btn btn-primary form-control action-btn">Thêm/ Cập nhật bàn</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminTable;