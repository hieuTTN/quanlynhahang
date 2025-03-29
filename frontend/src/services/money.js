function formatMoney(money) {
    const VND = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    });
    return VND.format(money);
}


function formatPrice(price){
    if(price == 0){
      return "Giá thỏa thuận";
    }
    if(price.toString().length <= 9){
        return price / 1000000 + " triệu";
    }
    if(price.toString().length > 9){
        return price / 1000000000 + " tỷ";
    }
}

function formatPriceLT(price){
    if(price == 0){
      return "Giá thỏa thuận";
    }
    if(price.length <= 9){
        var num = price / 1000000
        num = num.toFixed(1)
        return num + " triệu";
    }
    if(price. length >9){
        var num = price / 1000000000
        num = num.toFixed(1)
        return num  + " tỉ";
    }
  }


export {formatMoney, formatPrice, formatPriceLT}