async function loadProvince(selectId, defaultValue = '') {
    $('#loading').show()
    let html = ``;
    await fetch('https://raw.githubusercontent.com/ngonhan71/hanhchinhvn/master/province.json')
        .then(response => response.json())
        .then(province => {
            $.each(province, function(index, item) {
                if (defaultValue) {
                    if (defaultValue == item['id']) {
                        html += `<option selected value="${item['id']}">${item['name']}</option>`;
                    } else {
                        html += `<option value="${item['id']}">${item['name']}</option>`;
                    }
                }
                else {
                    if (index == 0) {
                        html += `<option selected value="${item['id']}">${item['name']}</option>`;
                    } else {
                        html += `<option value="${item['id']}">${item['name']}</option>`;
                    }
                }
            })
        })
    $('#' + selectId).html(html)
    $('#loading').hide()
}
async function loadDistrict(selectId, provinceId, defaultValue = '') {
    $('#loading').show()
    let html = ``;
    await fetch('https://raw.githubusercontent.com/ngonhan71/hanhchinhvn/master/district.json')
        .then(response => response.json())
        .then(district => {
            let isFirst = true;
            $.each(district, function(index, item) {
                if (item['province_id'] == provinceId) {
                    if (defaultValue) {
                        if (defaultValue == item['id']) {
                            html += `<option selected value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                        } else  {
                            html += `<option value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                        }
                    }
                    else {
                        if (isFirst) {
                            html += `<option selected value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                            isFirst = false
                        } else  {
                            html += `<option value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                        }
                    }
                }
            })
        })
    $('#' + selectId).html(html)
    $('#loading').hide()
}
async function loadWard(selectId, provinceId, districtId, defaultValue = '') {
    $('#loading').show()
    let html = ``;
    await fetch('https://raw.githubusercontent.com/ngonhan71/hanhchinhvn/master/ward.json')
        .then(response => response.json())
        .then(ward => {
            let isFirst = true;
            $.each(ward, function(index, item) {
                if (item['province_id'] == provinceId && item['district_id'] == districtId) {
                    if (defaultValue) {
                        if (defaultValue == item['id']) {
                            html += `<option selected value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                            isFirst = false
                        } else  {
                            html += `<option value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                        }
                    }
                    else {
                        if (isFirst) {
                            html += `<option selected value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                            isFirst = false
                        } else  {
                            html += `<option value="${item['id']}">${item['prefix']} ${item['name']}</option>`;
                        }
                    }
                }
            })
        })
    $('#' + selectId).html(html)
    $('#loading').hide()
}

async function firstLoad(selectProvinceId, selectDistrictId, selectWardId) {

    await loadProvince(selectProvinceId)

    await loadDistrict(selectDistrictId, $('#' + selectProvinceId).val())

    loadWard(selectWardId, $('#' + selectProvinceId).val(), $('#' + selectDistrictId).val())

}


export { loadProvince, loadDistrict, loadWard, firstLoad };