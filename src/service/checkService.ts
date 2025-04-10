import store from "config/store"

export default {
    envChecker: () => {
        const envTemplate = store.envTemplate

        const missingEnvVars = envTemplate.filter((key) => {
            const value = process.env[key];
            return !value || value.trim() === '';
        });

        if (missingEnvVars.length > 0) {
            console.error("Cảnh báo: thiếu biến môi trường:", missingEnvVars);

            console.warn('\x1b[33m%s\x1b[0m', '\nChương trình không thể khởi động nếu thiếu biến môi trường');
            process.exit(1); 
        } else {
            console.log("Tất cả biến môi trường đã được khai báo.");
        }
    }
}