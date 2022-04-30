const alphabets = [
    'A', 'B', 'C', 'D', 'E', 'F',
    'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z'
]

let result = []

for(let i=0; i < alphabets.length; i+=2){
    result.push(alphabets[i + 1]);
    result.push(alphabets[i]);
}

console.log(result.join(' '));