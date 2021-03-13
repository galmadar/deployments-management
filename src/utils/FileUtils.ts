import fs from "fs";

export default class FileUtils {
    static readFile = async (filePath: string) => {
        if (!fs.existsSync(filePath)) {
            return null;
        }
        return fs.readFileSync(filePath, {encoding: "utf-8"});
    };
    static writeFile = (filePath: string, data: string) => {
        return fs.writeFileSync(filePath, data, {encoding: "utf-8", flag: "w"});
    };
}
