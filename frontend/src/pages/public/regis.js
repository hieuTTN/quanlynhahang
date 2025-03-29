import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {postMethodPayload} from '../../services/request'
import Swal from 'sweetalert2'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';

async function handleRegis(event) {
    event.preventDefault();
    if(event.target.elements.password.value != event.target.elements.repassword.value){
        toast.error("Mật khẩu không trùng khớp");
        return;
    }
    const payload = {
        email: event.target.elements.email.value,
        password: event.target.elements.password.value,
        fullname: event.target.elements.fullname.value,
        phone: event.target.elements.phone.value,
    };
    const res = await postMethodPayload('/api/user/regis',payload)
    var result = await res.json()
    console.log(result);
    if (res.status == 417) {
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Thông báo",
            text: "Đăng ký thành công, kiểm tra email của bạn!",
            preConfirm: () => {
                window.location.href = 'confirm?email=' + result.email
            }
        });
    }
};

function regisPage(){
    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divctlogin">
                    <p class="labeldangnhap">Đăng Ký</p>
                    <form onSubmit={handleRegis} autocomplete="off">
                        <label class="lbform">Email</label>
                        <input required name='email' class="inputlogin"/>
                        <label class="lbform">Họ tên</label>
                        <input required name='fullname' class="inputlogin"/>
                        <label class="lbform">Số điện thoại</label>
                        <input required name='phone' class="inputlogin"/>
                        <label class="lbform">Mật khẩu</label>
                        <input required name='password' type="password" class="inputlogin"/>
                        <label class="lbform">Nhập lại mật khẩu</label>
                        <input required name='repassword' type="password" class="inputlogin"/>
                        <button class="btndangnhap">ĐĂNG KÝ</button>
                        <button type="button"  onClick={()=>{window.location.href = 'login'}} class="btndangky">ĐĂNG NHẬP</button>
                    </form><br/><br/><br/>
                </div>
            </div>
        </div>
    </div>
    );
}
export default regisPage;