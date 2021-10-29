export default function calcute(value = 1, number, minSize = 0) {

    // parse 
    let result = (value || 1) - number;
  
    // Jika lebih kecil
    result = result < minSize ? minSize : result;
    
    return `${result < 1 ? 1 : result}rem`
  
  }