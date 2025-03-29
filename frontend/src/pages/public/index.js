import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
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

var sizepro = 20
var url = '';
function Home(){

    const [newBlogs, setNewBlogs] = useState([]);
    const [products, setProducts] = useState([]);
    const [bestBlog, setBestBlog] = useState(null);
    const [itemCategories, setItemCategories] = useState([]);
    const [selectCategory, setSelectcategory] = useState([]);
    const [pageCount, setpageCount] = useState(0);
    const settings = {
        dots: true, 
        infinite: true, 
        speed: 500, // Tốc độ chuyển đổi
        slidesToShow: 10, // Số slide hiển thị
        slidesToScroll: 1, // Số slide cuộn mỗi lần
        autoplay: true, // Tự động chạy carousel
        autoplaySpeed: 2000, // Tốc độ tự chạy
        responsive: [
          {
            breakpoint: 600, // Với màn hình nhỏ hơn 600px
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 1000, 
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            },
          },
        ],
      };
    useEffect(()=>{
        const getNewBlog = async() =>{
            var response = await getMethod('/api/blog/public/findAll?size=6&sort=id,desc&page=0');
            var result = await response.json();
            setNewBlogs(result.content)
            if(result.content.length > 0){
                setBestBlog(result.content[0]);
            }
        };
        getNewBlog();
        const getCate = async() =>{
            const response = await getMethod('/api/category/public/find-all');
            var result = await response.json();
            setItemCategories(result)
        };getCate();

        const getMonAn = async() =>{
            var response = await getMethod('/api/product/public/findAll?size='+sizepro+'&sort=id,desc'+'&page='+0);
            var result = await response.json();
            setpageCount(result.totalPages)
            setProducts(result.content)
            url = '/api/product/public/findAll?size='+sizepro+'&sort=id,desc'+'&page='
        };
        getMonAn();
    }, []);
  


    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setProducts(result.content)
        setpageCount(result.totalPages)
    }


    return(
        <>
            <div className='container topindex'>
                <div className='row'>
                    <div className='col-sm-3'>
                        <span className='lbtimkiemsp'>Tìm kiếm món ăn</span>
                    </div>
                    <div className='col-sm-3'>
                        <select className='form-control'>
                            <option value="0-100000000">Tất cả mức giá</option>
                            <option value="0-149000">Dưới 150.000 đ</option>
                            <option value="150000-199000">150.000 - 200.000 đ</option>
                            <option value="200000-300000">200.000 - 300.000 đ</option>
                            <option value="300000-500000">300.000 - 500.000 đ</option>
                            <option value="500000-1000000">500.000 - 1000.000 đ</option>
                            <option value="1000000-100000000">Trên 1000.000 đ</option>
                        </select>
                    </div>
                    <div className='col-sm-4'>
                        <Select isMulti options={itemCategories} value={selectCategory} onChange={setSelectcategory} placeholder="Chọn danh mục"
                                    getOptionLabel={(option) => option.name} 
                                    getOptionValue={(option) => option.id} /> 
                    </div>
                    <div className='col-sm-2'>
                        <button className='form-control'><i className='fa fa-filter'></i> Lọc</button>
                    </div>
                </div>
                <div className="listdmindex owl-2-style">
                    <Slider {...settings} className="owl-2">
                        {itemCategories.map((item) => (
                        <div key={item.id} className="media-29101">
                            <div className='divimgslide'>
                                <a href={`product?category=${item.id}`}>
                                    <img src={item.image} alt={item.name} className="img-fluid" />
                                </a>
                            </div>
                            <h3>
                                <a href="#">{item.name}</a>
                            </h3>
                        </div>
                        ))}
                    </Slider>
                </div>


                <span className='tieudemonanchoban'>Món Ăn Dành Cho Bạn</span>
                <div class="row">
                {products.map((item=>{
                    return <div class="col-sm-3">
                        <div class="singlebds">
                            <a href={'chi-tiet-tin-dang?id='+item.id}><img src={item.imageBanner} class="imgdbs"/></a>
                            <div class="contentbds">
                                <a href={'chi-tiet-tin-dang?id='+item.id} class="titlebdssingle">{item.name}</a>
                                <div class="divprice">
                                    <span class="pricebds">{formatMoney(item.price)}</span>
                                    <span class="priceold">{item.oldPrice == null?'':formatMoney(item.oldPrice)}</span>
                                </div>
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
            <div className='container containercustom'>
                <div class="blogindex col-sm-8">
                    <div class="topblogindex">
                        <h3>Tin nổi bật</h3>
                        <a class="xemthemblog" href="tin-tuc">Xem thêm  <i class="fa fa-arrow-right"></i> </a>
                    </div>
                    <div class="row listblogindex">
                        <div class="col-sm-6">
                            <a href={'chitietbaiviet?id='+bestBlog?.id} id="hrefimgpri"><img src={bestBlog?.image} id="blogpriimage" class="blogpriimage"/></a>
                            <a href={'chitietbaiviet?id='+bestBlog?.id} class="titlepriindex" id="titlepriindex">{bestBlog?.title}</a>
                        </div>
                        <div class="col-sm-6">
                            {newBlogs.map((item=>{
                                return <div id="listblogindex" class="dsblogindex">
                                    <div class="singleblogindex">
                                        <a href={'chitietbaiviet?id='+item.id}>{item.title}</a>
                                    </div>
                                </div>
                            }))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
