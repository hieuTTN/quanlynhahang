import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import Swal from 'sweetalert2'
import vnpay from '../../assest/images/vnpay.jpg'
import Select from 'react-select';

function Checkout(){
    const [diaChi, setDiaChi] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectDiaChi, setSelectDiaChi] = useState(null);
    const [tongTien, setTongTien] = useState(0);
    const [maGiamGia, setMaGiamGia] = useState(null);
    const [mess, setMess] = useState(null);
    const [loaiThanhToan, setLoaiThanhToan] = useState("PAYMENT_MOMO");
    const [listSize, setListSize] = useState();

    useEffect(()=>{
        var us = window.localStorage.getItem("token");
        if(us == null){
            window.location.replace('login')
        }
        loadCartCheckOut();
    }, []);
    const getDiaChiUser = async() =>{
        var response = await getMethod('/api/user-address/user/my-address');
        var result = await response.json();
        setDiaChi(result)
    };


    async function loadCartCheckOut() {
        var response = await getMethod("/api/cart/user/my-cart")
        var result = await response.json();
        setCart(result)
        var tong = 0;
        for(var i=0; i< result.length; i++){
            tong += result[i].quantity * result[i].product.price
        }
        setTotal(tong)
        if (result.length == 0) {
            alert("Bạn chưa có sản phẩm nào trong giỏ hàng!");
            window.location.replace("/");
            return;
        }
    }

    async function loadVoucher() {
        var code = document.getElementById("codevoucher").value
        var url = 'http://localhost:8080/api/voucher/public/findByCode?code=' + code + '&amount=' + (tongTien);
        const response = await fetch(url, {});
        var result = await response.json();
        if (response.status == 417) {
            setMaGiamGia(null)
            setMaGiamGia(null)
            setMess(result.defaultMessage)
            document.getElementById("totalfi").innerHTML = formatMoney(tongTien)
        }
        if (response.status < 300) {
            setMaGiamGia(result)
            setMess(null)
            document.getElementById("totalfi").innerHTML = formatMoney(tongTien - result.discount)
        }
    
    }

    function clickLoaiTt(loai){
        if(loai == 1){
            document.getElementById("momo").checked = true
            setLoaiThanhToan("PAYMENT_MOMO")
        }
        if(loai == 2){
            document.getElementById("vnpay").checked = true
            setLoaiThanhToan("PAYMENT_VNPAY")
        }
        if(loai == 3){
            document.getElementById("cod").checked = true
            setLoaiThanhToan("PAYMENT_DELIVERY")
        }
    }

    function checkout() {
        var con = window.confirm("Xác nhận đặt hàng!");
        if (con == false) {
            return;
        }
        if(selectDiaChi == null){
            if(diaChi.length == 0){
                 Swal.fire({
                    title: "Thông báo",
                    text: "Bạn chưa có địa chỉ nhận hàng nào, thêm mới địa chỉ để mua hàng!",
                    preConfirm: () => {
                        window.location.href = 'account'
                    }
                });
            }
            else{
                toast.error("Hãy chọn 1 địa chỉ nhận hàng");
            }
            return;
        }
        if(maGiamGia == null) window.localStorage.removeItem('voucherCode');
        if (loaiThanhToan == "PAYMENT_MOMO") {
            requestPayMentMomo()
        }
        if (loaiThanhToan == "PAYMENT_DELIVERY") {
            paymentCod();
        }
        if (loaiThanhToan == "PAYMENT_VNPAY") {
            requestPayMentVnpay();
        }
    }


    async function requestPayMentMomo() {
        window.localStorage.setItem('ghichudonhang', document.getElementById("ghichudonhang").value);
        window.localStorage.setItem('paytype', "MOMO");
        window.localStorage.setItem('sodiachi', selectDiaChi.id);
        if(maGiamGia != null) window.localStorage.setItem('voucherCode', maGiamGia.code);
        var paymentDto = {
            "content": "thanh toán đơn hàng yody",
            "returnUrl": 'http://localhost:3000/payment',
            "notifyUrl": 'http://localhost:3000/payment',
            "listProductSize": listSize
        }
        console.log(paymentDto);
        
        if(maGiamGia != null) paymentDto.codeVoucher = maGiamGia.code
        const res = await postMethodPayload('/api/urlpayment',paymentDto)
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
    
    }
    
    
    async function requestPayMentVnpay() {
        window.localStorage.setItem('ghichudonhang', document.getElementById("ghichudonhang").value);
        window.localStorage.setItem('paytype', "VNPAY");
        window.localStorage.setItem('sodiachi', selectDiaChi.id);
        if(maGiamGia != null) window.localStorage.setItem('voucherCode', maGiamGia.code);
    
        var paymentDto = {
            "content": "thanh toán đơn hàng yody",
            "returnUrl": 'http://localhost:3000/payment',
            "notifyUrl": 'http://localhost:3000/payment',
            "listProductSize": listSize
        }
        if(maGiamGia != null) paymentDto.codeVoucher = maGiamGia.code
        const res = await postMethodPayload('/api/vnpay/urlpayment', paymentDto)
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
    
    }
    
    async function paymentCod() {
        var orderDto = {
            "payType": "PAYMENT_DELIVERY",
            "userAddressId": selectDiaChi.id,
            "note": document.getElementById("ghichudonhang").value,
            "listProductSize": listSize
        }
        if(maGiamGia != null) 
            orderDto.voucherCode = maGiamGia.code
        const res = await postMethodPayload('/api/invoice/user/create', orderDto)
        if (res.status < 300) {
            Swal.fire({
                title: "Thông báo",
                text: "Đặt hàng thành công!",
                preConfirm: () => {
                    window.localStorage.removeItem("product_cart")
                    window.location.replace("account#invoice")
                }
            });
        }
    }

    return(
        <div class="row">
        <div class="col-lg-8 col-md-8 col-sm-12 col-12 checkoutdiv" id="checkleft">
            <div class="inforship">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <br/><span class="titlecheckout">Thông tin đặt bàn</span>
                        <input value={selectDiaChi?.fullname} id="fullname" class="form-control fomd" placeholder="Họ tên"/>
                        <input value={selectDiaChi?.phone} id="phone" class="form-control fomd" placeholder="Số điện thoại"/>
                        <textarea id="ghichudonhang" class="form-control fomd" placeholder="ghi chú"></textarea>
                        <br/><span class="titlecheckout">Chọn ngày</span>
                        <input className='form-control' type='date' />
                        <br/><span class="titlecheckout">Chọn bàn</span>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <br/><span class="titlecheckout">Thanh toán</span>
                        <table class="table tablepay">
                            <tr onClick={()=>clickLoaiTt(2)}>
                                <td><label class="radiocustom">	Thanh toán qua Ví Vnpay
                                    <input value="vnpay" id="vnpay" type="radio" name="paytype" checked/>
                                    <span class="checkmark"></span></label></td>
                                <td><img src={vnpay} class="momopay"/></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <div class="notecheckout">
                <hr/>
            </div>
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12 col-12" id="checkright">
            <div class="infordoncheck">
                <span class="dhcheck">Menu món ăn đã chọn (<span id="slcartcheckout">{cart.length}</span> sản phẩm)</span>
                <div id="listproductcheck">
                {cart.map((item=>{
                    return <div class="row singlecartcheckout">
                        <div class="col-lg-2 col-md-3 col-sm-3 col-3 colimgcheck">
                            <img src={item.product.imageBanner} class="procheckout"/>
                            <span class="slpro">{item.quantity}</span>
                        </div>
                        <div class="col-lg-7 col-md-6 col-sm-6 col-6">
                            <span class="namecheck">{item.product.name}</span>
                        </div>
                        <div class="col-lg-3 col-md-3 col-sm-3 col-3 pricecheck">
                            <span>{formatMoney(item.product.price * item.quantity)}</span>
                        </div>
                    </div>
                    }))}
                </div>
                <div class="row magg">
                    <select className='form-control'>
                        <option disabled selected value={-1}>---Chọn mã giảm giá---</option>
                    </select>
                    {maGiamGia && (
                    <div class="col-12">
                        <span class="successvou">Mã giảm giá đã được áp dụng</span>
                    </div>
                    )}
                    {mess && (
                    <div class="col-12">
                        <div class="col-12">
                            <br/><i class="fa fa-warning"> <span id="messerr">{mess}</span></i>
                        </div>
                    </div>
                    )}
                </div>
                <div class="magg">
                    <table class="table">
                        <tr>
                            <td>Tạm tính</td>
                            <td class="colright" id="totalAmount">{formatMoney(total)}</td>
                        </tr>
                        <tr>
                            <td>Giảm giá</td>
                            <td class="colright" id="moneyDiscount">{maGiamGia == null?'0đ':formatMoney(maGiamGia.discount)}</td>
                        </tr>
                        <tr>
                            <td>Tổng cộng</td>
                            <td class="colright ylsbold" id="totalfi">{formatMoney(tongTien)}</td>
                        </tr>
                    </table>
                    <button onClick={()=>checkout()} class="btndathang">Đặt bàn</button><br/><br/>
                </div>
            </div>
        </div>
    </div>
    );
}
export default Checkout;