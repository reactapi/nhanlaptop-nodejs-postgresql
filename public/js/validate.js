export const isInteger = (input) => {

    let reg = /^[0-9]+$/

    if (reg.test(input)) {
        return true;
    }
    return false
}

export const removeDuplicateSpaceAndTrim = (string) => {
    let reg = /[\s]+/g
    string = string.trim();
    return string.replace(reg, ' ');
}

export const noSpecialChars = (string) => {
    let reg = /^[\w-\s]+$/g
    if (reg.test(string)) {
        return true;
    }
    return false
}

export const removeAscent =  (str) => {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }

export const isValidName = (string) => {
    let reg = /^[a-zA-Z ]{1,30}$/;
    return reg.test(removeAscent(string))
}

export const handleUpperCaseFirstLetter = (string) => {
    string = string.toLowerCase();
    let result = string.split(' ').map((word) => {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    })
    return result.join(' ');
}

export const toSlug = (string) => {
    string = removeAscent(string.toLowerCase());
    let reg = /[\s]+/g
    return string.replace(reg,  '-');
}


export const isEmail = (input) => {
    let reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return reg.test(input);
}
