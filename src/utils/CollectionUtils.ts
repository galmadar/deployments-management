export default class CollectionUtils {
    static findCombinations = (arr: string[], startIndex: number, r: number): string[][] => {
        if (r === 1) {
            const result = [];
            for (let i = startIndex; i < arr.length; i++) {
                result.push([arr[i]]);
            }
            return result;
        }
        let tmpIndex = startIndex;
        const newResult: string[][] = [];
        while (tmpIndex < arr.length - r + 1) {
            const resultForR = CollectionUtils.findCombinations(arr, tmpIndex + 1, r - 1);
            resultForR.forEach((ar) => {
                newResult.push([arr[tmpIndex], ...ar]);
            });
            tmpIndex++;
        }
        return newResult;
    };
}
