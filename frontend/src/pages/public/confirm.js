import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logologin from '../../assest/images/logologin.jpg'
import {postMethod} from '../../services/request'
import Swal from 'sweetalert2'

async function handleConfirm(event) {
    event.preventDefault();
    var uls = new URL(document.URL)
    var email = uls.searchParams.get("email");
    var key = event.target.elements.key.value
    const res = await postMethod('/api/user/active-account?email=' + email + '&key=' + key);
    if (res.status == 417) {
        var result = await res.json()
        toast.error(result.defaultMessage);
    }
    if(res.status < 300){
        Swal.fire({
            title: "Thông báo",
            text: "Xác thực thành công!",
            preConfirm: () => {
                window.location.href = 'login'
            }
        });
    }
};

function confirmPage(){
    return(
        <div class="contentweb">
        <div class="container">
            <div class="dangnhapform">
                <div class="divctlogin">
                    <p class="labeldangnhap">Đăng Ký</p>
                    <form onSubmit={handleConfirm} autocomplete="off">
                        <label class="lbform">Nhập mã xác thực</label>
                        <input required name='key' class="inputlogin"/>
                        <button class="btndangnhap">XÁC NHẬN</button>
                        <button type="button"  onClick={()=>{window.location.href = 'login'}} class="btndangky">ĐĂNG NHẬP</button>
                    </form><br/><br/><br/>
                </div>
            </div>
        </div>
    </div>
    );
}
export default confirmPage;