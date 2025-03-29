import layoutAdmin from '../layout/admin/Layout'
import layoutLogin from '../layout/user/loginlayout/login'
import AccountLayout from '../layout/user/accountLayout/accountLayout'

//admin
import homeAdmin from '../pages/admin/index'
import userAdmin from '../pages/admin/user'
import AdminCategory from '../pages/admin/category'
import AdminBlog from '../pages/admin/blog'
import AdminAddBlog from '../pages/admin/addblog'
import AdminProduct from '../pages/admin/product'
import AdminAddProduct from '../pages/admin/addproduct'
import AdminTable from '../pages/admin/table'



//public
import login from '../pages/public/login'
import index from '../pages/public/index'
import TinTuc from '../pages/public/tintuc'
import ChiTietBaiViet from '../pages/public/chitietbaiviet'
import regisPage from '../pages/public/regis'
import confirmPage from '../pages/public/confirm'
import forgotPage from '../pages/public/forgot'
import datLaiMatKhauPage from '../pages/public/datlaimatkhau'

//user
import taikhoan from '../pages/user/taikhoan'
import DoiMatKhau from '../pages/user/doimatkhau'
import ThanhCong from '../pages/user/thanhcong'



const publicRoutes = [
    { path: "/", component: index},
    { path: "/index", component: index},
    { path: "/login", component: login, layout: layoutLogin },
    { path: "/regis", component: regisPage, layout: layoutLogin },
    { path: "/confirm", component: confirmPage, layout: layoutLogin },
    { path: "/forgot", component: forgotPage, layout: layoutLogin },
    { path: "/datlaimatkhau", component: datLaiMatKhauPage, layout: layoutLogin },
    { path: "/tin-tuc", component: TinTuc },
    { path: "/chitietbaiviet", component: ChiTietBaiViet },
];

const userRoutes = [
    { path: "/doimatkhau", component: DoiMatKhau, layout:AccountLayout },
    { path: "/thanhcong", component: ThanhCong, layout:AccountLayout },
    { path: "/taikhoan", component: taikhoan, layout:AccountLayout },
];


const adminRoutes = [
    { path: "/admin/index", component: homeAdmin, layout: layoutAdmin },
    { path: "/admin/user", component: userAdmin, layout: layoutAdmin },
    { path: "/admin/category", component: AdminCategory, layout: layoutAdmin },
    { path: "/admin/blog", component: AdminBlog, layout: layoutAdmin },
    { path: "/admin/add-blog", component: AdminAddBlog, layout: layoutAdmin },
    { path: "/admin/product", component: AdminProduct, layout: layoutAdmin },
    { path: "/admin/addproduct", component: AdminAddProduct, layout: layoutAdmin },
    { path: "/admin/table", component: AdminTable, layout: layoutAdmin },
];



export { publicRoutes, adminRoutes, userRoutes};
