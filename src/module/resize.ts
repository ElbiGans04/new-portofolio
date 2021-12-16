export default function calcute(value: number, kurang: number, minSize: number) {

    // parse 
    let result = value - kurang;
  
    // Jika lebih kecil
    result = result < minSize ? minSize : result;
    
    return `${result}rem`
  
  }