import logo from '../../../assest/images/logo.png';
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import {getMethod, postMethod} from "../../../services/request"
import {formatMoney} from "../../../services/money"

export const HeaderContext = createContext();


var token = localStorage.getItem("token");
function SideBar (){
  const [user, setUser] = useState({});
  const [address, setAddress] = useState([]);
  const [totalRealEstate, setTotalRealEstate] = useState(0);
  useEffect(()=>{
    const getUser = async() =>{
      var response = await postMethod("/api/user/user/user-logged")
      var result = await response.json();
      setUser(result)
    };
    getUser();
    const getTotal = async() =>{
      var response = await getMethod("/api/real-estate/user/count-real-estate")
      var result = await response.text();
      setTotalRealEstate(result)
    };
    getTotal();
  }, []);

  import('../styles/styleuser.scss');

  function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace('login')
  }

  

return(
  <>
  <div class="thongtintaikhoan">
    <img src={user.avatar} id="avatartaikhoan" class="usertaikhoan"/>
    <span class="usernametaikhoan" id="usernametaikhoan">{user.fullname == null?user.username:user.fullname}</span>
  </div>
  <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start">
    <li><a href="taikhoan" class="nav-link"><i class="fas fa-user"></i> Tài khoản</a></li>
    <li><a href="lichsudat" class="nav-link"><i class="fas fa-clock"></i> Lịch sử đặt</a></li>
    <li><a href="doimatkhau" class="nav-link"><i class="fas fa-key"></i> Đổi mật khẩu</a></li>
    <li onClick={logout}><a href="huongdan" class="nav-link"><i class="fa fa-sign-out"></i> Đăng xuất</a></li>
  </ul>
  </>
);

    
}

export default SideBar;