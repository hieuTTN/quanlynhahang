import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
import {formatPrice} from '../../services/money'
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

var sizepro = 20
var url = '';
function Home(){

    var objs = {
        tinh:{value:0},
        huyen:{value:[]},
        duan:{value:""},
        mucgia:{value:""},
        dientich:{value:""},
        category:{value:[]},
    }

    const [objSearch, setObjSearch] = useState(objs);
    const [itemType, setItemType] = useState([]);
    const [itemNews, setItemNews] = useState([]);
    const [newBlogs, setNewBlogs] = useState([]);
    const [bestBlog, setBestBlog] = useState(null);
    const [pageCount, setpageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [realEstate, setRealEstate] = useState([]);


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
        const getBds = async() =>{
            var response = await getMethod('/api/real-estate/public/get-full?size='+sizepro+'&sort=id,desc'+'&page='+0);
            var result = await response.json();
            setpageCount(result.totalPages)
            setRealEstate(result.content)
            url = '/api/real-estate/public/get-full?size='+sizepro+'&sort=id,desc'+'&page='
        };
        getBds();
    }, []);
  

    async function xemTiepBds() {
    }

    return(
        <>
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
            <div class="divbdsindex">
            <div className='container containercustom'>
                <h3>Các món ăn dành cho bạn</h3>
            </div>
            </div>
        </>
    );
}

export default Home;
