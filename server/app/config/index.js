/**
 * Created by zenghongtu on 02/09/2018.
 * Desc: server 配置文件
 */

export const port = process.env.PORT || 9000;
export const connexionString = ("mongodb://localhost:27017/tublog");
export const baseApi = process.env.NODE_ENV === 'development' ? '' : '/api/v1';
export const secret = 'this is a secret';
export const expires = 60 * 60 * 12;
