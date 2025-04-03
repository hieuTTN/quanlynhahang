import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'


function DoiMatKhau(){
    useEffect(()=>{
    }, []);
  
    return(
        <>
            <div class="ghichuql">
                <p>Cập nhật mật khẩu</p>
            </div>
            <div class="headeraccount">
                <span class="fontyel"></span><span class="smyl"> Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</span>
            </div>
            <div class="col-lg-9 col-md-8 col-sm-12 col-12 passacc">
                <form onSubmit={handleChangePass} autocomplete="off">
                    <label class="lbacc">Mật khẩu hiện tại *</label>
                    <input name="oldpass" type="password" class="form-control" required/>
                    <label class="lbacc">Mật khẩu mới *</label>
                    <input name="newpass" type="password" class="form-control" required/>
                    <label class="lbacc">Xác nhận mật khẩu mới *</label>
                    <input name="renewpass" type="password" class="form-control" required/>
                    <br/>
                    <button type="submit" class="btndoimk">LƯU</button>
                </form>
            </div>
        </>
    );
}

export default DoiMatKhau;