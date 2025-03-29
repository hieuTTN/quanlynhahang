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


function ChiTietBaiViet(){
    const [blog, setBlog] = useState(null);
    const [bestViewBlogs, setBestViewBlogs] = useState([]);

    useEffect(()=>{
        const getBlog = async() =>{
            var uls = new URL(document.URL)
            var id = uls.searchParams.get("id");
            if(id != null){
                var response = await getMethod('/api/blog/public/findById?id='+id);
                var result = await response.json();
                setBlog(result)
            }
        };
        getBlog();
        const getBestView = async() =>{
            var response = await getMethod('/api/blog/public/best-view');
            var result = await response.json();
            setBestViewBlogs(result)
        };
        getBestView();
    }, []);
  
    return(
        <>
         <div class="contentmains contentbaiviet">
        <div class="container">
            <div class="headerbaiviet">
                <h1 id="tieudect">{blog?.title}</h1>
                <div class="nguoidangtin">
                    <img src={blog?.user.avatar == null ?userDefault:blog?.user.avatar} class="ctuserdangtin"/>
                    <div class="dangboi">
                        Được đăng bởi <span class="userdangbl" id="userdangbl">{blog?.user.fullname}</span><br/>
                        <span>Cập nhật lần cuối vào <span id="ngaydangblog">{blog?.createdDate}</span></span>
                    </div>
                </div>
            </div>
            <div class="row noidungdsbv">
                <div class="col-sm-8">
                    <p class="motabvdetail" id="motabvdetail">{blog?.description}</p>
                    <div id="noidungbaiviet" dangerouslySetInnerHTML={{__html:blog?.content}}>
                        
                    </div>
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

export default ChiTietBaiViet;
