const arr = ["1", "2", "3", "4", "5"];
const r = 2;


const combinations: any = []

function f(arr: string[], currIndex: number, r: number, combination: string[]) {
    if (r === 1) {
        combination.push(arr[currIndex])
        combinations.push(combination)
        return
    }
    f(arr, currIndex + 1, r - 1, [arr[currIndex]])
}

f(arr, 0, 2, [])
console.log(combinations)
