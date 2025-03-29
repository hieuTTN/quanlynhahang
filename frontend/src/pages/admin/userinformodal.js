import {formatMoney} from '../../services/money';

function UserInforModal({user}){
  
    return(
        <>
            <div class="modal fade" id="chiTietUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="false">
                <div class="modal-dialog modal-md">
                    <div class="modal-content">
                        <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Thông tin user</h5> <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>
                        <div class="modal-body row">
                            <table className='table table-borderless'>
                                <tr>
                                    <th>Id user</th>
                                    <td>{user.id}</td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>{user.email}</td>
                                </tr>
                                <tr>
                                    <th>Username</th>
                                    <td>{user.username}</td>
                                </tr>
                                <tr>
                                    <th>Họ tên</th>
                                    <td>{user.fullname}</td>
                                </tr>
                                <tr>
                                    <th>Số điện thoại</th>
                                    <td>{user.phone}</td>
                                </tr>
                                <tr>
                                    <th>Ngày tạo</th>
                                    <td>{user.createdDate}</td>
                                </tr>
                                <tr>
                                    <th>Loại tài khoản</th>
                                    <td>{user.authorities?.name}</td>
                                </tr>
                                <tr>
                                    <th>Tổng tiền</th>
                                    <td>{formatMoney(user.amount)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserInforModal;
