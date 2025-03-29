import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {postMethod} from '../../services/request'
import Swal from 'sweetalert2'

async function forgorPassword(event) {
    event.preventDefault();
    var password = event.target.elements.password.value
    var repassword = event.target.elements.repassword.value
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = uls.searchParams.get("key");
    if(password != repassword){
        toast.warning("Password not match");
        return;
    }
    const res = await postMethod('/api/user/public/finish-reset-pass?email=' + email+"&key="+key+"&password="+password)
    if (res.status < 300) {
        Swal.fire({
            title: "Thông báo",
            text: "Đặt lại mật khẩu thành công",
            preConfirm: () => {
                window.location.replace("login")
            }
        });
    }
    if (res.status == 417) {
        var result = await res.json()
        toast.warning(result.defaultMessage);
    }
}

function datLaiMatKhauPage(){
    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divctlogin">
                    <p class="labeldangnhap">Quên mật khẩu</p>
                    <form onSubmit={forgorPassword} autocomplete="off">
                        <label class="lbform">Nhập mật khẩu mới</label>
                        <input type='password' name='password' class="inputlogin"/>
                        <label class="lbform">Xác nhận mật khẩu mới</label>
                        <input type='password' name='repassword' class="inputlogin"/>
                        <button class="btndangnhap">XÁC NHẬN</button>
                        <button type="button"  onClick={()=>{window.location.href = 'login'}} class="btndangky">ĐĂNG NHẬP</button>
                    </form><br/><br/><br/>
                </div>
            </div>
        </div>
    </div>
    );
}
export default datLaiMatKhauPage;