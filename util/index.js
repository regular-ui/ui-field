import Regular from 'regularjs';

if (Regular.prototype.$one.toString()) {
    Regular.prototype.$one = function (event, fn) {
        const call = function (...args) {
            fn && fn.apply(this, args);
            this.$off(event, call);
        };
        return this.$on(event, call);
    };
}
