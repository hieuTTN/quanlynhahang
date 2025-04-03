import {getMethod,getMethodPostByToken,getMethodByToken, postMethodPayload, uploadMultipleFile, deleteMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import Swal from 'sweetalert2'
import Select from 'react-select';


async function createInvoice() {
    var invoice = JSON.parse(localStorage.getItem("donhangcho"));
    var uls = new URL(document.URL)
    var vnpOrderInfo = uls.searchParams.get("vnp_OrderInfo");
    const currentUrl = window.location.href;
    const parsedUrl = new URL(currentUrl);
    const queryStringWithoutQuestionMark = parsedUrl.search.substring(1);
    var urlVnpay = queryStringWithoutQuestionMark
    invoice.vnpOrderInfo = vnpOrderInfo
    invoice.urlVnpay = urlVnpay
    const res = await postMethodPayload('/api/invoice/user/create', invoice)
    var result = await res.json();
    if (res.status < 300) {
        document.getElementById("thanhcong").style.display = 'block'
    }
    if (res.status == 417) {
        document.getElementById("thatbai").style.display = 'block'
        document.getElementById("thanhcong").style.display = 'none'
        document.getElementById("errormess").innerHTML = result.defaultMessage
    }
}


function PublicPayment(){
    useEffect(()=>{
        createInvoice();
    }, []);

    return(
    <div class="content contentlogin">
        <div style={{marginTop:'180px'}}>
            <div id="thanhcong">
                <h3>Đặt bàn thành công</h3>
                <p>Hãy kiểm tra thông tin đặt bàn của bạn trong lịch sử đặt</p>
                <a href="lichsudat" class="btn btn-danger">Xem lịch sử đặt bàn</a>
            </div>

            <div id="thatbai">
                <h3>Thông báo</h3>
                <p id="errormess">Bạn chưa hoàn thành thanh toán.</p>
                <p>Quay về <a href="/" style={{color:'red'}}>trang chủ</a></p>
            </div>
        </div>
    </div>
    );
}

export default PublicPayment;
