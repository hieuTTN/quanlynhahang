import logomini from '../../assest/images/logomini.svg'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Select from 'react-select';
import {getMethod, postMethod, postMethodPayload} from '../../services/request';
import Swal from 'sweetalert2'
import { formatMoney } from '../../services/money';

async function createPayment() {
    var uls = new URL(document.URL)
    var orderId = uls.searchParams.get("orderId");
    var requestId = uls.searchParams.get("requestId");

    var res = await getMethod('/api/payment/all/check-payment?orderId='+orderId+'&requestId='+requestId)
    if (res.status < 300) {
        var result = await res.text();
        if(result == "NAP_TIEN_THAT_BAI"){
             document.getElementById("thatbai").style.display = 'block'
            document.getElementById("thanhcong").style.display = 'none'
        }
    }
    else {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
    }
}


function ThanhCong(){
    useEffect(()=>{
        createPayment();
    }, []);

  
    return(
        <>
            <div class="blockcontent">
                    <div id="thanhcong">
                        <h3>Nạp tiền thành công</h3>
                        <p>Cảm ơn bạn sử dụng dịch vụ của chúng tôi.</p>
                        <p>Hãy kiểm tra thông tin nạp tiền của bạn trong lịch sử nạp tiền</p>
                        <a href="lichsunap" class="btn btn-danger">Xem lịch sử nạp tiền</a>
                    </div>
            
                    <div id="thatbai">
                        <h3>Nạp tiền thất bại</h3>
                        <p>Bạn chưa hoàn thành thanh toán.</p>
                        <p>Quay về <a href="lichsunap">Lịch sử nạp</a></p>
                    </div>
            </div>
        </>
    );
}

export default ThanhCong;
