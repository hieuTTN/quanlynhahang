import Headers from "../header/header";
import SideBar from "../sidebar/sidebar"

function AccountLayout({children}){
    
    function openClose(){
        document.getElementById("sidebaruser").classList.toggle("hiddensidebar");
    }

    return (
        <div>
            <Headers/>
            <div class="contentmain contentbaiviet">
                <div class="container-fluid">
                    <div class="row flex-nowrap">
                        <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 navbarleft" id="sidebaruser">
                            <div class="d-flex flex-column px-3 pt-2 text-white" id="navbartaikhoan">
                                <div class="thongtintaikhoan toptttk">
                                    <i onClick={openClose} className='fa fa-bars'></i>
                                </div>
                                <SideBar/>
                            </div>
                        </div>
                        <div class="col py-3">
                            <div class="contentright" >
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountLayout;