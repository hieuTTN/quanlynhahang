import logo from '../../../assest/images/logo.png';
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import {getMethod} from "../../../services/request"

export const HeaderContext = createContext();


var token = localStorage.getItem("token");
function Header (){
  var [numCart, setNumCart] = useState(0);
  const [categories, setCategories] = useState([]);
  useEffect(()=>{
    const getCategory = async() =>{
        var response = await getMethod("/api/category/public/find-all")
        var listCate = await response.json();
        setCategories(listCate)
    };
    getCategory();

    const getNumCart = async() =>{
        const response = await getMethod('/api/cart/user/count-cart');
        if(response.status > 300){
            setNumCart(0);
            return;
        }
        var numc = await response.text();
        setNumCart(numc);
    };
    if(token != null){
        getNumCart();
    }
}, []);
import('../styles/styleuser.scss');
var auth = <><a href="regis" class="dangkydn dangkymenu">Đăng ký</a>
<a href="login" class="dangkydn">Đăng nhập</a></>
if(token != null){
  auth = <ul class="navbar-nav me-auto mb-2 mb-lg-0 listitemmenu">
            <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle menucha" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Tài khoản của bạn
            </a>
            <ul class="dropdown-menu listitemtk" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="tincuatoi"><i class="fa fa-list"></i> Lịch sử đặt</a></li>
                <li><a class="dropdown-item" href="taikhoan"><i class="fa fa-user"></i> Thay đổi thông tin cá nhân</a></li>
                <li><a class="dropdown-item" href="doimatkhau"><i class="fa fa-key"></i> Đổi mật khẩu</a></li>
                <div class="dropdown-divider"></div>
                <li onClick={logout} ><a class="dropdown-item" href="#"><i class="fa fa-sign-out"></i> Đăng xuất</a></li>
            </ul>
            </li>
          </ul>
}

function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace('login')
}
return(
  <div class="header" id="header">
    <nav id="menu" class="navbar navbar-expand-lg">
        <a href="index"><img class="poiter imglogomenu" src={logo}/></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 listitemmenu" id="listitemmenu">
            <li class="nav-item"><a class="nav-link menucha" href="/">Trang chủ</a></li>
            {categories.slice(0, 7).map((item=>{
              return  <li class="nav-item"><a class="nav-link menucha" href={'timkiem?category='+item.id}>{item.name}</a></li>
            }))}
            <li class="nav-item"><a class="nav-link menucha" href="tin-tuc">Tin tức</a></li>
        </ul>
        <div class="d-flexs">
            {auth}
        </div>
        <div class="d-flex">
            <div className='divcartheader'>
              <span id='soluongcart' className='slcartheader'>{numCart}</span>
              <button onClick={()=>window.location.href='tel:0987123123'} class="btndangtinmoi">Menu</button>
            </div>
            <button onClick={()=>window.location.href='tel:0987123123'} class="btndangtinmoi">Liên hệ</button>
        </div>
        </div>
    </nav>
  </div>
);

    
}

export default Header;