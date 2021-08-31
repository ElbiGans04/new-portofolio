export default function calcute(value, number, minSize) {

    // parse 
    let result = (value || 1) - number;
  
    // Jika lebih kecil
    result = result < minSize ? minSize : result;
    
    return `${result < 1 ? 1 : result}rem`
  
  }