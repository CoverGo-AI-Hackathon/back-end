import respondConfig from "config/respondConfig";

export default (code: number, respond: any) => {
    return {
        code: code,
        status: code || 'UNKNOWN',
        timestamp: new Date().toISOString(),
        respond: respond
    }
}