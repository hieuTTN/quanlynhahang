import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod, postMethod, postMethodPayload} from '../../services/request'
import {formatMoney, formatPrice} from '../../services/money'
import {formatDate} from '../../services/dateservice'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Select from 'react-select';

var sizepro = 16
var url = '';
function SanPham(){

    const [products, setProducts] = useState([]);
    const [itemCategories, setItemCategories] = useState([]);
    const [selectCategory, setSelectcategory] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const [method, setMethod] = useState("GET");
    const [payload, setPayload] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const getCate = async() =>{
            const response = await getMethod('/api/category/public/find-all');
            var result = await response.json();
            setItemCategories(result)
        };getCate();

        const getMonAn = async() =>{
            var uls = new URL(document.URL)
            var category = uls.searchParams.get("category");
            var response = await getMethod('/api/product/public/search-san-pham?size='+sizepro+'&idcategory='+category+'&sort=id,desc'+'&page='+0);
            var result = await response.json();
            setpageCount(result.totalPages)
            setProducts(result.content)
            url = '/api/product/public/search-san-pham?size='+sizepro+'&'+category+'&sort=id,desc'+'&page='
        };
        getMonAn();
    }, []);
    

    const searchFullMonAn = async() =>{
        setLoading(true); 
        var gia = document.getElementById("khoanggia").value.split("-")
        const categoryIds = selectCategory.map(category => category.id);
        var search = {
            "small":gia[0],
            "large":gia[1],
            "category":categoryIds,
        }
        var response = await postMethodPayload('/api/product/public/search-full-san-pham?size='+sizepro+'&sort=id,desc'+'&page='+0,search);
        var result = await response.json();
        setpageCount(result.totalPages)
        setProducts(result.content)
        url = '/api/product/public/search-full-san-pham?size='+sizepro+'&sort=id,desc'+'&page='
        setMethod("POST")
        setPayload(search)
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false); 
    };

    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = null;
        if(method == "GET"){
           response = await getMethod(url+currentPage)
        }
        if(method == "POST"){
            response = await postMethodPayload(url+currentPage, payload)
        }
        var result = await response.json();
        setProducts(result.content)
        setpageCount(result.totalPages)
    }



    const addToCart = async (id) => {
        const result = await postMethod('/api/cart/user/create?idproduct='+id);
        if(result.status < 300){
            toast.success("Thêm vào menu thành công");
            const response = await getMethod('/api/cart/user/count-cart');
            var numc = await response.text();
            document.getElementById("soluongcart").innerHTML = numc
        }
        else{
            toast.warning("Hãy đăng nhập");
        }
    };

    return(
        <>
            <div className='container topindex'>
                <div className='row'>
                    <div className='col-sm-3'>
                        <select id='khoanggia' className='form-control'>
                            <option value="0-100000000">Tất cả mức giá</option>
                            <option value="0-149000">Dưới 150.000 đ</option>
                            <option value="150000-199000">150.000 - 200.000 đ</option>
                            <option value="200000-300000">200.000 - 300.000 đ</option>
                            <option value="300000-500000">300.000 - 500.000 đ</option>
                            <option value="500000-1000000">500.000 - 1000.000 đ</option>
                            <option value="1000000-100000000">Trên 1000.000 đ</option>
                        </select>
                    </div>
                    <div className='col-sm-6'>
                        <Select isMulti options={itemCategories} value={selectCategory} onChange={setSelectcategory} placeholder="Chọn danh mục"
                                    getOptionLabel={(option) => option.name} 
                                    getOptionValue={(option) => option.id} /> 
                    </div>
                    <div className='col-sm-2'>
                        <button onClick={()=>searchFullMonAn()} className='form-control'><i className='fa fa-filter'></i> Lọc</button>
                    </div>
                </div>


                <span className='tieudemonanchoban'>Món Ăn Dành Cho Bạn</span>
                <div class="row">
                {products.map((item=>{
                    return <div class="col-sm-3">
                        <div class="singlebds">
                            <a><img src={item.imageBanner} class="imgdbs" onClick={()=>setProduct(item)}  data-bs-toggle="modal" data-bs-target="#modaldeail"/></a>
                            <div class="contentbds">
                                <a class="titlebdssingle" onClick={()=>setProduct(item)}  data-bs-toggle="modal" data-bs-target="#modaldeail">{item.name}</a>
                                <div class="divprice">
                                    <span class="pricebds">{formatMoney(item.price)}</span>
                                    <span class="priceold">{item.oldPrice == null?'':formatMoney(item.oldPrice)}</span>
                                </div><br/>
                                <button onClick={()=>addToCart(item.id)} className='btn btn-outline-primary form-control'>Thêm vào menu</button>
                            </div>
                        </div>
                    </div> 
                }))}
                </div>
                <br></br>
                <ReactPaginate 
                        marginPagesDisplayed={2} 
                        pageCount={pageCount} 
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'} 
                        pageClassName={'page-item'} 
                        pageLinkClassName={'page-link'}
                        previousClassName='page-item'
                        previousLinkClassName='page-link'
                        nextClassName='page-item'
                        nextLinkClassName='page-link'
                        breakClassName='page-item'
                        breakLinkClassName='page-link' 
                        previousLabel='Trang trước'
                        nextLabel='Trang sau'
                        activeClassName='active'/>
            </div>



        <div class="modal fade" id="modaldeail" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-fullscreen-sm-down">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Chi tiết món ăn</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <div class="row contentdetailproduct">
                    <div class="col-sm-6">
                        <img id="imgdetailpro" src={product?.imageBanner} class="imgdetailpro"/>
                        <div class="listimgdetail row" id="listimgdetail">
                          {product==null?'':
                            product.productImages.map((item, index)=>{
                                return <div class="col-sm-3 singdimg">
                                <br/><img onclick="clickImgdetail(this)" src={item.linkImage} class="imgldetail"/>
                            </div>
                            })
                          }
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <span class="detailnamepro" id="detailnamepro">{product?.name}</span>
                        <div class="blockdetailpro">
                            <span class="codepro" id="codepro">{product?.category.name}</span>
                        </div>
                        <p class="pricedetail" id="pricedetail">{product==null?'':formatMoney(product.price)}</p>
                    </div>
                    <div class="col-lg-12 motasp">
                        <p class="titledes">Mô tả sản phẩm</p>
                        <div id="descriptiondetail" dangerouslySetInnerHTML={ {__html: product==null?'':product.description} } >
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
        </>
    );
}

export default SanPham;
