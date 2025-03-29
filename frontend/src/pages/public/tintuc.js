import Footer from '../../layout/user/footer/footer'
import banner from '../../assest/images/banner.jpg'
import userDefault from '../../assest/images/avatar.png'
import banner1 from '../../assest/images/banner1.png'
import banner2 from '../../assest/images/banner2.jpg'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import { useState, useEffect } from 'react'
import { Parser } from "html-to-react";
import ReactPaginate from 'react-paginate';
import {toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';


var sizepro = 10
var url = '';
function TinTuc(){
    const [newBlogs, setNewBlogs] = useState([]);
    const [bestViewBlogs, setBestViewBlogs] = useState([]);
    const [bestBlog, setBestBlog] = useState(null);
    const [pageCount, setpageCount] = useState(0);

    useEffect(()=>{
        const getBestView = async() =>{
            var response = await getMethod('/api/blog/public/best-view');
            var result = await response.json();
            setBestViewBlogs(result)
        };
        getBestView();
        const getNewBlog = async() =>{
            var response = await getMethod('/api/blog/public/findAll?size='+sizepro+'&sort=id,desc'+'&page='+0);
            var result = await response.json();
            setpageCount(result.totalPages)
            url = '/api/blog/public/findAll?size='+sizepro+'&sort=id,desc'+'&page='
            setNewBlogs(result.content)
            if(result.content.length > 0){
                setBestBlog(result.content[0])
            }
        };
        getNewBlog();
    }, []);
  
    const handlePageClick = async (data)=>{
        var currentPage = data.selected
        var response = await getMethod(url+currentPage)
        var result = await response.json();
        setNewBlogs(result.content)
        setpageCount(result.totalPages)
    }

    return(
        <>
        <div class="contentmains contentbaiviet">
        <div class="container">
            <div class="headerbaiviet">
                <h1 class="batdsnoibat">Tin tức bất động sản mới nhất</h1>
                <span class="motattheader">Thông tin mới, đầy đủ, hấp dẫn về thị trường bất động sản Việt Nam thông qua dữ liệu lớn về giá,<br/> 
                    giao dịch, nguồn cung - cầu và khảo sát thực tế của đội ngũ phóng viên, biên tập của Batdongsan.com.vn.</span>
            </div>
            <div class="row noidungdsbv">
                <div class="col-sm-8">
                    <div class="baivietchinh">
                        <img id="imgblogchinh" src={bestBlog?.image} class="imgblogchinh"/>
                        <a id="linkbvchinh" href={'chitietbaiviet?id='+bestBlog?.id}>
                            <div class="noidungbvchinh">
                                <div class="divndchinh">
                                    <span id="ngaydangbvchinh">{bestBlog?.createdDate} {bestBlog?.createdTime}</span>
                                    <h3 id="tieudebvchinh">{bestBlog?.title}</h3>
                                    <p class="motapribaiviet" id="motapribaivietchinh">{bestBlog?.description}</p>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="listbaivietbv" id="listbaivietbv">
                        {newBlogs.map((item=>{
                            return <div class="singlebaiviet">
                                <div class="row">
                                    <div class="col-sm-5">
                                        <a href="chitietbaiviet"><img src={item.image} class="anhbaiviet"/></a>
                                    </div>
                                    <div class="col-sm-7">
                                        <span class="timebaiviet">{item.createdDate} {item.createdTime} • {item.user.fullname}</span>
                                        <a href={'chitietbaiviet?id='+item.id} class="tieudebaiviet">{item.title}</a>
                                        <span class="motabaiviet">{item.description}</span>
                                        <span class="spuserdangbv"><img src={item.user.avatar == null?userDefault:item.user.avatar} class="userdangbaiviet"/> {item.user.fullname}</span>
                                    </div>
                                </div>
                            </div>
                        }))}
                    </div>
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
                <div class="col-sm-4">
                    <h5>Bài viết được xem nhiều nhất</h5>
                    <div id="listblogView" class="dsblogindex">
                        {bestViewBlogs.map((item=>{
                            return <div class="singleblogindex">
                                <span class="timebaiviet">{item.createdDate} {item.createdTime} • {item.user.fullname}</span>
                                <a href={'chitietbaiviet?id='+item.id}>{item.title}</a>
                            </div>
                        }))}
                    </div>
                </div>
            </div>
        </div>
    </div>
        </>
    );
}

export default TinTuc;
