import {
    D,
    on,
    // isArray,
    hasClass,
    addClass,
} from "domq.js/src/domq.modular";

// Static methods
// https://github.com/nzbin/domq#static-methods
const methods = {
    // isArray,
};

// Instance methods
// https://github.com/nzbin/domq#instance-methods
const fnMethods = {
    on,
    hasClass,
    addClass,
};

D.extend(methods);
D.fn.extend(fnMethods);

window.D = D;

export default D;
