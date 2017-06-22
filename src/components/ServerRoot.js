'use strict';

var serverApiRoot = '/health/';
var drugStoreApiRoot='/drug/';
var careplanApiRoot = '/careplan/';
var hostname = window.location.hostname,
    port = window.location.port,
    protocol = window.location.protocol + '//';

switch (hostname) {
    case 'localhost':
    case '127.0.0.1':
    case '192.168.3.70':
    case '192.168.3.46':
    case '192.168.3.23':
    case '192.168.3.55':
    case '192.168.3.32':
    case '192.168.3.40':
    // case 'test.mediportal.com.cn':
        switch (port) {
            case '':
            case '80':
            case '81':
            case '8080':
            case '8081':
            case '8082':
            case '9081':
            case '9082':
                serverApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/health/';
                drugStoreApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/drug/';
                careplanApiRoot = protocol + hostname + ':' + (port || '80') + '/vpn/careplan/';
                break;
        }
        break;
    default:
        serverApiRoot = protocol + hostname + '/health/';
        drugStoreApiRoot = protocol + hostname + '/drug/';
        careplanApiRoot = protocol + hostname + '/careplan/';
}


module.exports = {
    serverApiRoot: serverApiRoot,
    drugStoreApiRoot:drugStoreApiRoot,
    careplanApiRoot: careplanApiRoot
}
