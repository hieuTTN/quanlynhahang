import layoutAdmin from '../layout/admin/Layout'
import billAdmin from '../layout/admin/BillLayout'
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
import AdminVoucher from '../pages/admin/voucher'
import AdminAddVoucher from '../pages/admin/addvoucher'
import AdminLichSuDat from '../pages/admin/lichsudat'
import AdminThongbao from '../pages/admin/thongbao'
import ThongKeAdmin from '../pages/admin/thongke'
import InvoiceBill from '../pages/admin/inbill'



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
import PublicCheckout from '../pages/user/checkout'
import PublicPayment from '../pages/user/payment'
import LichSuDat from '../pages/user/lichsudat'



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
    { path: "/checkout", component: PublicCheckout },
    { path: "/payment", component: PublicPayment },
];

const userRoutes = [
    { path: "/doimatkhau", component: DoiMatKhau, layout:AccountLayout },
    { path: "/thanhcong", component: ThanhCong, layout:AccountLayout },
    { path: "/taikhoan", component: taikhoan, layout:AccountLayout },
    { path: "/lichsudat", component: LichSuDat, layout:AccountLayout },
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
    { path: "/admin/voucher", component: AdminVoucher, layout: layoutAdmin },
    { path: "/admin/addvoucher", component: AdminAddVoucher, layout: layoutAdmin },
    { path: "/admin/lichsudat", component: AdminLichSuDat, layout: layoutAdmin },
    { path: "/admin/thong-bao", component: AdminThongbao, layout: layoutAdmin },
    { path: "/admin/thongke", component: ThongKeAdmin, layout: layoutAdmin },
    { path: "/admin/inbill", component: InvoiceBill, layout: billAdmin },
];



export { publicRoutes, adminRoutes, userRoutes};
