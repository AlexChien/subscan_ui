let recordTimer
const timedCount = () => {
    if (recordTimer) {
        clearTimeout(recordTimer)
    }
    postMessage('heartbeat')
    recordTimer = setTimeout(() => {
        timedCount()
    }, 1000)
}

timedCount()