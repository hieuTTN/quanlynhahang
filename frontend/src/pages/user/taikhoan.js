import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import Swal from 'sweetalert2'
import {getMethod, postMethod, postMethodPayload, uploadSingleFile} from '../../services/request';


var imageUser = '';
async function updateInfor() {
    document.getElementById("loading").style.display = 'block'
    var img = await uploadSingleFile(document.getElementById("inputchonavatar"))
    if(img != null){
        imageUser = img;
    }

    const payload = {
        fullname: document.getElementById("tenhienthi").value,
        phone: document.getElementById("sdt").value,
        avatar: imageUser,
    };
    console.log(payload);
    
    const res = await postMethodPayload('/api/user/all/update-infor', payload);
    if(res.status < 300){
        toast.success("Cập nhật thông tin tài khoản thành công")
    }
    else{
        toast.error("Cập nhật thông tin thất bại")
    }
    document.getElementById("loading").style.display = 'none'
};


function TaiKhoan(){
    const [user, setUser] = useState({});
    useEffect(()=>{
        const getUser = async() =>{
            var response = await postMethod("/api/user/user/user-logged")
            var result = await response.json();
            setUser(result)
            imageUser = result.avatar
        };
        getUser();
    }, []);

    function chonAnh(){
        document.getElementById("inputchonavatar").click();
    }

    function changeAnh(){
        const [file] = document.getElementById("inputchonavatar").files
        if (file) {
            document.getElementById("anhdaidien").src = URL.createObjectURL(file)
        }
    }

    return(
    <>
        <h3>Cập nhật thông tin cá nhân</h3>
        <div style={{margin:'auto'}} class="col-sm-8">
            <table class="table">
                <tr>
                    <td>Mã thành viên</td>
                    <td><input value={user.id} readonly disabled class="form-control"/></td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td><br/><input value={user.email} readonly disabled class="form-control"/></td>
                </tr>
                <tr>
                    <td>Tên hiển thị</td>
                    <td><br/><input defaultValue={user.fullname} id="tenhienthi" class="form-control"/></td>
                </tr>
                <tr>
                    <td>Số điện thoại</td>
                    <td><br/><input defaultValue={user.phone} id="sdt" class="form-control"/></td>
                </tr>
                <tr>
                    <td>Mật khẩu</td>
                    <td><br/><a class="pointer" href="doimatkhau">Đổi mật khẩu</a></td>
                </tr>
                <tr>
                    <td>Ảnh đại diện</td>
                    <td>
                        <div>
                            <img src={user.avatar} id="anhdaidien" class="anhdaidienupdate"/>
                            <br/><button onClick={chonAnh} id="btnuploadavatar" class="btn btn-secondary btnuploadavatar">Chọn ảnh</button>
                            <input onChange={changeAnh} id="inputchonavatar" type="file" style={{visibility:'hidden'}}/>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <div id="loading">
                            <div class="bar1 bar"></div>
                        </div><br/><br/>
                        <button onClick={updateInfor} class="btn btn-primary btntable">Cập nhật</button>
                    </td>
                </tr>
            </table>
        </div>
    </>
    );
}
export default TaiKhoan;
