const brackets = (str) => {

    if( typeof str !== 'string' || str.length < 2) {
        return false;
    } 
    
    const map = {
        ")" : "(",
        "}" : "{",
        "]" : "["
    }
    const start = [ '(', '{', '[' ];
    const end = ")}]";
    let quoue = [];
        for(let i = 0; i < str.length; i++) {
            const step = str[i];
            if(start.includes(step)) {
                quoue.push(step)
            } else if(end.includes(step)) {
                const last = quoue.pop();
                if(map[step] !== last) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return !quoue.length;
    
    }
    
    module.exports = brackets;