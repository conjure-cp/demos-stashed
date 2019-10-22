var running = false;
myWorker = new Worker("athanorWorker.js");
myWorker.onmessage = function(e) {
    document.getElementById("console_output").innerHTML = e.data
}
function invoke() {
    if (!running) {
        myWorker.postMessage([document.getElementById("spec_text").value, document.getElementById("param_text").value])
        running = true;
    } else {
        console.log("terminating")
        myWorker.terminate();
    }
}

