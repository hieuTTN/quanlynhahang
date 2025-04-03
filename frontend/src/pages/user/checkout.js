import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod, postMethodTextPlan, postMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import {toast } from 'react-toastify';
import Swal from 'sweetalert2'
import vnpay from '../../assest/images/vnpay.jpg'
import Select from 'react-select';

function Checkout(){
    const [table, setTable] = useState([]);
    const [selectTable, setSelectTable] = useState([]);
    const [selectTableName, setSelectTableName] = useState([]);
    const [voucher, setVoucher] = useState([]);
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [selectDiaChi, setSelectDiaChi] = useState(null);
    const [maGiamGia, setMaGiamGia] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        var us = window.localStorage.getItem("token");
        if(us == null){
            window.location.replace('login')
        }
        loadCartCheckOut();
        const today = new Date().toISOString().split("T")[0]; // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
        document.getElementById("chonngay").value = today
        loadTable();
        loadVoucher();
        loadUser();
    }, []);


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
        const response = await getMethod('/api/voucher/user/kha-dung')
        var result = await response.json();
        setVoucher(result)
    }

    async function loadVoucher() {
        const response = await getMethod('/api/voucher/user/kha-dung')
        var result = await response.json();
        setVoucher(result)
    }

    async function loadUser() {
        const response = await postMethod('/api/user/user/user-logged')
        var result = await response.json();
        setUser(result)
    }

    async function requestPayMentVnpay() {
        if(selectTable.length ==0){
            toast.error("Bạn chưa chọn bàn nào");
            return;
        }
        var obj = {
            "fullName": document.getElementById("fullname").value,
            "phone": document.getElementById("phone").value,
            "note": document.getElementById("ghichudonhang").value,
            "bookDate": document.getElementById("chonngay").value,
            "listTableId": selectTable,
            "voucherId": maGiamGia == null?null:maGiamGia.id,
        }
        window.localStorage.setItem("donhangcho", JSON.stringify(obj));
        var pay = {
            "returnUrl":"http://localhost:3000/payment",
            "voucherId":maGiamGia == null?null:maGiamGia.id
        }
        const res = await postMethodPayload('/api/vnpay/user/urlpayment', pay)
        var result = await res.json();
        if (res.status < 300) {
            window.open(result.url, '_blank');
        }
        if (res.status == 417) {
            toast.warning(result.defaultMessage);
        }
    
    }

    async function loadTable() {
        setSelectTable([])
        setSelectTableName([])
        var date = document.getElementById("chonngay").value
        const response = await getMethod('/api/res-table/public/find-by-date?date=' + date)
        var result = await response.json();
        setTable(result)
        console.log(result);
    }

    const handleSelectTable = (table) => {
        if (selectTable.includes(table.resTable.id)) {
            // xóa khỏi list
            setSelectTable(selectTable.filter(id => id !== table.resTable.id));
            setSelectTableName(selectTableName.filter(name => name !== table.resTable.name));
        } 
        else if (selectTable.length < 5) {
            // append vào list
            setSelectTable([...selectTable, table.resTable.id]);
            setSelectTableName([...selectTableName, table.resTable.name]);
        }
        else if (selectTable.length == 5) {
            toast.warning("Chỉ được chọn tối đa 5 bàn")
        }
    };

    const groupedTables = table.reduce((acc, table) => {
        const floor = table.resTable.floor;
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(table);
        return acc;
    }, {});
    
    return(
        <div class="row">
        <div class="col-lg-8 col-md-8 col-sm-12 col-12 checkoutdiv" id="checkleft">
            <div class="inforship">
                <div class="row">
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <br/><span class="titlecheckout">Thông tin đặt bàn</span>
                        <input defaultValue={user?.fullname} id="fullname" class="form-control fomd" placeholder="Họ tên"/>
                        <input defaultValue={user?.phone} id="phone" class="form-control fomd" placeholder="Số điện thoại"/>
                        <textarea id="ghichudonhang" class="form-control fomd" placeholder="ghi chú"></textarea>
                        <br/><span class="titlecheckout">Thanh toán</span>
                        <table class="table tablepay">
                            <tr>
                                <td><label class="radiocustom">	Thanh toán qua Ví Vnpay
                                    <input value="vnpay" id="vnpay" type="radio" name="paytype" checked/>
                                    <span class="checkmark"></span></label></td>
                                <td><img src={vnpay} class="momopay"/></td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <br/><span class="titlecheckout">Chọn ngày</span>
                        <input onChange={()=>loadTable()} id='chonngay' className='form-control' type='date' />
                        <hr/>
                        {Object.keys(groupedTables).map(floor => (
                            <div key={floor}>
                                <h3>Tầng {floor}</h3>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {groupedTables[floor].map(table => (
                                        <button 
                                            key={table.resTable.id} 
                                            onClick={() => handleSelectTable(table)}
                                            disabled={!table.isEmpty}
                                            style={{
                                                padding: "10px 15px",
                                                cursor: table.isEmpty ? "pointer" : "not-allowed",
                                                backgroundColor: selectTable.includes(table.resTable.id) ? "green" : (table.isEmpty ? "lightgray" : "red"),
                                                color: "white",
                                                border: "none",
                                                borderRadius: "5px"
                                            }}
                                        >
                                            {table.resTable.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
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
                    <Select
                        options={voucher}
                        placeholder="--- Chọn mã giảm giá ---"
                        value={maGiamGia}
                        onChange={setMaGiamGia}
                        noOptionsMessage={() => "Không có mã giảm giá khả dụng"}
                        getOptionLabel={(e) => (
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <span role="img" aria-label="discount">
                                    🎟️
                                </span>{" "}
                                &nbsp; Giảm: {formatMoney(e.discount)} - Đơn tối thiểu: {formatMoney(e.minAmount)}
                            </div>
                        )}
                        getOptionValue={(e) => e.id}
                    />
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
                            <td class="colright ylsbold" id="totalfi">{maGiamGia == null?formatMoney(total): formatMoney(total - maGiamGia.discount)}</td>
                        </tr>
                        <tr>
                            <td>Bàn đã đặt</td>
                            <td class="colright ylsbold" id="totalfi">
                                <h3>{selectTableName.join(", ") || "Chưa chọn"}</h3>
                            </td>
                        </tr>
                    </table>
                    <button onClick={()=>requestPayMentVnpay()} class="btndathang">Đặt bàn</button><br/><br/>
                </div>
            </div>
        </div>
    </div>
    );
}
export default Checkout;