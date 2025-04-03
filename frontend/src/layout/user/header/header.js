import logo from '../../../assest/images/logo.png';
import { useState, useEffect } from 'react'
import React, { createContext, useContext } from 'react';
import {deleteMethod, getMethod} from "../../../services/request"
import {formatMoney, formatPrice} from '../../../services/money'
import { toast } from 'react-toastify';
export const HeaderContext = createContext();


var token = localStorage.getItem("token");
function Header (){
  var [numCart, setNumCart] = useState(0);
  const [categories, setCategories] = useState([]);
  const [carts, setCarts] = useState([]);
  const [total, setTotal] = useState(0);
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

  const getCart = async() =>{
    var response = await getMethod("/api/cart/user/my-cart")
    var result = await response.json();
    setCarts(result)
    var tong = 0;
    for(var i=0; i< result.length; i++){
      tong += result[i].quantity * result[i].product.price
    }
    setTotal(tong)
  };

  const updateQuantity = async (id, quantity) => {
    const result = await getMethod('/api/cart/user/up-and-down-cart?id='+id+'&quantity='+quantity);
    getCart();
  };

  const deleteCart = async(id) =>{
    var con = window.confirm("Xác nhận xóa món ăn ra khỏi menu");
    if(con == false) return;
    var response = await deleteMethod("/api/cart/user/delete?id="+id)
    toast.success("Đã xóa món ăn ra khỏi menu");
    getCart();
  };


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
    <>
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
                <button onClick={()=>getCart()} data-bs-toggle="modal" data-bs-target="#cartModal" class="btndangtinmoi">Menu</button>
              </div>
              <button onClick={()=>window.location.href='tel:0987123123'} class="btndangtinmoi">Liên hệ</button>
          </div>
          </div>
      </nav>
    </div>

    <div class="modal fade" id="cartModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title">Menu món ăn của bạn</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body">
                      <div class="table-responsive">
                          <table class="table">
                              <thead>
                                  <tr>
                                      <th>Sản phẩm</th>
                                      <th>Giá</th>
                                      <th>Số lượng</th>
                                      <th>Tổng</th>
                                      <th></th>
                                  </tr>
                              </thead>
                              <tbody id="listcart">
                              {carts.map((item=>{
                                  return <tr>
                                      <td>
                                          <div class="d-flex align-items-center">
                                              <img src={item.product.imageBanner} alt="Túi xách" class="me-2"/>
                                              <span>{item.product.name}</span>
                                          </div>
                                      </td>
                                      <td>{formatMoney(item.product.price)}</td>
                                      <td>
                                          <div class="input-group">
                                              <button onClick={()=>updateQuantity(item.id, -1)} class="btn btn-outline-secondary btn-sm">-</button>
                                              <input type="text" class="form-control text-center" value={item.quantity}/>
                                              <button onClick={()=>updateQuantity(item.id, 1)} class="btn btn-outline-secondary btn-sm">+</button>
                                          </div>
                                      </td>
                                      <td>{formatMoney(item.product.price * item.quantity)}</td>
                                      <td>
                                          <button onClick={()=>deleteCart(item.id)} class="btn btn-outline-danger btn-sm">
                                              <i class="fas fa-trash"></i>
                                          </button>
                                      </td>
                                  </tr>
                              }))}
                              </tbody>
                          </table>
                      </div>
                      
                      <div class="d-flex justify-content-end">
                          <div class="text-end">
                              <h5>Tổng cộng: <span class="text-danger" id="tongtien">{formatMoney(total)}</span></h5>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                      <a href="checkout" class="btn btn-primary">Tiến hành đặt bàn</a>
                  </div>
              </div>
          </div>
      </div>
    </>
  );

    
}

export default Header;