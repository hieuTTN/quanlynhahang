import lich from '../../assest/images/lich.png'
import { useState, useEffect } from 'react'
import {getMethod} from '../../services/request'
import {formatMoney} from '../../services/money'
import Chart from "chart.js/auto";
import Select from 'react-select';
import { Button, Card, Col, DatePicker, Input, Pagination, Row, Table } from "antd";
import { Bar } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


var token = localStorage.getItem("token");

const { RangePicker } = DatePicker;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const ThongKeAdmin = ()=>{
    const [chartData, setChartData] = useState(null);
    const [doanhThuNgay, setDoanhThuNgay] = useState([]);
    const [doanhThunamdata, setDoanhThuNamData] = useState([]);
    const [doanhThuThangNay, setDoanhThuThangNay] = useState(0);
    const [doanhthuHomNay, setDoanhThuHomNay] = useState(0);
    const [soLuongUser, setSoLuongUser] = useState(0);
    const [soLuongBds, setSoLuongBds] = useState(0);
    const [year, setYear] = useState([]);
    const [curyear, setCurYear] = useState(0);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    
    useEffect(()=>{
        const getThongKe= async() =>{
            var response = await getMethod('/api/statistic/admin/doanh-thu-thang-nay');
            var result = await response.text();
            setDoanhThuThangNay(result)
            
            var response = await getMethod('/api/statistic/admin/doanh-thu-hom-nay');
            var result = await response.text();
            setDoanhThuHomNay(result)

            var response = await getMethod('/api/statistic/admin/so-luong-user');
            var result = await response.text();
            setSoLuongUser(result)

            var response = await getMethod('/api/statistic/admin/so-luong-product');
            var result = await response.text();
            setSoLuongBds(result)

            var year = new Date().getFullYear();
            var response = await getMethod('/api/statistic/admin/doanh-thu-nam?nam='+year);
            var result = await response.json();
            setDoanhThuNamData(result);
            doanhThunam(result)
            setCurYear(year)

            var response = await getMethod('/api/statistic/admin/invoice-huy');
            var result = await response.json();
            bieuDoTinViPham(result)
        };
        getThongKe();
        getMauSac();

        function getYear(){
            var year = new Date().getFullYear();
            var arr = [];
            for(var i = year; i> 2010; i--){
                var obj = {
                    label:"năm "+i,
                    value:i
                }
                arr.push(obj)
            }
            setYear(arr)
        }
        getYear();


    }, []);


    async function locDoanhThuNam(option) {
        var nam = option.value;
        setCurYear(nam)
        var response = await getMethod('/api/statistic/admin/doanh-thu-nam?nam='+nam);
        var result = await response.json();
        setDoanhThuNamData(result)
        doanhThunam(result)
    }

    async function doanhThunam(list) {
        var lb = 'doanh thu năm ';
        document.getElementById("bieudo").innerHTML = `<canvas id="chart"></canvas>`
        const ctx = document.getElementById("chart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ["tháng 1", "tháng 2", "tháng 3", "tháng 4",
                    "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
                ],
                datasets: [{
                    label: lb,
                    backgroundColor: 'rgba(161, 198, 247, 1)',
                    borderColor: 'rgb(47, 128, 237)',
                    data: list,
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value) {
                                return formatmoney(value);
                            }
                        }
                    }]
                }
            },
        });
    }
    

    async function bieuDoTinViPham(list) {
        var lb = 'Đơn hủy/ Đơn khác';
        console.log(list);
        
        document.getElementById("bieudoVipham").innerHTML = `<canvas id="chartViPham"></canvas>`
        const ctx = document.getElementById("chartViPham").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Đơn khác', 'Đơn hủy'],
                datasets: [{
                    label: 'My Dataset',
                    data: list,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }

    async function loadDoanhThuNgay(){
        if(from == '' || to == ''){
            toast.error("Hãy chọn ngày");return;
        }
        const date1 = new Date(from);
        const date2 = new Date(to);
        const diffInMs = Math.abs(date2 - date1);
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        var response = await getMethod('/api/statistic/admin/doanh-thu-ngay?from='+from+'&to='+to);
        var result = await response.json();
        console.log(result);
        setDoanhThuNgay(result)
        const labels = result.map(item => item.ngay);
        const data = result.map(item => item.doanhThu);
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Doanh thu theo ngày',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        });
    }
    
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    
    function formatmoney(money) {
        return VND.format(money);
    }
    
    function onDateChange(dates, dateStrings){
        console.log(dates);
        console.log(dateStrings);
        setFrom(dateStrings[0])
        setTo(dateStrings[1])
    }

    function xuatExcelNgay(){
        const formattedData = doanhThuNgay.map(item => ({
            "Ngày": item.ngay,
            "Doanh thu": item.doanhThu
        }));
    
        // Tạo worksheet (tự động có hàng tiêu đề là "Ngày", "Doanh thu")
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
        // Tăng độ rộng các cột
        worksheet["!cols"] = [
            { wch: 15 }, // "Ngày"
            { wch: 20 }  // "Doanh thu"
        ];
    
        // Tạo workbook và ghi file
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhThuNgay");
    
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    
        saveAs(file, `doanh-thu-ngay_${from + '-'+to}.xlsx`);
    }
  
    function xuatExcelNam(){
          // Tạo mảng dữ liệu từ tháng 1 đến 12
        const rows = doanhThunamdata.map((doanhThu, index) => ({
            "Tháng": index + 1,
            "Doanh thu": doanhThu
        }));

        // Tạo worksheet từ dữ liệu (ghi từ dòng 2)
        const worksheet = XLSX.utils.json_to_sheet(rows, { origin: "A2" });

        // Ghi dòng đầu tiên là tiêu đề năm (dòng 1, cột A)
        XLSX.utils.sheet_add_aoa(worksheet, [[`Doanh thu năm ${curyear}`]], { origin: "A1" });

        // Đặt độ rộng cho cột
        worksheet["!cols"] = [
            { wch: 10 }, // Cột Tháng
            { wch: 20 }  // Cột Doanh thu
        ];

        // Tạo workbook và xuất file
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhThuNam");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const file = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(file, `doanh-thu-nam-${curyear}.xlsx`);
        
    }
    return(
       <>
        <div class="row">
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Doanh thu tháng này</span>
                    <span className='solieudoanhthu'>{formatMoney(doanhThuThangNay)}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Doanh thu hôm nay</span>
                    <span className='solieudoanhthu'>{formatMoney(doanhthuHomNay)}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Số lượng người dùng</span>
                    <span className='solieudoanhthu'>{soLuongUser}</span>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-4">
                <div class="card border-left shadow h-100 py-2">
                    <span class="lbcard">Số lượng sản phẩm</span>
                    <span className='solieudoanhthu'>{soLuongBds}</span>
                </div>
            </div>
        </div>
        <div className='row'>
            <div className='col-sm-3'>
                <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                    <strong class="text-left"><i className='fa fa-users'></i>Số đơn hủy/ số đơn khác</strong>
                </div>
                <div class="col-sm-12 divtale">
                    <div class="card chart-container divtale" id='bieudoVipham'>
                    </div>
                </div>
            </div>
            <div className='col-sm-9'>
                <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
                <button onClick={()=>xuatExcelNam()} className='btn btn-primary'>Xuất excel</button>
                    <strong class="text-left"><i className='fa fa-users'></i> Doanh thu năm {curyear}</strong>
                    <div class="search-wrapper d-flex align-items-center">
                        <Select
                            className="select-container" 
                            onChange={locDoanhThuNam}
                            options={year}
                            getOptionLabel={(option) => option.label} 
                            getOptionValue={(option) => option.value}    
                            closeMenuOnSelect={false}
                            name='tinh'
                            placeholder="Chọn năm"
                        />
                    </div>
                </div>
                <div class="col-sm-12 divtale">
                    <div class="card chart-container divtale" id='bieudo'>
                    </div>
                </div>
            </div>
        </div>

        <div class="headerpageadmin d-flex justify-content-between align-items-center p-3 bg-light border">
            <strong class="text-left"><i className='fa fa-users'></i> Doanh thu theo ngày</strong>
            <div class="search-wrapper d-flex align-items-center">
                <RangePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder={["Từ ngày", "Đến ngày"]}
                    onChange={onDateChange}
                />  
                <span dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></span>
                <button onClick={()=>loadDoanhThuNgay()} className='btn btn-primary form-control btnhead'>Lọc doanh thu ngày</button>
                <span dangerouslySetInnerHTML={{__html:'&ThinSpace;'}}></span>
                <button onClick={()=>xuatExcelNgay()} className='btn btn-primary form-control btnhead'>Xuất file excel</button>
            </div>
        </div>
        {chartData && (
        <Bar
            data={chartData}
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Biểu đồ doanh thu theo ngày',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Doanh thu (VND)',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Ngày',
                        },
                    },
                },
            }}
        />
        )}
       </>
    );
}
function getMauSac(){
    var arr = ['#4e73df','#1cc88a','#36b9cc','#eb9534','#ed00c6','#edd500']
    var act = document.getElementsByClassName("border-left");
    var lbcard = document.getElementsByClassName("lbcard");
    for(var i=0; i<act.length; i++){
        act[i].style.borderLeft = '.25rem solid '+arr[i]
    }
    for(var i=0; i<lbcard.length; i++){
        lbcard[i].style.color = arr[i]
    }
}
export default ThongKeAdmin;