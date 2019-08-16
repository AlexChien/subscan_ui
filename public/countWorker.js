var timer;

this.onmessage = function (e) {
    var data = e.data;
    switch (data.cmd) {
        case 'stop':
            clearInterval(timer);
            this.close();
            break;
        case 'count':
            clearInterval(timer);
            timer = setInterval(function () {
                postMessage({type:'count', data: --data.count});
            }, 1000);
            break;
        case 'countObj':
            clearInterval(timer);
            var isStop;
            timer = setInterval(function () {
                isStop = true;
                for (var key in data.countObj) {
                    data.countObj[key]--;
                    if (data.countObj[key] > 0) {
                        isStop = false;
                    }
                }
                postMessage({type:'countObj', data: data.countObj});
                if (isStop) {
                    postMessage({type:'stop'});
                }
            }, 1000);
            break;
        default:
            postMessage('no cmd');
    }
}