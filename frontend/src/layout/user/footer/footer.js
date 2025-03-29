
function footer(){
    return(
     <>
      <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div class="me-5 d-none d-lg-block">
          <span></span>
        </div>
        <div>
          <a href="" class="me-4 text-reset"><i class="fab fa-facebook-f"></i></a>
          <a href="" class="me-4 text-reset"><i class="fab fa-twitter"></i></a>
          <a href="" class="me-4 text-reset"><i class="fab fa-google"></i></a>
          <a href="" class="me-4 text-reset"><i class="fab fa-instagram"></i></a>
          <a href="" class="me-4 text-reset"><i class="fab fa-linkedin"></i></a>
          <a href="" class="me-4 text-reset"><i class="fab fa-github"></i></a>
        </div>
      </section>
      <section class="">
        <div class="container text-center text-md-start mt-5">
          <div class="row mt-3">
            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <img src="image/logo.png" alt=""/><br/><br/>
              <p>CÔNG TY CỔ PHẦN PROPERTYGURU VIỆT NAM</p>
              <p><i class="fa fa-map-marker"></i> Tầng 31, Keangnam Hanoi Landmark, Phạm Hùng, Nam Từ Liêm, Hà Nội</p>
              <p><i class="fa fa-phone"></i> (024) 3562 5939 - (024) 3562 5940</p>
            </div>
            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4">Hướng dẫn</h6>
              <p><a href="#!" class="text-reset">Về chúng tôi</a></p>
              <p><a href="#!" class="text-reset">Báo giá & hỗ trợ</a></p>
              <p><a href="#!" class="text-reset">Câu hỏi thường gặp</a></p>
              <p><a href="#!" class="text-reset">Góp ý & báo lỗi</a></p>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4">Quy định</h6>
              <p><a href="#!" class="text-reset">Quy định đăng tin</a></p>
              <p><a href="#!" class="text-reset">Quy chế hoạt động</a></p>
              <p><a href="#!" class="text-reset">Điều khiển thỏa thuận</a></p>
              <p><a href="#!" class="text-reset">Chính sách bảo mật</a></p>
              <p><a href="#!" class="text-reset">Giải quyết khiếu nại</a></p>
            </div>
            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 class="text-uppercase fw-bold mb-4">ĐĂNG KÝ NHẬN TIN</h6>
              <div class="formlienhe">
                  <input type="text" class="form-control" placeholder="Nhập email của bạn"/>
                  <button class="sendem"><i class="fa fa-send"></i></button>
              </div>
            </div>
          </div>
        </div>
      </section>
     </>
    );
}

export default footer;