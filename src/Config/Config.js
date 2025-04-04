import { apiBaseUrl } from "next-auth/client/_utils";

const apiconfig = {
        develpoment: {
                // apiBaseUrl: 'https://dev-api.trukapp.com/truk/',
                // apiBaseUrl: 'http://192.168.10.40:8088/truk/',    // teja ofc
                // apiBaseUrl: 'http://192.168.10.22:8088/truk/',    // teja ofc
                // // apiBaseUrl: 'http://192.168.29.78:8088/truk',    // teja pg
                // apiBaseUrl: 'http://192.168.10.33:8088/truk',   //Bablu local
                // apiBaseUrl: 'http://192.168.10.18:8088/truk',    // satish ofc
                apiBaseUrl:'http://192.168.1.147/truk' //sai
        },
};

export default apiconfig;

